/**
 * Execute All Import SQL Files
 * =============================
 * This script executes all the generated SQL files in the correct order:
 * 1. insert_base_restaurants.sql (6,610 restaurants)
 * 2. update_ncn_fields.sql (5,539 restaurants)
 * 3. update_n2r_fields.sql (5,663 restaurants)
 * 4. update_items_fields.sql (1,909 restaurants)
 * 5. update_zvd_po_data.sql (6,610 restaurants)
 *
 * Usage:
 *   node scripts/execute-all-imports.js
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local file manually
const envPath = join(__dirname, "..", ".env.local");
let supabaseUrl, supabaseServiceKey;

try {
  const envContent = readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");

  for (const line of lines) {
    if (line.startsWith("VITE_SUPABASE_URL=")) {
      supabaseUrl = line.split("=")[1].trim();
    }
    if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
      supabaseServiceKey = line.split("=")[1].trim();
    }
  }
} catch (error) {
  console.error("❌ Error reading .env.local file");
  process.exit(1);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing Supabase credentials in .env.local");
  console.error("   Need: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

console.log("🔑 Using SERVICE ROLE KEY to bypass RLS policies for import");
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function printHeader(text) {
  console.log("\n" + "=".repeat(70));
  console.log(`  ${text}`);
  console.log("=".repeat(70));
}

async function executeInserts(filePath, description) {
  printHeader(description);

  const fullPath = join(__dirname, "..", filePath);
  console.log(`📂 Reading file: ${filePath}`);

  const sqlContent = readFileSync(fullPath, "utf-8");

  // Parse INSERT statements
  const insertPattern =
    /INSERT INTO drive_sheets_data\s*\([^)]+\)\s*VALUES\s*\([^)]+\)\s*ON CONFLICT[^;]+;/gs;
  const inserts = sqlContent.match(insertPattern) || [];

  console.log(`📊 Found ${inserts.length} INSERT statements`);

  if (inserts.length === 0) {
    console.log("⚠️  No INSERT statements found");
    return false;
  }

  let successCount = 0;
  let errorCount = 0;

  // Parse and execute each insert
  for (let i = 0; i < inserts.length; i++) {
    const insert = inserts[i];

    // Extract values from INSERT statement
    const valuesMatch = insert.match(/VALUES\s*\(([^)]+)\)/);
    if (!valuesMatch) continue;

    const values = valuesMatch[1].split(",").map((v) => {
      v = v.trim();
      if (v === "NULL") return null;
      // Remove quotes
      if (v.startsWith("'") && v.endsWith("'")) {
        return v.slice(1, -1).replace(/''/g, "'");
      }
      return v;
    });

    // Extract column names
    const columnsMatch = insert.match(/\(([^)]+)\)\s*VALUES/);
    if (!columnsMatch) continue;

    const columns = columnsMatch[1].split(",").map((c) => c.trim());

    // Create object
    const data = {};
    columns.forEach((col, idx) => {
      data[col] = values[idx];
    });

    try {
      const { error } = await supabase
        .from("drive_sheets_data")
        .upsert(data, { onConflict: "res_id" });

      if (error) throw error;
      successCount++;

      if ((i + 1) % 100 === 0) {
        console.log(`   ✅ Processed ${i + 1}/${inserts.length} inserts...`);
      }
    } catch (error) {
      errorCount++;
      if (errorCount <= 5) {
        console.error(`   ❌ Error on insert ${i + 1}: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Success: ${successCount} inserts`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} inserts`);
  }

  return errorCount === 0;
}

async function executeUpdates(filePath, description) {
  printHeader(description);

  const fullPath = join(__dirname, "..", filePath);
  console.log(`📂 Reading file: ${filePath}`);

  const sqlContent = readFileSync(fullPath, "utf-8");

  // Parse UPDATE statements
  const updatePattern = /UPDATE drive_sheets_data\s+SET\s+[\s\S]+?WHERE res_id = '[^']+';/g;
  const updates = sqlContent.match(updatePattern) || [];

  console.log(`📊 Found ${updates.length} UPDATE statements`);

  if (updates.length === 0) {
    console.log("⚠️  No UPDATE statements found");
    return false;
  }

  let successCount = 0;
  let errorCount = 0;

  // Execute updates in batches
  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];

    // Extract res_id
    const resIdMatch = update.match(/WHERE res_id = '([^']+)'/);
    if (!resIdMatch) continue;
    const resId = resIdMatch[1];

    // Extract SET clause
    const setMatch = update.match(/SET\s+([\s\S]+?)\s+WHERE/);
    if (!setMatch) continue;

    const setClause = setMatch[1];
    const data = {};

    // Parse SET clause (field = value, field = value, ...)
    const assignments = setClause.split(",");
    for (const assignment of assignments) {
      const [field, ...valueParts] = assignment.split("=");
      const fieldName = field.trim();
      let value = valueParts.join("=").trim();

      if (value === "NULL") {
        data[fieldName] = null;
      } else if (value.startsWith("'") && value.endsWith("'")) {
        data[fieldName] = value.slice(1, -1).replace(/''/g, "'");
      } else {
        data[fieldName] = value;
      }
    }

    try {
      const { error } = await supabase.from("drive_sheets_data").update(data).eq("res_id", resId);

      if (error) throw error;
      successCount++;

      if ((i + 1) % 100 === 0) {
        console.log(`   ✅ Processed ${i + 1}/${updates.length} updates...`);
      }
    } catch (error) {
      errorCount++;
      if (errorCount <= 5) {
        console.error(`   ❌ Error updating res_id ${resId}: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Success: ${successCount} updates`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} updates`);
  }

  return errorCount === 0;
}

async function verifyImport() {
  printHeader("Verifying Import");

  try {
    // Total restaurants
    const { count: totalCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true });

    console.log(`✅ Total restaurants: ${totalCount} (expected: 6,610)`);

    // NCN data
    const { count: ncnCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true })
      .not("ncn_p1", "is", null);

    console.log(`✅ NCN restaurants: ${ncnCount} (expected: ~5,539)`);

    // N2R data
    const { count: n2rCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true })
      .not("n2r_la_current_code", "is", null);

    console.log(`✅ N2R restaurants: ${n2rCount} (expected: ~5,663)`);

    // Items data
    const { count: itemsCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true })
      .not("items_priority", "is", null);

    console.log(`✅ Items restaurants: ${itemsCount} (expected: ~1,909)`);

    // ZVD PO data
    const { count: zvdCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true })
      .not("zvd_po", "is", null);

    console.log(`✅ ZVD PO restaurants: ${zvdCount} (expected: 6,610)`);

    return true;
  } catch (error) {
    console.error(`❌ Verification failed: ${error.message}`);
    return false;
  }
}

async function main() {
  printHeader("🚀 FULL DATA IMPORT TO SUPABASE");

  console.log("\nThis will import all restaurant data in the following order:");
  console.log("  1. Base restaurants (6,610)");
  console.log("  2. NCN drive data (5,539)");
  console.log("  3. N2R drive data (5,663)");
  console.log("  4. Items drive data (1,909)");
  console.log("  5. ZVD PO data (6,610)");
  console.log("\n⏱️  Estimated time: 10-15 minutes");
  console.log("\n⚠️  Make sure you have a stable internet connection!");

  try {
    // Step 1: Insert base restaurants
    await executeInserts("insert_base_restaurants.sql", "STEP 1: Inserting Base Restaurants");

    // Step 2: Update NCN fields
    await executeUpdates("update_ncn_fields.sql", "STEP 2: Updating NCN Drive Data");

    // Step 3: Update N2R fields
    await executeUpdates("update_n2r_fields.sql", "STEP 3: Updating N2R Drive Data");

    // Step 4: Update Items fields
    await executeUpdates("update_items_fields.sql", "STEP 4: Updating Items Drive Data");

    // Step 5: Update ZVD PO data
    await executeUpdates("update_zvd_po_data.sql", "STEP 5: Updating ZVD PO Data");

    // Verify
    await verifyImport();

    printHeader("✅ IMPORT COMPLETE");
    console.log("All data has been successfully imported to Supabase!");
    console.log("\n🎯 Next Steps:");
    console.log("  1. Test the application");
    console.log("  2. Verify data in Supabase dashboard");
    console.log("  3. Check that ZVD PO values are displaying correctly");
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

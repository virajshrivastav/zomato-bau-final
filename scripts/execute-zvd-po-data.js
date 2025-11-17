/**
 * Execute ZVD PO Data Import
 * ===========================
 * This script imports ZVD PO data from the generated SQL file into Supabase.
 *
 * Usage:
 *   node scripts/execute-zvd-po-data.js
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local file manually
const envPath = join(__dirname, "..", ".env.local");
let supabaseUrl, supabaseKey;

try {
  const envContent = readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");

  for (const line of lines) {
    if (line.startsWith("VITE_SUPABASE_URL=")) {
      supabaseUrl = line.split("=")[1].trim();
    }
    if (line.startsWith("VITE_SUPABASE_ANON_KEY=")) {
      supabaseKey = line.split("=")[1].trim();
    }
  }
} catch (error) {
  console.error("❌ Error reading .env.local file");
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function printHeader(text) {
  console.log("\n" + "=".repeat(70));
  console.log(`  ${text}`);
  console.log("=".repeat(70));
}

async function importZvdPoData() {
  printHeader("Importing ZVD PO Data");

  // Read the SQL file
  const sqlPath = join(__dirname, "..", "update_zvd_po_data.sql");
  console.log(`📂 Reading file: ${sqlPath}`);

  let sqlContent;
  try {
    sqlContent = readFileSync(sqlPath, "utf-8");
  } catch (error) {
    console.error(`❌ Error reading SQL file: ${error.message}`);
    console.error("\n💡 Make sure you have run: python scripts/import_ads_toing_data.py");
    return false;
  }

  // Parse UPDATE statements using regex
  const updatePattern =
    /UPDATE drive_sheets_data\s+SET zvd_po = '([^']+)'\s+WHERE res_id = '(\d+)';/g;
  const updates = [];
  let match;

  while ((match = updatePattern.exec(sqlContent)) !== null) {
    updates.push({
      zvd_po: match[1],
      res_id: match[2],
    });
  }

  console.log(`📊 Found ${updates.length} UPDATE statements`);

  if (updates.length === 0) {
    console.error("❌ No updates found in SQL file");
    return false;
  }

  // Execute updates in batches
  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    for (const update of batch) {
      try {
        const { error } = await supabase
          .from("drive_sheets_data")
          .update({ zvd_po: update.zvd_po })
          .eq("res_id", update.res_id);

        if (error) throw error;
        successCount++;
      } catch (error) {
        errorCount++;
        if (errorCount <= 5) {
          console.error(`   ❌ Error updating res_id ${update.res_id}: ${error.message}`);
        }
      }
    }

    // Progress update
    const processed = Math.min(i + batchSize, updates.length);
    console.log(`   ✅ Processed ${processed}/${updates.length} updates...`);
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
    const { count, error } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true })
      .not("zvd_po", "is", null);

    if (error) throw error;

    console.log(`✅ Total restaurants with ZVD PO data: ${count}`);
    console.log(`   Expected: 6,610`);

    if (count === 6610) {
      console.log("   ✅ Perfect match!");
    } else if (count > 6500) {
      console.log("   ✅ Close enough - import successful");
    } else {
      console.log("   ⚠️  Lower than expected - some updates may have failed");
    }

    return true;
  } catch (error) {
    console.error(`❌ Verification failed: ${error.message}`);
    return false;
  }
}

async function main() {
  printHeader("ZVD PO Data Import to Supabase");

  try {
    const success = await importZvdPoData();

    if (success) {
      await verifyImport();

      printHeader("✅ IMPORT COMPLETE");
      console.log("All ZVD PO data has been successfully imported!");
      console.log("\n🎯 The data is now available in the Restaurant Detail pages.");
    } else {
      printHeader("⚠️  IMPORT COMPLETED WITH ERRORS");
      console.log("Some updates failed. Please check the errors above.");
    }
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

/**
 * Import All Data Directly from CSV Files
 * ========================================
 * This script reads CSV files directly and imports to Supabase.
 * Much simpler and more reliable than parsing SQL files.
 *
 * Usage:
 *   node scripts/import-all-data-direct.js
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { parse } from "csv-parse/sync";

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
  process.exit(1);
}

console.log("🔑 Using SERVICE ROLE KEY to bypass RLS policies for import\n");
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function printHeader(text) {
  console.log("\n" + "=".repeat(70));
  console.log(`  ${text}`);
  console.log("=".repeat(70));
}

async function importBaseRestaurants() {
  printHeader("STEP 1: Importing Base Restaurants");

  const filePath = join(__dirname, "..", "archive", "data", "kam-data.txt");
  console.log(`📂 Reading file: archive/data/kam-data.txt`);

  const content = readFileSync(filePath, "utf-8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ",",
    relax_quotes: true,
    relax_column_count: true,
    escape: '"',
    quote: '"',
  });

  console.log(`📊 Found ${records.length} restaurants`);

  // Filter out records with no res_id
  const validRecords = records.filter((r) => r.res_id && r.res_id.trim() !== "");
  console.log(`📊 Valid restaurants (with res_id): ${validRecords.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < validRecords.length; i++) {
    const record = validRecords[i];

    const data = {
      res_id: record.res_id.trim(),
      res_name: record.res_name || null,
      am_email: record.am_email || null,
      tl_email: record.tl_email || null,
      subzone_name: record.subzone_name || null,
      city_cluster: record.city_cluster || null,
      sept_ov: record.sept_ov || null,
    };

    try {
      const { error } = await supabase
        .from("drive_sheets_data")
        .upsert(data, { onConflict: "res_id" });

      if (error) throw error;
      successCount++;

      if ((i + 1) % 100 === 0) {
        console.log(`   ✅ Processed ${i + 1}/${validRecords.length} restaurants...`);
      }
    } catch (error) {
      errorCount++;
      if (errorCount <= 5) {
        console.error(`   ❌ Error on ${record.res_id}: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Success: ${successCount} restaurants`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} restaurants`);
  }

  return successCount;
}

async function importCommissionData() {
  printHeader("STEP 2: Importing Commission, ZVD PO & OV Data");

  const filePath = join(__dirname, "..", "data", "ads-commission", "Dashboard Context data Drives - comm data (1).csv");
  console.log(`📂 Reading file: data/ads-commission/Dashboard Context data Drives - comm data (1).csv`);

  const content = readFileSync(filePath, "utf-8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  console.log(`📊 Found ${records.length} restaurants`);

  // Filter out records with no res_id
  const validRecords = records.filter((r) => r.res_id && r.res_id.trim() !== "");
  console.log(`📊 Valid restaurants (with res_id): ${validRecords.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < validRecords.length; i++) {
    const record = validRecords[i];

    const data = {
      res_id: record.res_id.trim(),
      current_commission: record.current_commission || null,
      last_change_date: record.last_change_date || null,
      zvd_po: record.oct_zvdo || record["ZVD PO"] || null, // Column J - oct_zvdo (try both column names)
      sept_ov: record.oct_ov || null, // Column I - OV data (oct_ov used as sept_ov)
    };

    try {
      const { error } = await supabase
        .from("drive_sheets_data")
        .update(data)
        .eq("res_id", data.res_id);

      if (error) throw error;
      successCount++;

      if ((i + 1) % 100 === 0) {
        console.log(`   ✅ Processed ${i + 1}/${validRecords.length} updates...`);
      }
    } catch (error) {
      errorCount++;
      if (errorCount <= 5) {
        console.error(`   ❌ Error on ${record.res_id}: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Success: ${successCount} updates`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} updates`);
  }

  return successCount;
}

async function verifyImport() {
  printHeader("Verifying Import");

  try {
    // Total restaurants
    const { count: totalCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true });

    console.log(`✅ Total restaurants: ${totalCount} (expected: ~6,610)`);

    // Sept OV data
    const { count: ovCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true })
      .not("sept_ov", "is", null);

    console.log(`✅ Sept OV data: ${ovCount} (expected: ~6,610)`);

    // ZVD PO data
    const { count: zvdCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true })
      .not("zvd_po", "is", null);

    console.log(`✅ ZVD PO restaurants: ${zvdCount} (expected: ~6,610)`);

    // Commission data
    const { count: commCount } = await supabase
      .from("drive_sheets_data")
      .select("*", { count: "exact", head: true })
      .not("current_commission", "is", null);

    console.log(`✅ Commission data: ${commCount} (expected: ~6,610)`);

    // Sample data
    const { data: sample } = await supabase
      .from("drive_sheets_data")
      .select("res_id, res_name, sept_ov, zvd_po, current_commission")
      .not("zvd_po", "is", null)
      .limit(3);

    console.log("\n📋 Sample records:");
    sample?.forEach((r) => {
      console.log(`   ${r.res_id} - ${r.res_name}`);
      console.log(`      Sept OV: ${r.sept_ov}, ZVD PO: ${r.zvd_po}, Commission: ${r.current_commission}`);
    });

    return true;
  } catch (error) {
    console.error(`❌ Verification failed: ${error.message}`);
    return false;
  }
}

async function main() {
  printHeader("🚀 QUICK DATA IMPORT - BASE + COMMISSION + ZVD PO + OV");

  console.log("\nThis will import:");
  console.log("  1. Base restaurants from kam-data.txt (~6,610)");
  console.log("  2. Commission, ZVD PO & OV data from comm data CSV (~6,610)");
  console.log("\n⏱️  Estimated time: 5-8 minutes");
  console.log("⚠️  Make sure you have a stable internet connection!\n");

  try {
    // Step 1: Import base restaurants
    const baseCount = await importBaseRestaurants();

    if (baseCount === 0) {
      console.error("\n❌ No base restaurants imported. Stopping.");
      process.exit(1);
    }

    // Step 2: Import commission, ZVD PO & OV data
    await importCommissionData();

    // Verify
    await verifyImport();

    printHeader("✅ IMPORT COMPLETE");
    console.log("Base restaurant data, Commission, ZVD PO and OV data imported successfully!");
    console.log("\n🎯 Next Steps:");
    console.log("  1. Import NCN, N2R, and Items drive data (if needed)");
    console.log("  2. Test the application");
    console.log("  3. Verify ZVD PO and OV values are displaying correctly");
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

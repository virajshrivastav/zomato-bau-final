/**
 * Debug ZVD PO Import
 * ====================
 * Check why the updates aren't working
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log("🔍 Debugging ZVD PO Import\n");

  // 1. Check total restaurants in database
  const { count: totalCount } = await supabase
    .from("drive_sheets_data")
    .select("*", { count: "exact", head: true });

  console.log(`📊 Total restaurants in database: ${totalCount}`);

  // 2. Check sample res_ids from database
  const { data: sampleDb } = await supabase
    .from("drive_sheets_data")
    .select("res_id, res_name")
    .limit(5);

  console.log("\n📋 Sample res_ids from database:");
  sampleDb?.forEach((r) => console.log(`   ${r.res_id} - ${r.res_name}`));

  // 3. Read sample from SQL file
  const sqlPath = join(__dirname, "..", "update_zvd_po_data.sql");
  const sqlContent = readFileSync(sqlPath, "utf-8");
  const lines = sqlContent
    .split("\n")
    .filter((l) => l.includes("WHERE res_id"))
    .slice(0, 5);

  console.log("\n📋 Sample res_ids from SQL file:");
  lines.forEach((line) => {
    const match = line.match(/WHERE res_id = '(\d+)'/);
    if (match) console.log(`   ${match[1]}`);
  });

  // 4. Try to find one of the SQL res_ids in the database
  const firstMatch = lines[0]?.match(/WHERE res_id = '(\d+)'/);
  if (firstMatch) {
    const testResId = firstMatch[1];
    console.log(`\n🔍 Checking if res_id ${testResId} exists in database...`);

    const { data, error } = await supabase
      .from("drive_sheets_data")
      .select("res_id, res_name, zvd_po")
      .eq("res_id", testResId);

    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`   ✅ Found: ${data[0].res_name}`);
      console.log(`   Current zvd_po: ${data[0].zvd_po || "NULL"}`);
    } else {
      console.log(`   ❌ NOT FOUND in database`);
      console.log(`   This is the problem! The res_ids in the CSV don't exist in the database.`);
    }
  }

  // 5. Check if zvd_po column has any data
  const { count: zvdCount } = await supabase
    .from("drive_sheets_data")
    .select("*", { count: "exact", head: true })
    .not("zvd_po", "is", null);

  console.log(`\n📊 Restaurants with zvd_po data: ${zvdCount}`);

  // 6. Try a manual update on one restaurant that exists
  if (sampleDb && sampleDb.length > 0) {
    const testRes = sampleDb[0];
    console.log(`\n🧪 Testing manual update on ${testRes.res_id}...`);

    const { error: updateError } = await supabase
      .from("drive_sheets_data")
      .update({ zvd_po: "999.99" })
      .eq("res_id", testRes.res_id);

    if (updateError) {
      console.log(`   ❌ Update failed: ${updateError.message}`);
    } else {
      console.log(`   ✅ Update successful!`);

      // Verify
      const { data: verifyData } = await supabase
        .from("drive_sheets_data")
        .select("zvd_po")
        .eq("res_id", testRes.res_id)
        .single();

      console.log(`   Verified zvd_po: ${verifyData?.zvd_po}`);

      // Rollback
      await supabase
        .from("drive_sheets_data")
        .update({ zvd_po: null })
        .eq("res_id", testRes.res_id);

      console.log(`   ✅ Rolled back test update`);
    }
  }
}

debug().catch(console.error);

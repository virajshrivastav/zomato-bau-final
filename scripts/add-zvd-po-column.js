/**
 * Add ZVD PO Column to Database
 * ==============================
 * This script adds the zvd_po column to the drive_sheets_data table.
 *
 * Usage:
 *   node scripts/add-zvd-po-column.js
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

async function addZvdPoColumn() {
  printHeader("Adding ZVD PO Column to Database");

  const sql = `
    ALTER TABLE drive_sheets_data
    ADD COLUMN IF NOT EXISTS zvd_po TEXT;
  `;

  console.log("📋 SQL to execute:");
  console.log(sql);
  console.log("\n⚠️  This needs to be executed in Supabase SQL Editor");
  console.log("    because the Supabase client cannot execute DDL statements.");
  console.log("\n📍 Steps:");
  console.log("    1. Go to: https://supabase.com/dashboard/project/npmnpncyuqzluhqralkb/sql");
  console.log("    2. Copy and paste the SQL above");
  console.log('    3. Click "Run"');
  console.log("\n✋ Alternatively, execute the file:");
  console.log("    supabase/add_zvd_po_column.sql");
}

async function verifyColumn() {
  printHeader("Verifying Column (after manual execution)");

  try {
    const { data, error } = await supabase
      .from("drive_sheets_data")
      .select("res_id, zvd_po")
      .limit(1);

    if (error) {
      if (error.message.includes('column "zvd_po" does not exist')) {
        console.log("❌ Column does not exist yet");
        console.log("   Please execute the SQL in Supabase SQL Editor first");
        return false;
      }
      throw error;
    }

    console.log("✅ Column verified - zvd_po exists in drive_sheets_data table");
    return true;
  } catch (error) {
    console.error(`❌ Verification failed: ${error.message}`);
    return false;
  }
}

async function main() {
  printHeader("ZVD PO Column Setup");

  try {
    // Check if column already exists
    console.log("\n🔍 Checking if column already exists...");
    const exists = await verifyColumn();

    if (exists) {
      printHeader("✅ COLUMN ALREADY EXISTS");
      console.log("The zvd_po column is already in the database.");
      console.log("\n🎯 Next Step:");
      console.log("   Run: node scripts/execute-zvd-po-data.js");
      console.log("   Or execute: update_zvd_po_data.sql");
    } else {
      await addZvdPoColumn();

      printHeader("⏳ WAITING FOR MANUAL EXECUTION");
      console.log("\nAfter executing the SQL in Supabase:");
      console.log("   Run: node scripts/execute-zvd-po-data.js");
    }
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

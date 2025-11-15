#!/usr/bin/env node

/**
 * Execute SQL files in Supabase using PostgreSQL connection
 * This script executes the generated SQL files in the correct order using pg library
 */

import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL files to execute in order
const SQL_FILES = [
  { name: "insert_base_restaurants.sql", description: "Insert base restaurants" },
  { name: "update_ncn_fields.sql", description: "Update NCN drive data" },
  { name: "update_n2r_fields.sql", description: "Update N2R drive data" },
  { name: "update_items_fields.sql", description: "Update Items drive data" },
  { name: "verify_import.sql", description: "Verification queries", skipExecution: true },
];

/**
 * Prompt for user input
 */
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Execute SQL file using PostgreSQL client
 */
async function executeSqlFile(client, filePath, fileName, description) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`📄 Executing: ${fileName}`);
  console.log(`📝 Description: ${description}`);
  console.log("=".repeat(70));

  try {
    // Read SQL file
    const sql = fs.readFileSync(filePath, "utf8");

    // Count statements (rough estimate)
    const statements = sql
      .split(";")
      .filter((s) => s.trim().length > 0 && !s.trim().startsWith("--"));
    console.log(`📊 Statements to execute: ~${statements.length}`);

    const startTime = Date.now();

    // Execute SQL
    const result = await client.query(sql);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`✅ Successfully executed ${fileName}`);
    console.log(`⏱️  Duration: ${duration}s`);

    if (result.rowCount !== null) {
      console.log(`📈 Rows affected: ${result.rowCount}`);
    }

    return true;
  } catch (err) {
    console.error(`❌ Error executing ${fileName}:`);
    console.error(`   Message: ${err.message}`);
    if (err.position) {
      console.error(`   Position: ${err.position}`);
    }
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log("🚀 Supabase SQL File Executor (PostgreSQL)\n");
  console.log("This script will execute the following SQL files in order:");
  SQL_FILES.forEach((file, index) => {
    const status = file.skipExecution ? "(manual execution)" : "";
    console.log(`   ${index + 1}. ${file.name} - ${file.description} ${status}`);
  });

  // Get database password
  console.log("\n⚠️  You need your Supabase DATABASE PASSWORD to execute SQL files.");
  console.log("📍 Find it at: Dashboard → Settings → Database → Database password");
  console.log(
    "💡 Or use the connection string from: Dashboard → Settings → Database → Connection string\n"
  );

  const dbPassword = await prompt("Enter your Supabase database password: ");

  if (!dbPassword || dbPassword.trim().length === 0) {
    console.error("❌ Database password is required!");
    process.exit(1);
  }

  // PostgreSQL connection config
  // Using direct connection (not pooler) for better compatibility
  const connectionConfig = {
    host: "aws-0-ap-south-1.pooler.supabase.com",
    port: 5432,
    database: "postgres",
    user: "postgres.lqtjghnremwiybqzmprn",
    password: dbPassword.trim(),
    ssl: {
      rejectUnauthorized: false,
    },
  };

  console.log("\n🔗 Connecting to Supabase PostgreSQL...");
  console.log(`   Host: ${connectionConfig.host}`);
  console.log(`   Database: ${connectionConfig.database}`);
  console.log(`   User: ${connectionConfig.user}`);

  // Create PostgreSQL client
  const client = new Client(connectionConfig);

  try {
    await client.connect();
    console.log("✅ Connected to database successfully!");

    // Test connection
    const testResult = await client.query("SELECT COUNT(*) FROM drive_sheets_data");
    console.log(`📊 Current restaurants in database: ${testResult.rows[0].count}`);
  } catch (err) {
    console.error("❌ Failed to connect to database:");
    console.error(`   ${err.message}`);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check your database password is correct");
    console.error(
      "   2. Ensure your IP is allowed in Supabase (Settings → Database → Connection pooling)"
    );
    console.error("   3. Try using the connection string from Supabase dashboard");
    process.exit(1);
  }

  // Confirm execution
  const confirm = await prompt(
    "\n⚠️  Ready to execute SQL files? This will modify your database. (yes/no): "
  );

  if (confirm.toLowerCase() !== "yes") {
    console.log("❌ Execution cancelled");
    await client.end();
    process.exit(0);
  }

  console.log("\n🚀 Starting execution...\n");

  let successCount = 0;
  let failCount = 0;

  // Execute each SQL file
  for (const fileInfo of SQL_FILES) {
    const filePath = path.join(__dirname, "..", fileInfo.name);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${fileInfo.name}`);
      console.error(`   Expected at: ${filePath}`);
      failCount++;
      continue;
    }

    // Skip verification file (it's for manual review)
    if (fileInfo.skipExecution) {
      console.log(`\n${"=".repeat(70)}`);
      console.log(`📄 ${fileInfo.name} - ${fileInfo.description}`);
      console.log("=".repeat(70));
      console.log(`⏭️  Skipping execution (verification queries should be run manually)`);
      console.log(`📋 File location: ${filePath}`);
      console.log(`🔗 Run in: https://supabase.com/dashboard/project/lqtjghnremwiybqzmprn/sql/new`);
      continue;
    }

    // Execute the file
    const success = await executeSqlFile(client, filePath, fileInfo.name, fileInfo.description);

    if (success) {
      successCount++;
    } else {
      failCount++;

      // Ask if user wants to continue
      const continueExec = await prompt(
        "\n⚠️  Error occurred. Continue with next file? (yes/no): "
      );
      if (continueExec.toLowerCase() !== "yes") {
        console.log("❌ Execution stopped by user");
        break;
      }
    }
  }

  // Close connection
  await client.end();
  console.log("\n🔌 Database connection closed");

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 EXECUTION SUMMARY");
  console.log("=".repeat(70));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`⏭️  Skipped: ${SQL_FILES.filter((f) => f.skipExecution).length}`);

  if (failCount === 0) {
    console.log("\n🎉 All SQL files executed successfully!");
    console.log("\n📊 Next Steps:");
    console.log("   1. Run verify_import.sql in Supabase SQL Editor to check data integrity");
    console.log("   2. Verify data in Supabase dashboard");
    console.log("   3. Test frontend with imported data");
    console.log(
      "\n🔗 Supabase SQL Editor: https://supabase.com/dashboard/project/lqtjghnremwiybqzmprn/sql/new"
    );
  } else {
    console.log("\n⚠️  Some files failed to execute. Please review the errors above.");
  }
}

// Run the script
main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});

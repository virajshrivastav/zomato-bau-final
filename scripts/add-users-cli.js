/**
 * CLI Script to add users from kam-data.txt to Supabase Authentication
 *
 * This script prompts for the Service Role Key via CLI for security
 *
 * Usage: node scripts/add-users-cli.js
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = "https://lqtjghnremwiybqzmprn.supabase.co";
const PASSWORD = "1234";

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
 * Extract unique emails from kam-data.txt
 */
function extractUniqueEmails() {
  const filePath = path.join(__dirname, "..", "kam-data.txt");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");

  const emails = new Set();

  // Skip header line (line 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(",");
    if (columns.length >= 4) {
      const email = columns[3].trim(); // am_email is the 4th column (index 3)
      if (email && email.includes("@zomato.com")) {
        emails.add(email);
      }
    }
  }

  return Array.from(emails).sort();
}

/**
 * Create a user in Supabase Auth
 */
async function createUser(supabase, email) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: PASSWORD,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        created_by: "bulk_import_cli_script",
        source: "kam-data.txt",
        created_at: new Date().toISOString(),
      },
    });

    if (error) {
      // Check if user already exists
      if (
        error.message.includes("already registered") ||
        error.message.includes("already been registered")
      ) {
        return { success: true, email, status: "already_exists" };
      }
      return { success: false, email, error: error.message };
    }

    return { success: true, email, status: "created", userId: data.user.id };
  } catch (err) {
    return { success: false, email, error: err.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   Supabase User Creation - CLI Tool                       ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  // Extract unique emails first
  console.log("📧 Extracting unique emails from kam-data.txt...");
  const emails = extractUniqueEmails();
  console.log(`✅ Found ${emails.length} unique emails\n`);

  // Show preview
  console.log("📋 Preview of emails to be added:");
  emails.slice(0, 5).forEach((email, index) => {
    console.log(`   ${index + 1}. ${email}`);
  });
  if (emails.length > 5) {
    console.log(`   ... and ${emails.length - 5} more\n`);
  }

  // Prompt for Service Role Key
  console.log("🔐 To proceed, you need your Supabase Service Role Key");
  console.log("   Get it from: Supabase Dashboard → Settings → API → service_role\n");

  const serviceRoleKey = await prompt("Enter your Service Role Key: ");

  if (!serviceRoleKey || serviceRoleKey.trim() === "") {
    console.log("\n❌ Error: Service Role Key is required");
    process.exit(1);
  }

  // Create Supabase admin client
  const supabase = createClient(SUPABASE_URL, serviceRoleKey.trim(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Confirm before proceeding
  console.log(`\n⚠️  About to create ${emails.length} users with password: ${PASSWORD}`);
  const confirm = await prompt("Continue? (yes/no): ");

  if (confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "y") {
    console.log("\n❌ Operation cancelled");
    process.exit(0);
  }

  // Create users
  console.log("\n👤 Creating users in Supabase...\n");

  const results = {
    created: [],
    already_exists: [],
    failed: [],
  };

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    process.stdout.write(`   [${i + 1}/${emails.length}] ${email}...`);

    const result = await createUser(supabase, email);

    if (result.success) {
      if (result.status === "created") {
        results.created.push(email);
        console.log(" ✅ Created");
      } else {
        results.already_exists.push(email);
        console.log(" ⚠️  Already exists");
      }
    } else {
      results.failed.push({ email, error: result.error });
      console.log(` ❌ Failed: ${result.error}`);
    }

    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("📊 SUMMARY");
  console.log("═".repeat(60));
  console.log(`✅ Successfully created: ${results.created.length}`);
  console.log(`⚠️  Already existed: ${results.already_exists.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📧 Total emails processed: ${emails.length}`);
  console.log("═".repeat(60));

  if (results.failed.length > 0) {
    console.log("\n❌ Failed emails:");
    results.failed.forEach(({ email, error }) => {
      console.log(`   - ${email}: ${error}`);
    });
  }

  console.log("\n✨ Process completed!");
  console.log(`🔑 All users have password: ${PASSWORD}`);
  console.log("\n💡 Next steps:");
  console.log('   1. Test login with any email and password "1234"');
  console.log("   2. Verify users in Supabase Dashboard → Authentication → Users");
  console.log("   3. Users should change their password after first login\n");
}

// Run the script
main().catch((error) => {
  console.error("\n❌ Error:", error.message);
  process.exit(1);
});

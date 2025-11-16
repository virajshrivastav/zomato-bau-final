/**
 * Add Team Lead emails to Supabase Auth
 *
 * This script creates auth accounts for the 6 Team Leads who need access
 * to the Zonal Head View dashboard.
 *
 * Team Leads will be able to:
 * 1. Sign in with Google OAuth using their @zomato.com email
 * 2. Access the Zonal Head View to see aggregated KAM performance
 * 3. Use Manager Access with email:password format
 */

import { createClient } from "@supabase/supabase-js";

// Hardcoded credentials from .env.local
const supabaseUrl = "https://lqtjghnremwiybqzmprn.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzExNTMxMCwiZXhwIjoyMDc4NjkxMzEwfQ.r7SZ4kAKH-9GlzdmHw730dfjoBvtfgVrY8IPcgMxSbI";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Team Lead emails from kam-data.txt
const teamLeads = [
  {
    email: "prahaas.muchandi@zomato.com",
    name: "Prahaas Muchandi",
    role: "Team Lead",
  },
  {
    email: "divya.gugle@zomato.com",
    name: "Divya Gugle",
    role: "Team Lead",
  },
  {
    email: "snehil.maheshkar@zomato.com",
    name: "Snehil Maheshkar",
    role: "Team Lead",
  },
  {
    email: "pratik.tare@zomato.com",
    name: "Pratik Tare",
    role: "Team Lead",
  },
  {
    email: "samrudhh.bhave@zomato.com",
    name: "Samrudhh Bhave",
    role: "Team Lead",
  },
  {
    email: "tejas.bora@zomato.com",
    name: "Tejas Bora",
    role: "Team Lead",
  },
];

async function addTeamLeadsToAuth() {
  console.log("🚀 Adding Team Leads to Supabase Auth...\n");

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const tl of teamLeads) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const userExists = existingUsers.users.some((u) => u.email === tl.email);

      if (userExists) {
        console.log(`⏭️  ${tl.email} - Already exists, skipping`);
        skipCount++;
        continue;
      }

      // Create user with email only (no password needed for OAuth)
      // They will sign in using Google OAuth
      const { data, error } = await supabase.auth.admin.createUser({
        email: tl.email,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: tl.name,
          role: tl.role,
          access_level: "zonal_head",
        },
      });

      if (error) {
        console.error(`❌ ${tl.email} - Error: ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ ${tl.email} - Created successfully`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ ${tl.email} - Exception: ${err.message}`);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Summary:");
  console.log(`   ✅ Created: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log("=".repeat(60));

  if (successCount > 0) {
    console.log("\n✨ Team Leads can now sign in using:");
    console.log("   1. Google OAuth (Sign in with Google button)");
    console.log("   2. Manager Access (email:zomato2025 format)");
  }
}

// Run the script
addTeamLeadsToAuth()
  .then(() => {
    console.log("\n✅ Script completed!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Script failed:", err);
    process.exit(1);
  });

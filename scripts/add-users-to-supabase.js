/**
 * Script to add users from kam-data.txt to Supabase Authentication
 * 
 * This script:
 * 1. Reads the kam-data.txt file
 * 2. Extracts unique am_email addresses
 * 3. Creates Supabase auth users with password "1234"
 * 
 * Usage: node scripts/add-users-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://lqtjghnremwiybqzmprn.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // You need to add this
const PASSWORD = '1234';

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Extract unique emails from kam-data.txt
 */
function extractUniqueEmails() {
  const filePath = path.join(__dirname, '..', 'kam-data.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  
  const emails = new Set();
  
  // Skip header line (line 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',');
    if (columns.length >= 4) {
      const email = columns[3].trim(); // am_email is the 4th column (index 3)
      if (email && email.includes('@zomato.com')) {
        emails.add(email);
      }
    }
  }
  
  return Array.from(emails).sort();
}

/**
 * Create a user in Supabase Auth
 */
async function createUser(email) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: PASSWORD,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        created_by: 'bulk_import_script',
        source: 'kam-data.txt'
      }
    });

    if (error) {
      // Check if user already exists
      if (error.message.includes('already registered')) {
        return { success: true, email, status: 'already_exists' };
      }
      return { success: false, email, error: error.message };
    }

    return { success: true, email, status: 'created', userId: data.user.id };
  } catch (err) {
    return { success: false, email, error: err.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Supabase user creation process...\n');
  
  // Extract unique emails
  console.log('📧 Extracting unique emails from kam-data.txt...');
  const emails = extractUniqueEmails();
  console.log(`✅ Found ${emails.length} unique emails\n`);
  
  // Display first 10 emails as preview
  console.log('📋 Preview of emails to be added:');
  emails.slice(0, 10).forEach((email, index) => {
    console.log(`   ${index + 1}. ${email}`);
  });
  if (emails.length > 10) {
    console.log(`   ... and ${emails.length - 10} more\n`);
  }
  
  // Create users
  console.log('👤 Creating users in Supabase...\n');
  
  const results = {
    created: [],
    already_exists: [],
    failed: []
  };
  
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    process.stdout.write(`   Processing ${i + 1}/${emails.length}: ${email}...`);
    
    const result = await createUser(email);
    
    if (result.success) {
      if (result.status === 'created') {
        results.created.push(email);
        console.log(' ✅ Created');
      } else {
        results.already_exists.push(email);
        console.log(' ⚠️  Already exists');
      }
    } else {
      results.failed.push({ email, error: result.error });
      console.log(` ❌ Failed: ${result.error}`);
    }
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully created: ${results.created.length}`);
  console.log(`⚠️  Already existed: ${results.already_exists.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📧 Total emails processed: ${emails.length}`);
  console.log('='.repeat(60));
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed emails:');
    results.failed.forEach(({ email, error }) => {
      console.log(`   - ${email}: ${error}`);
    });
  }
  
  console.log('\n✨ Process completed!');
  console.log(`🔑 All users have password: ${PASSWORD}`);
}

// Run the script
main().catch(console.error);


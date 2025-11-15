/**
 * Script to extract unique emails from kam-data.txt
 * 
 * This script reads kam-data.txt and outputs:
 * 1. A list of unique emails
 * 2. SQL statements to create users in Supabase
 * 
 * Usage: node scripts/extract-unique-emails.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PASSWORD = '1234';

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
 * Main function
 */
function main() {
  console.log('📧 Extracting unique emails from kam-data.txt...\n');
  
  const emails = extractUniqueEmails();
  
  console.log(`✅ Found ${emails.length} unique emails\n`);
  console.log('='.repeat(60));
  console.log('UNIQUE EMAILS LIST');
  console.log('='.repeat(60));
  
  emails.forEach((email, index) => {
    console.log(`${index + 1}. ${email}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${emails.length} unique emails`);
  console.log('='.repeat(60));
  
  // Save to file
  const outputPath = path.join(__dirname, 'unique-emails.txt');
  fs.writeFileSync(outputPath, emails.join('\n'));
  console.log(`\n💾 Saved to: ${outputPath}`);
  
  // Generate SQL for Supabase (for reference)
  console.log('\n' + '='.repeat(60));
  console.log('NOTE: To add these users to Supabase:');
  console.log('='.repeat(60));
  console.log('1. Use the Supabase Dashboard → Authentication → Add User');
  console.log('2. Or use the add-users-to-supabase.js script');
  console.log(`3. Password for all users: ${PASSWORD}`);
  console.log('='.repeat(60));
}

main();


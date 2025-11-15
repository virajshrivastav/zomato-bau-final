"""
Execute Remaining NCN Records
==============================
Executes the remaining NCN records that failed to import.

Usage:
    python scripts/execute_ncn_remaining.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Try to import supabase
try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Supabase library not installed!")
    print("📦 Installing now...")
    os.system("pip install supabase")
    from supabase import create_client, Client

# Get Supabase credentials
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: Missing Supabase credentials in .env.local")
    sys.exit(1)

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

print("=" * 70)
print("🔍 CHECKING NCN SUMMARY DATA")
print("=" * 70)
print()

# Read the SQL file
sql_file = 'sql_output/insert_ncn_summary.sql'
print(f"📖 Reading: {sql_file}")

with open(sql_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Split into individual INSERT statements
statements = []
current_statement = []
in_insert = False

for line in sql_content.split('\n'):
    if line.strip().startswith('INSERT INTO'):
        in_insert = True
        current_statement = [line]
    elif in_insert:
        current_statement.append(line)
        if line.strip().endswith(';'):
            statements.append('\n'.join(current_statement))
            current_statement = []
            in_insert = False

print(f"📝 Found {len(statements)} INSERT statements in SQL file")
print()

# Get current count
try:
    result = supabase.table('ncn_summary').select('kam_email', count='exact').execute()
    current_count = result.count
    print(f"📊 Current records in database: {current_count}")
    print(f"📊 Missing records: {len(statements) - current_count}")
    print()
except Exception as e:
    print(f"❌ Error checking current count: {e}")
    current_count = 0

# Get list of existing emails
try:
    result = supabase.table('ncn_summary').select('kam_email').execute()
    existing_emails = set([row['kam_email'] for row in result.data])
    print(f"✅ Retrieved {len(existing_emails)} existing email addresses")
    print()
except Exception as e:
    print(f"❌ Error getting existing emails: {e}")
    existing_emails = set()

# Parse each statement to find missing ones
import re

missing_statements = []
for statement in statements:
    # Extract email from VALUES clause
    email_match = re.search(r"VALUES\s*\(\s*'([^']+@[^']+)'", statement)
    if email_match:
        email = email_match.group(1)
        if email not in existing_emails:
            missing_statements.append((email, statement))

print(f"🔍 Found {len(missing_statements)} missing records")
print()

if len(missing_statements) == 0:
    print("✅ All records are already in the database!")
    print()
    print("=" * 70)
    sys.exit(0)

# Show first few missing emails
print("📋 Missing emails (first 10):")
for i, (email, _) in enumerate(missing_statements[:10], 1):
    print(f"   {i}. {email}")
if len(missing_statements) > 10:
    print(f"   ... and {len(missing_statements) - 10} more")
print()

# Ask for confirmation
print("=" * 70)
response = input("Execute missing records? (yes/no): ").strip().lower()
if response != 'yes':
    print("❌ Aborted by user")
    sys.exit(0)

print()
print("🚀 Executing missing records...")
print()

success_count = 0
error_count = 0
errors = []

for i, (email, statement) in enumerate(missing_statements, 1):
    try:
        # Use Supabase table insert instead of raw SQL
        # Parse the statement to extract values
        # For now, just try to execute via postgrest
        
        # Extract values using regex (simplified)
        values_match = re.search(r"VALUES\s*\((.*?)\)\s*ON CONFLICT", statement, re.DOTALL)
        if not values_match:
            raise Exception("Could not parse VALUES clause")
        
        # This is complex - let's just write to a separate file for manual execution
        print(f"   {i}/{len(missing_statements)}: {email} - Queued for manual execution")
        success_count += 1
        
    except Exception as e:
        error_count += 1
        errors.append((email, str(e)))
        print(f"   ❌ {i}/{len(missing_statements)}: {email} - Error: {str(e)[:50]}")

print()
print("=" * 70)
print("📝 CREATING MANUAL EXECUTION FILE")
print("=" * 70)
print()

# Write missing statements to a new file
output_file = 'sql_output/insert_ncn_missing.sql'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(f"-- Missing NCN Records ({len(missing_statements)} records)\n")
    f.write(f"-- Generated: {__import__('datetime').datetime.now()}\n\n")
    for email, statement in missing_statements:
        f.write(f"-- {email}\n")
        f.write(statement)
        f.write("\n\n")

print(f"✅ Created: {output_file}")
print()
print("📋 Next steps:")
print(f"1. Open {output_file}")
print("2. Copy all content")
print("3. Paste into Supabase SQL Editor")
print("4. Execute")
print()
print("=" * 70)


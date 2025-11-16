"""
Execute ADS BR Data Import via Supabase API
============================================
This script executes the update_ads_br_data.sql file using Supabase Python client.
Bypasses SQL Editor file size limitations.

Prerequisites:
1. pip install supabase python-dotenv
2. Create .env.local with VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
"""

import os
import re
import time
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url: str = os.getenv("VITE_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ ERROR: Missing Supabase credentials in .env.local")
    print("Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set")
    exit(1)

supabase: Client = create_client(url, key)

# Configuration
SQL_FILE = 'update_ads_br_data.sql'
TABLE_NAME = 'drive_sheets_data'


def parse_update_statement(sql):
    """Parse UPDATE statement to extract res_id and ads_br_cm value"""
    # Extract WHERE clause (e.g., WHERE res_id = '123456')
    res_id_match = re.search(r"WHERE res_id = '(\d+)'", sql)
    if not res_id_match:
        return None, None
    res_id = res_id_match.group(1)
    
    # Extract SET clause (e.g., SET ads_br_cm = 'value')
    set_match = re.search(r"SET ads_br_cm = ('(?:[^']|'')*'|NULL)", sql)
    if not set_match:
        return None, None
    
    value = set_match.group(1)
    
    if value == 'NULL':
        ads_br_cm = None
    else:
        # Remove quotes and unescape single quotes
        ads_br_cm = value.strip("'").replace("''", "'")
    
    return res_id, ads_br_cm


def execute_update(res_id, ads_br_cm):
    """Execute UPDATE via Supabase API"""
    data = {'ads_br_cm': ads_br_cm}
    result = supabase.table(TABLE_NAME).update(data).eq('res_id', res_id).execute()
    return result


def process_sql_file():
    """Process the SQL file and execute updates"""
    print("=" * 70)
    print("  ADS BR Data Import via Supabase API")
    print("=" * 70)
    print(f"\n📂 Reading file: {SQL_FILE}")
    
    if not os.path.exists(SQL_FILE):
        print(f"❌ ERROR: File not found: {SQL_FILE}")
        return
    
    with open(SQL_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into individual statements
    statements = content.split(';')
    
    # Filter out comments and empty statements
    update_statements = [s.strip() for s in statements if s.strip() and 'UPDATE' in s]
    
    total_statements = len(update_statements)
    print(f"📊 Found {total_statements} UPDATE statements")
    print(f"🚀 Starting import...\n")
    
    success_count = 0
    error_count = 0
    start_time = time.time()
    
    for i, statement in enumerate(update_statements, 1):
        try:
            res_id, ads_br_cm = parse_update_statement(statement)
            
            if res_id is not None:
                execute_update(res_id, ads_br_cm)
                success_count += 1
                
                # Progress tracking every 100 statements
                if i % 100 == 0:
                    elapsed = time.time() - start_time
                    rate = i / elapsed
                    remaining = (total_statements - i) / rate
                    print(f"Progress: {i}/{total_statements} ({i/total_statements*100:.1f}%) - "
                          f"Rate: {rate:.1f} updates/sec - "
                          f"ETA: {remaining/60:.1f} min")
        
        except Exception as e:
            print(f"❌ Error on statement {i} (res_id: {res_id}): {e}")
            error_count += 1
            
            # Stop if too many errors
            if error_count > 10:
                print(f"\n⚠️  Too many errors ({error_count}), stopping import")
                break
    
    elapsed_time = time.time() - start_time
    
    print("\n" + "=" * 70)
    print("  IMPORT SUMMARY")
    print("=" * 70)
    print(f"✅ Successful updates: {success_count}")
    print(f"❌ Failed updates: {error_count}")
    print(f"⏱️  Execution time: {elapsed_time/60:.2f} minutes")
    print(f"📈 Average rate: {success_count/elapsed_time:.1f} updates/sec")
    print("=" * 70)


def verify_import():
    """Verify the import was successful"""
    print("\n🔍 Verifying import...")
    
    try:
        # Count restaurants with ads_br_cm data
        result = supabase.table(TABLE_NAME).select('ads_br_cm', count='exact').not_.is_('ads_br_cm', 'null').execute()
        count_with_data = result.count
        
        print(f"✅ Restaurants with ADS BR data: {count_with_data}")
        
        # Sample some records
        sample = supabase.table(TABLE_NAME).select('res_id, res_name, ads_br_cm').not_.is_('ads_br_cm', 'null').limit(5).execute()
        
        print("\n📋 Sample records:")
        for record in sample.data:
            print(f"  - {record['res_name']} (ID: {record['res_id']}): ₹{record['ads_br_cm']}")
        
    except Exception as e:
        print(f"❌ Verification error: {e}")


if __name__ == "__main__":
    process_sql_file()
    verify_import()


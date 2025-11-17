"""
Execute ZVD PO Data Import to Supabase
=======================================
This script:
1. Adds the zvd_po column to drive_sheets_data table (if not exists)
2. Executes the UPDATE statements to populate ZVD PO data

Usage:
    python scripts/execute_zvd_po_import.py
"""

import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Supabase credentials
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: Missing Supabase credentials in .env.local")
    sys.exit(1)

supabase: Client = create_client(url, key)

# SQL files
SCHEMA_SQL = 'supabase/add_zvd_po_column.sql'
DATA_SQL = 'update_zvd_po_data.sql'


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)


def execute_sql_file(file_path, description):
    """Execute SQL statements from a file"""
    print_header(description)
    
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found: {file_path}")
        return False
    
    print(f"📂 Reading file: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Split by semicolon and filter out empty statements
    statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]
    
    print(f"📊 Found {len(statements)} SQL statements")
    
    success_count = 0
    error_count = 0
    
    for i, statement in enumerate(statements, 1):
        try:
            # Execute via Supabase RPC or direct SQL
            result = supabase.rpc('exec_sql', {'sql': statement}).execute()
            success_count += 1
            
            if i % 100 == 0:
                print(f"   ✅ Processed {i}/{len(statements)} statements...")
                
        except Exception as e:
            error_count += 1
            if error_count <= 5:  # Only show first 5 errors
                print(f"   ❌ Error in statement {i}: {str(e)[:100]}")
    
    print(f"\n✅ Success: {success_count} statements")
    if error_count > 0:
        print(f"❌ Errors: {error_count} statements")
    
    return error_count == 0


def execute_via_batches(file_path, batch_size=100):
    """Execute SQL statements in batches using direct table updates"""
    print_header("Executing ZVD PO Data Updates")
    
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found: {file_path}")
        return False
    
    print(f"📂 Reading file: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Parse UPDATE statements
    import re
    updates = []
    
    # Extract res_id and zvd_po from each UPDATE statement
    pattern = r"UPDATE drive_sheets_data\s+SET zvd_po = '([^']+)'\s+WHERE res_id = '(\d+)';"
    matches = re.findall(pattern, sql_content)
    
    print(f"📊 Found {len(matches)} UPDATE statements")
    
    success_count = 0
    error_count = 0
    
    for i, (zvd_po, res_id) in enumerate(matches, 1):
        try:
            result = supabase.table('drive_sheets_data')\
                .update({'zvd_po': zvd_po})\
                .eq('res_id', res_id)\
                .execute()
            
            success_count += 1
            
            if i % 100 == 0:
                print(f"   ✅ Processed {i}/{len(matches)} updates...")
                
        except Exception as e:
            error_count += 1
            if error_count <= 5:
                print(f"   ❌ Error updating res_id {res_id}: {str(e)[:100]}")
    
    print(f"\n✅ Success: {success_count} updates")
    if error_count > 0:
        print(f"❌ Errors: {error_count} updates")
    
    return error_count == 0


def main():
    """Main execution function"""
    print_header("ZVD PO Data Import to Supabase")
    
    try:
        # Step 1: Add column (if not exists)
        print("\n📋 Step 1: Adding zvd_po column to database...")
        print("⚠️  Please execute the following SQL manually in Supabase SQL Editor:")
        print(f"    File: {SCHEMA_SQL}")
        
        with open(SCHEMA_SQL, 'r', encoding='utf-8') as f:
            print("\n" + "-" * 70)
            print(f.read())
            print("-" * 70)
        
        input("\n✋ Press Enter after executing the schema SQL in Supabase...")
        
        # Step 2: Execute data updates
        print("\n📋 Step 2: Updating ZVD PO data...")
        success = execute_via_batches(DATA_SQL)
        
        if success:
            print_header("✅ IMPORT COMPLETE")
            print("All ZVD PO data has been successfully imported!")
        else:
            print_header("⚠️  IMPORT COMPLETED WITH ERRORS")
            print("Some updates failed. Please check the errors above.")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()


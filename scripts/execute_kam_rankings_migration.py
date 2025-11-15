"""
Execute KAM Rankings Migration
================================
This script executes the SQL migration to add KAM rankings functionality.

It creates:
1. kam_rank_history table
2. ncn_rankings, n2r_rankings, items_rankings views
3. get_kam_active_drives() function
4. get_kam_performance_summary() function

Usage:
    python scripts/execute_kam_rankings_migration.py
"""

import os
import sys
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

# SQL file path
SQL_FILE = "supabase/migrations/add_kam_rankings.sql"


def print_header(text):
    """Print a formatted header."""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)


def execute_migration():
    """Execute the KAM rankings migration SQL."""
    print_header("KAM Rankings Migration")
    
    # Check if SQL file exists
    if not os.path.exists(SQL_FILE):
        print(f"❌ Error: SQL file not found: {SQL_FILE}")
        sys.exit(1)
    
    # Read SQL file
    print(f"📖 Reading SQL file: {SQL_FILE}")
    with open(SQL_FILE, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Check for Supabase credentials
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("\n⚠️  Supabase credentials not found in environment variables.")
        print("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY")
        print("\nAlternatively, you can:")
        print("1. Copy the SQL content from the file")
        print("2. Go to Supabase Dashboard > SQL Editor")
        print("3. Paste and execute the SQL")
        print(f"\nSQL file location: {SQL_FILE}")
        sys.exit(1)
    
    # Initialize Supabase client
    print("🔌 Connecting to Supabase...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Connected to Supabase")
    except Exception as e:
        print(f"❌ Error connecting to Supabase: {e}")
        sys.exit(1)
    
    # Execute SQL
    print("\n🚀 Executing migration SQL...")
    try:
        # Split SQL into individual statements
        statements = [s.strip() for s in sql_content.split(';') if s.strip()]
        
        total = len(statements)
        success_count = 0
        
        for i, statement in enumerate(statements, 1):
            # Skip comments and empty statements
            if not statement or statement.startswith('--'):
                continue
            
            try:
                # Execute statement
                result = supabase.rpc('exec_sql', {'sql': statement})
                success_count += 1
                print(f"  [{i}/{total}] ✓ Statement executed")
            except Exception as e:
                # Some statements might fail if objects already exist
                if 'already exists' in str(e).lower():
                    print(f"  [{i}/{total}] ⚠️  Object already exists (skipping)")
                    success_count += 1
                else:
                    print(f"  [{i}/{total}] ❌ Error: {e}")
        
        print(f"\n✅ Migration completed: {success_count}/{total} statements executed")
        
    except Exception as e:
        print(f"❌ Error executing migration: {e}")
        print("\n💡 Manual execution required:")
        print("1. Go to Supabase Dashboard > SQL Editor")
        print("2. Copy and paste the SQL from:")
        print(f"   {SQL_FILE}")
        print("3. Execute the SQL manually")
        sys.exit(1)
    
    # Verify migration
    print("\n🔍 Verifying migration...")
    try:
        # Check if table exists
        result = supabase.table('kam_rank_history').select('*').limit(1).execute()
        print("✅ kam_rank_history table created")
    except Exception as e:
        print(f"⚠️  Could not verify table: {e}")
    
    print("\n" + "=" * 60)
    print("  Migration Complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Test the frontend changes")
    print("2. Verify rankings are calculated correctly")
    print("3. Populate initial rank history data (optional)")


if __name__ == "__main__":
    execute_migration()


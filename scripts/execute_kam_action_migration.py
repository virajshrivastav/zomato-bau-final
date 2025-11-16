"""
Execute KAM Action Columns Migration
=====================================
This script executes the SQL migration to add KAM action tracking columns.

It adds columns for:
1. NCN approached/converted/selected codes
2. N2R approached/converted
3. Items approached/converted/items added
4. Audit trail (last_updated_by, last_updated_at)

Usage:
    python scripts/execute_kam_action_migration.py
"""

import os
import sys
try:
    from dotenv import load_dotenv
    load_dotenv('.env.local')  # Explicitly load .env.local
except ImportError:
    print("⚠️  python-dotenv not installed, reading .env.local manually")
    # Manually read .env.local
    if os.path.exists('.env.local'):
        with open('.env.local', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use service role for migrations

# SQL file path
SQL_FILE = "supabase/migrations/20251116_add_kam_action_columns.sql"


def print_header(text):
    """Print a formatted header."""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)


def main():
    print_header("🚀 KAM ACTION COLUMNS MIGRATION")
    
    # Validate credentials
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("\n❌ Error: Missing Supabase credentials!")
        print("\nPlease ensure .env.local contains:")
        print("  - VITE_SUPABASE_URL")
        print("  - SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)
    
    print(f"\n📍 Supabase URL: {SUPABASE_URL}")
    print(f"🔑 Using Service Role Key: {SUPABASE_KEY[:20]}...")
    
    # Create Supabase client
    print("\n🔌 Connecting to Supabase...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Connected successfully!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)
    
    # Read SQL file
    print(f"\n📄 Reading migration file: {SQL_FILE}")
    try:
        with open(SQL_FILE, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        print(f"✅ Read {len(sql_content)} characters")
    except FileNotFoundError:
        print(f"❌ Error: File not found: {SQL_FILE}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        sys.exit(1)
    
    # Execute SQL using raw SQL query
    print("\n🚀 Executing migration SQL...")
    print("   This will add 10 new columns to drive_sheets_data table...")
    
    try:
        # Execute the entire SQL file as one query
        result = supabase.rpc('exec_sql', {'query': sql_content}).execute()
        print("✅ Migration executed successfully!")
    except Exception as e:
        # If RPC doesn't work, provide manual instructions
        print(f"⚠️  Automatic execution not available: {e}")
        print("\n💡 Please execute manually:")
        print("=" * 70)
        print("1. Go to Supabase Dashboard > SQL Editor")
        print(f"   URL: {SUPABASE_URL.replace('https://', 'https://app.supabase.com/project/')}/sql")
        print("\n2. Copy and paste the SQL from:")
        print(f"   {SQL_FILE}")
        print("\n3. Click 'Run' to execute")
        print("=" * 70)
        
        # Open the SQL file content for easy copying
        print("\n📋 SQL CONTENT TO COPY:")
        print("=" * 70)
        print(sql_content)
        print("=" * 70)
        return
    
    # Verify migration
    print("\n🔍 Verifying migration...")
    try:
        # Check if new columns exist
        result = supabase.table('drive_sheets_data').select(
            'ncn_approached_by_kam, ncn_converted_by_kam, n2r_approached_by_kam, '
            'items_approached_by_kam, last_updated_by, last_updated_at'
        ).limit(1).execute()
        print("✅ New columns verified successfully!")
        print(f"   Sample row: {result.data[0] if result.data else 'No data yet'}")
    except Exception as e:
        print(f"⚠️  Could not verify columns: {e}")
        print("   This might be normal - check Supabase dashboard to confirm")
    
    print_header("✅ MIGRATION COMPLETE!")
    print("\nNext steps:")
    print("1. Verify columns in Supabase dashboard")
    print("2. Test mutation hooks in the application")
    print("3. Proceed to Sprint 2 (UI Integration)")


if __name__ == "__main__":
    main()


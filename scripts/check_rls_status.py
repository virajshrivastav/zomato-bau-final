"""
Check RLS (Row Level Security) Status for Performance Metrics Tables
=====================================================================
This script checks if RLS is enabled on the performance metrics tables.

Usage:
    python scripts/check_rls_status.py
"""

import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url: str = os.getenv("VITE_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ ERROR: Missing Supabase credentials in .env.local")
    sys.exit(1)

supabase: Client = create_client(url, key)

def check_rls_status():
    """Check RLS status for performance metrics tables"""
    print("\n" + "=" * 70)
    print("  CHECKING RLS STATUS")
    print("=" * 70)
    
    # SQL query to check RLS status
    query = """
    SELECT 
        schemaname,
        tablename, 
        rowsecurity as rls_enabled
    FROM pg_tables
    WHERE tablename IN ('ncn_summary', 'n2r_summary', 'items_summary')
    ORDER BY tablename;
    """
    
    try:
        result = supabase.rpc('exec_sql', {'query': query}).execute()
        print("\n📊 RLS Status:")
        print(result)
    except Exception as e:
        print(f"\n⚠️  Could not check RLS via RPC, trying direct query...")
        
        # Alternative: Check by trying to query with anon key
        anon_key = os.getenv("VITE_SUPABASE_ANON_KEY")
        if anon_key:
            anon_client = create_client(url, anon_key)
            
            tables = ['ncn_summary', 'n2r_summary', 'items_summary']
            for table in tables:
                try:
                    result = anon_client.table(table).select('*').limit(1).execute()
                    print(f"✅ {table}: Accessible with anon key (RLS likely disabled or has policy)")
                except Exception as e:
                    print(f"❌ {table}: NOT accessible with anon key - {str(e)[:100]}")
        else:
            print("❌ Could not check RLS status")
            print(f"Error: {e}")
    
    print("\n" + "=" * 70)
    print("  RECOMMENDATION")
    print("=" * 70)
    print("\n💡 For Performance Metrics to work:")
    print("   - RLS should be DISABLED on all 3 tables, OR")
    print("   - RLS policies should allow SELECT for authenticated users")
    print("\n📝 To disable RLS, run this SQL in Supabase SQL Editor:")
    print("   ALTER TABLE ncn_summary DISABLE ROW LEVEL SECURITY;")
    print("   ALTER TABLE n2r_summary DISABLE ROW LEVEL SECURITY;")
    print("   ALTER TABLE items_summary DISABLE ROW LEVEL SECURITY;")
    print()

if __name__ == "__main__":
    check_rls_status()


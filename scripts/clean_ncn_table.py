"""
Clean NCN Summary Table
========================
This script removes all records from ncn_summary table.

Usage:
    python scripts/clean_ncn_table.py
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

def clean_table(table_name):
    """Delete all records from a table"""
    print(f"🔍 Fetching all records from {table_name}...")
    
    try:
        result = supabase.table(table_name).select('kam_email').execute()
        emails = [row['kam_email'] for row in result.data]
        
        print(f"Found {len(emails)} records")
        print(f"🗑️  Deleting all records...")
        
        for i, email in enumerate(emails, 1):
            supabase.table(table_name).delete().eq('kam_email', email).execute()
            if i % 10 == 0:
                print(f"   Deleted {i}/{len(emails)} records...")
        
        print(f"✅ Successfully deleted all {len(emails)} records from {table_name}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 70)
    print("  CLEAN NCN SUMMARY TABLE")
    print("=" * 70)
    clean_table('ncn_summary')
    print("=" * 70)


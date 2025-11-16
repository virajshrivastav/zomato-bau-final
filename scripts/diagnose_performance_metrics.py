"""
Diagnose Performance Metrics Issues
====================================
This script checks the database state and identifies issues with performance metrics data.

Usage:
    python scripts/diagnose_performance_metrics.py
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
    print("Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set")
    sys.exit(1)

supabase: Client = create_client(url, key)

def print_header(title):
    """Print a formatted header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def check_table_exists(table_name):
    """Check if a table exists and return row count"""
    try:
        result = supabase.table(table_name).select('*', count='exact').limit(1).execute()
        return True, result.count
    except Exception as e:
        return False, str(e)

def get_table_columns(table_name):
    """Get column names from a table"""
    try:
        result = supabase.table(table_name).select('*').limit(1).execute()
        if result.data and len(result.data) > 0:
            return list(result.data[0].keys())
        return []
    except Exception as e:
        return []

def check_kam_email_exists(table_name, email):
    """Check if a KAM email exists in a table"""
    try:
        result = supabase.table(table_name).select('*').eq('kam_email', email).execute()
        return len(result.data) > 0, result.data
    except Exception as e:
        return False, str(e)

def get_sample_emails(table_name, limit=5):
    """Get sample KAM emails from a table"""
    try:
        result = supabase.table(table_name).select('kam_email').limit(limit).execute()
        return [row['kam_email'] for row in result.data]
    except Exception as e:
        return []

def main():
    print_header("PERFORMANCE METRICS DIAGNOSTICS")
    
    # Check all three tables
    tables = ['ncn_summary', 'n2r_summary', 'items_summary']
    
    for table in tables:
        print_header(f"Checking {table.upper()}")
        
        # Check if table exists
        exists, count = check_table_exists(table)
        if not exists:
            print(f"❌ Table '{table}' does not exist or is not accessible")
            print(f"   Error: {count}")
            continue
        
        print(f"✅ Table exists with {count} rows")
        
        # Get column names
        columns = get_table_columns(table)
        if columns:
            print(f"\n📋 Columns ({len(columns)}):")
            for col in sorted(columns):
                print(f"   - {col}")
        
        # Get sample emails
        sample_emails = get_sample_emails(table, 5)
        if sample_emails:
            print(f"\n📧 Sample KAM emails:")
            for email in sample_emails:
                print(f"   - {email}")
    
    # Test specific email lookup
    print_header("Testing Specific Email Lookup")
    test_email = "bhuwneshwari.dhouni@zomato.com"
    print(f"Testing with: {test_email}")
    
    for table in tables:
        exists, data = check_kam_email_exists(table, test_email)
        if exists:
            print(f"\n✅ Found in {table}")
            if isinstance(data, list) and len(data) > 0:
                print(f"   Sample data keys: {list(data[0].keys())[:10]}")
        else:
            print(f"\n❌ NOT found in {table}")
    
    print_header("DIAGNOSTICS COMPLETE")
    print("\n💡 Next Steps:")
    print("1. Check if your logged-in email matches any of the sample emails above")
    print("2. Verify column names match TypeScript interfaces")
    print("3. If data is missing, re-run the import script")

if __name__ == "__main__":
    main()


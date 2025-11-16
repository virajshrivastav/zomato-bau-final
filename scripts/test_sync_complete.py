"""
Complete Sync Test Script
=========================
Tests all sync functionality between Google Sheets and Supabase.

This script:
1. Verifies Google Sheets connection
2. Verifies Supabase connection
3. Tests reading from both sources
4. Displays sample data
5. Provides sync recommendations

Usage:
    python scripts/test_sync_complete.py
"""

import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
import gspread
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

# Configuration
SHEET_ID = '1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ'
CREDENTIALS_FILE = 'service-account-credentials.json'

# Supabase configuration
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]


def print_header(text):
    print("\n" + "="*70)
    print(text)
    print("="*70 + "\n")


def test_google_sheets():
    """Test Google Sheets connection."""
    print_header("📊 TESTING GOOGLE SHEETS CONNECTION")
    
    try:
        creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
        client = gspread.authorize(creds)
        spreadsheet = client.open_by_key(SHEET_ID)
        
        print(f"✅ Connected to: {spreadsheet.title}")
        print(f"\n📋 Available worksheets:")
        
        for ws in spreadsheet.worksheets():
            print(f"   - {ws.title} ({ws.row_count} rows, {ws.col_count} cols)")
        
        # Test Comments and Notes worksheet
        comments_ws = None
        for ws in spreadsheet.worksheets():
            if ws.title == "Comments and Notes":
                comments_ws = ws
                break
        
        if comments_ws:
            print(f"\n✅ Found 'Comments and Notes' worksheet")
            all_data = comments_ws.get_all_values()
            print(f"   Total rows: {len(all_data)}")
            
            if len(all_data) > 0:
                print(f"   Headers: {all_data[0]}")
            
            if len(all_data) > 1:
                print(f"   Sample data (first row): {all_data[1]}")
            else:
                print(f"   ⚠️  No data rows (only headers)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_supabase():
    """Test Supabase connection."""
    print_header("🗄️  TESTING SUPABASE CONNECTION")
    
    try:
        if not SUPABASE_URL or not SERVICE_ROLE_KEY:
            print("❌ Missing Supabase credentials in .env.local")
            return False
        
        supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
        
        print(f"✅ Connected to: {SUPABASE_URL}")
        
        # Test query
        result = supabase.table('drive_sheets_data')\
            .select('res_id, res_name, am_email, kam_notes', count='exact')\
            .limit(5)\
            .execute()
        
        print(f"\n📊 Total restaurants in database: {result.count}")
        
        # Check for kam_notes column
        if result.data:
            print(f"\n✅ Sample data (first 5 restaurants):")
            for i, row in enumerate(result.data, 1):
                has_notes = "✓" if row.get('kam_notes') else "✗"
                print(f"   {i}. {row['res_id']} - {row['res_name'][:30]} - Notes: {has_notes}")
        
        # Count restaurants with notes
        notes_result = supabase.table('drive_sheets_data')\
            .select('res_id', count='exact')\
            .not_.is_('kam_notes', 'null')\
            .execute()
        
        print(f"\n📝 Restaurants with notes: {notes_result.count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def check_kam_notes_column():
    """Check if kam_notes column exists."""
    print_header("🔍 CHECKING KAM_NOTES COLUMN")
    
    try:
        supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
        
        # Try to query kam_notes column
        result = supabase.table('drive_sheets_data')\
            .select('kam_notes')\
            .limit(1)\
            .execute()
        
        print("✅ kam_notes column exists!")
        return True
        
    except Exception as e:
        error_msg = str(e)
        if 'column "kam_notes" does not exist' in error_msg.lower():
            print("❌ kam_notes column does NOT exist!")
            print("\n📝 Action Required:")
            print("   Run this SQL in Supabase SQL Editor:")
            print("   ")
            print("   ALTER TABLE drive_sheets_data")
            print("   ADD COLUMN IF NOT EXISTS kam_notes TEXT;")
            print("\n   Or run: cat supabase/add_kam_notes_column.sql")
            return False
        else:
            print(f"❌ Error: {e}")
            return False


def main():
    print_header("🧪 COMPLETE SYNC TEST")
    
    sheets_ok = test_google_sheets()
    supabase_ok = test_supabase()
    column_ok = check_kam_notes_column()
    
    print_header("📋 TEST SUMMARY")
    
    print(f"Google Sheets Connection: {'✅ PASS' if sheets_ok else '❌ FAIL'}")
    print(f"Supabase Connection: {'✅ PASS' if supabase_ok else '❌ FAIL'}")
    print(f"kam_notes Column: {'✅ EXISTS' if column_ok else '❌ MISSING'}")
    
    if sheets_ok and supabase_ok and column_ok:
        print("\n" + "="*70)
        print("🎉 ALL TESTS PASSED!")
        print("="*70)
        print("\n✅ You're ready to sync!")
        print("\nNext steps:")
        print("   1. Run: python scripts/bidirectional_sync.py --direction both")
        print("   2. Verify data in both Google Sheets and Supabase")
        print("   3. Set up automated daily sync (optional)")
    else:
        print("\n" + "="*70)
        print("⚠️  SOME TESTS FAILED")
        print("="*70)
        print("\nPlease fix the issues above before syncing.")
        
        if not column_ok:
            print("\n🔧 Quick Fix:")
            print("   Run: cat supabase/add_kam_notes_column.sql")
            print("   Then execute the SQL in Supabase SQL Editor")


if __name__ == "__main__":
    main()


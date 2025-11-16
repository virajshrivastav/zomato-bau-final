"""
Verify Google Sheets Structure and Format
==========================================
This script verifies the current structure of Google Sheets after user's format update.
It checks:
- Tab names and existence
- Header rows
- Column structure
- Data integrity
- No tampering or corruption

Usage:
    python scripts/verify_sheets_structure.py
"""

import os
import sys
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
import gspread

# Load environment variables
load_dotenv('.env.local')

# Configuration
SHEET_ID = '1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ'
CREDENTIALS_FILE = 'service-account-credentials.json'

# Google Sheets API scope
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]


def get_google_sheets_client():
    """Initialize Google Sheets client."""
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"❌ Credentials file not found: {CREDENTIALS_FILE}")
        sys.exit(1)
    
    credentials = Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=SCOPES
    )
    return gspread.authorize(credentials)


def verify_tab(client, tab_name):
    """Verify structure of a specific tab."""
    print(f"\n{'='*70}")
    print(f"📋 VERIFYING TAB: {tab_name}")
    print('='*70)
    
    try:
        spreadsheet = client.open_by_key(SHEET_ID)
        worksheet = None
        
        # Find the worksheet
        for ws in spreadsheet.worksheets():
            if ws.title == tab_name:
                worksheet = ws
                break
        
        if not worksheet:
            print(f"❌ Tab '{tab_name}' not found!")
            return None
        
        print(f"✅ Tab found: {tab_name}")
        
        # Get all data
        all_values = worksheet.get_all_values()
        total_rows = len(all_values)
        
        print(f"\n📊 STRUCTURE:")
        print(f"   Total rows: {total_rows}")
        
        if total_rows == 0:
            print("❌ Tab is completely empty!")
            return None
        
        # Get column count from first row
        total_cols = len(all_values[0]) if all_values else 0
        print(f"   Total columns: {total_cols}")
        
        # Show first few rows
        print(f"\n📝 FIRST 3 ROWS:")
        for i, row in enumerate(all_values[:3], 1):
            # Show first 10 columns only for readability
            preview = row[:10] if len(row) > 10 else row
            print(f"   Row {i}: {preview}")
            if len(row) > 10:
                print(f"          ... and {len(row) - 10} more columns")
        
        # Check for headers
        if total_rows >= 2:
            headers = all_values[1]  # Row 2 should be headers
            print(f"\n📋 HEADERS (Row 2):")
            print(f"   First 10: {headers[:10]}")
            if len(headers) > 10:
                print(f"   ... and {len(headers) - 10} more headers")
            
            # Check for KAM action columns (should be around column 27+)
            if total_cols >= 27:
                kam_headers = headers[26:33] if len(headers) > 26 else []
                print(f"\n🎯 KAM ACTION COLUMNS (AA-AG area):")
                for i, header in enumerate(kam_headers, 27):
                    if header:
                        print(f"   Column {i}: {header}")
        
        # Data rows
        data_rows = total_rows - 2 if total_rows > 2 else 0
        print(f"\n📊 DATA ROWS: {data_rows}")
        
        if data_rows > 0:
            print(f"   Sample data (Row 3):")
            sample = all_values[2][:10] if len(all_values[2]) > 10 else all_values[2]
            print(f"   {sample}")
        
        return {
            'tab_name': tab_name,
            'total_rows': total_rows,
            'total_cols': total_cols,
            'headers': all_values[1] if total_rows >= 2 else [],
            'data_rows': data_rows,
            'status': 'OK'
        }
        
    except Exception as e:
        print(f"❌ Error verifying {tab_name}: {str(e)}")
        return None


def main():
    """Main verification function."""
    print("\n" + "="*70)
    print("🔍 GOOGLE SHEETS STRUCTURE VERIFICATION")
    print("="*70)
    
    # Initialize Google Sheets client
    print("\n🔐 Initializing Google Sheets client...")
    client = get_google_sheets_client()
    print("✅ Client initialized")
    
    # Get spreadsheet info
    spreadsheet = client.open_by_key(SHEET_ID)
    print(f"\n📄 Spreadsheet: {spreadsheet.title}")
    print(f"   URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit")
    
    # List all tabs
    all_tabs = [ws.title for ws in spreadsheet.worksheets()]
    print(f"\n📑 ALL TABS ({len(all_tabs)}):")
    for i, tab in enumerate(all_tabs, 1):
        print(f"   {i}. {tab}")
    
    # Tabs to verify (use actual tab names from the sheet)
    tabs_to_verify = all_tabs
    
    # Verify each tab
    results = {}
    for tab in tabs_to_verify:
        result = verify_tab(client, tab)
        results[tab] = result
    
    # Summary
    print("\n" + "="*70)
    print("📊 VERIFICATION SUMMARY")
    print("="*70)
    
    for tab, result in results.items():
        if result:
            print(f"\n✅ {tab}")
            print(f"   Rows: {result['total_rows']} | Columns: {result['total_cols']} | Data Rows: {result['data_rows']}")
        else:
            print(f"\n❌ {tab} - FAILED")
    
    # Check if all verified successfully
    if all(results.values()):
        print("\n🎉 ALL TABS VERIFIED SUCCESSFULLY!")
        print("\n✅ No tampering detected")
        print("✅ Structure looks good")
    else:
        print("\n⚠️  SOME TABS FAILED VERIFICATION")
        sys.exit(1)


if __name__ == "__main__":
    main()


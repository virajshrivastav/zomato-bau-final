"""
Cleanup Google Sheets - Remove Base Data Exported by Scripts
=============================================================
This script removes the 1000 rows of restaurant data (rows 3-1002) that were
exported via scripts, keeping only the title row and headers.

What it does:
- Deletes rows 3-1002 from NCN, N2R, and Items tabs
- Keeps Row 1 (Title) and Row 2 (Headers)
- Preserves all column headers including KAM action columns (AA-AG)

Usage:
    python scripts/cleanup_sheets_base_data.py
    
    # Dry run (don't delete anything)
    python scripts/cleanup_sheets_base_data.py --dry-run
"""

import os
import sys
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
import gspread
import argparse

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


def cleanup_tab(client, tab_name, dry_run=False):
    """Delete rows 3-1002 from a specific tab."""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Processing tab: {tab_name}")
    print("-" * 70)
    
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
            return False
        
        # Get current row count
        all_values = worksheet.get_all_values()
        current_rows = len(all_values)
        
        print(f"📊 Current rows in sheet: {current_rows}")
        
        if current_rows <= 2:
            print(f"✅ No data rows to delete (only {current_rows} rows exist)")
            return True
        
        # Calculate rows to delete
        rows_to_delete = current_rows - 2  # Keep row 1 (title) and row 2 (headers)
        
        print(f"🗑️  Will delete {rows_to_delete} rows (rows 3-{current_rows})")
        
        if not dry_run:
            # Delete rows starting from row 3
            # We delete in batches to avoid API limits
            batch_size = 100
            deleted = 0
            
            while deleted < rows_to_delete:
                # Always delete from row 3 (since rows shift up after deletion)
                rows_in_batch = min(batch_size, rows_to_delete - deleted)
                worksheet.delete_rows(3, 3 + rows_in_batch - 1)
                deleted += rows_in_batch
                print(f"   Deleted {deleted}/{rows_to_delete} rows...")
            
            print(f"✅ Successfully deleted {rows_to_delete} rows from {tab_name}")
        else:
            print(f"✅ [DRY RUN] Would delete {rows_to_delete} rows from {tab_name}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error processing {tab_name}: {str(e)}")
        return False


def main():
    """Main cleanup function."""
    parser = argparse.ArgumentParser(description='Cleanup Google Sheets base data')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be deleted without actually deleting')
    args = parser.parse_args()
    
    print("\n" + "="*70)
    print("🧹 GOOGLE SHEETS CLEANUP - REMOVE BASE DATA")
    print("="*70)
    
    if args.dry_run:
        print("\n⚠️  DRY RUN MODE - No data will be deleted")
    
    # Initialize Google Sheets client
    print("\n🔐 Initializing Google Sheets client...")
    client = get_google_sheets_client()
    print("✅ Client initialized")
    
    # Tabs to clean up
    tabs = [
        "NCN - No cooking november",
        "N2R - New to restaurant",
        "Items >=159"
    ]
    
    # Process each tab
    results = {}
    for tab in tabs:
        results[tab] = cleanup_tab(client, tab, args.dry_run)
    
    # Summary
    print("\n" + "="*70)
    print("📊 CLEANUP SUMMARY")
    print("="*70)
    
    for tab, success in results.items():
        status = "✅ Success" if success else "❌ Failed"
        print(f"{status}: {tab}")
    
    if all(results.values()):
        print("\n🎉 All tabs cleaned up successfully!")
        if not args.dry_run:
            print("\n📝 Next steps:")
            print("   - Verify the sheets only have title and header rows")
            print("   - KAM action columns (AA-AG) should still be present")
    else:
        print("\n⚠️  Some tabs failed to clean up")
        sys.exit(1)


if __name__ == "__main__":
    main()


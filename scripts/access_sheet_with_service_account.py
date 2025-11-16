"""
Access Google Sheets using Service Account
===========================================
This script accesses Google Sheets using a service account for programmatic access.

Prerequisites:
1. Create service account (see GOOGLE-SHEETS-SERVICE-ACCOUNT-SETUP.md)
2. Download JSON credentials file
3. Share the Google Sheet with the service account email

Sheet URL: https://docs.google.com/spreadsheets/d/1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ/edit?gid=25988507

Usage:
    python scripts/access_sheet_with_service_account.py
"""

import os
import json
import gspread
from google.oauth2.service_account import Credentials

# Configuration
SHEET_ID = '1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ'
GID = '25988507'
CREDENTIALS_FILE = 'service-account-credentials.json'

# Google Sheets API scope
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]


def check_credentials_file():
    """Check if credentials file exists."""
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"❌ ERROR: Credentials file not found!")
        print(f"\nExpected location: {os.path.abspath(CREDENTIALS_FILE)}")
        print("\n📋 To fix this:")
        print("1. Follow the guide in GOOGLE-SHEETS-SERVICE-ACCOUNT-SETUP.md")
        print("2. Download the JSON credentials file")
        print("3. Save it as 'service-account-credentials.json' in the project root")
        return False
    
    # Load and display service account email
    try:
        with open(CREDENTIALS_FILE, 'r') as f:
            creds_data = json.load(f)
            service_email = creds_data.get('client_email', 'Unknown')
            print(f"✅ Credentials file found!")
            print(f"📧 Service Account Email: {service_email}")
            print(f"\n⚠️  Make sure you've shared the Google Sheet with this email!")
            return True
    except Exception as e:
        print(f"❌ Error reading credentials file: {e}")
        return False


def access_sheet():
    """Access the Google Sheet using service account."""
    print("\n" + "="*70)
    print("📊 ACCESSING GOOGLE SHEET WITH SERVICE ACCOUNT")
    print("="*70 + "\n")
    
    # Check credentials
    if not check_credentials_file():
        return None, None
    
    print("\n🔐 Authenticating with service account...")
    
    try:
        # Load credentials
        creds = Credentials.from_service_account_file(
            CREDENTIALS_FILE,
            scopes=SCOPES
        )
        
        # Create gspread client
        client = gspread.authorize(creds)
        print("✅ Authentication successful!")
        
        # Open the spreadsheet
        print(f"\n📂 Opening spreadsheet: {SHEET_ID}")
        spreadsheet = client.open_by_key(SHEET_ID)
        print(f"✅ Spreadsheet opened: {spreadsheet.title}")
        
        # List all worksheets
        print("\n📋 Available worksheets:")
        for i, worksheet in enumerate(spreadsheet.worksheets(), 1):
            print(f"   {i}. {worksheet.title} (ID: {worksheet.id}, Rows: {worksheet.row_count}, Cols: {worksheet.col_count})")
        
        # Get the specific worksheet by GID
        print(f"\n📄 Accessing worksheet with GID: {GID}")
        worksheet = None
        for ws in spreadsheet.worksheets():
            if str(ws.id) == GID:
                worksheet = ws
                break
        
        if not worksheet:
            print(f"❌ Worksheet with GID {GID} not found!")
            print("\nTrying first worksheet instead...")
            worksheet = spreadsheet.worksheets()[0]
        
        print(f"✅ Using worksheet: {worksheet.title}")
        
        # Get all data
        print("\n📊 Fetching data...")
        all_data = worksheet.get_all_values()
        print(f"✅ Retrieved {len(all_data)} rows")
        
        # Display headers
        if all_data:
            headers = all_data[0]
            print("\n" + "="*70)
            print(f"HEADERS ({len(headers)} columns)")
            print("="*70 + "\n")
            for i, header in enumerate(headers[:20], 1):  # Show first 20 headers
                print(f"{i:3d}. {header}")
            if len(headers) > 20:
                print(f"... and {len(headers) - 20} more columns")
        
        # Display first few rows
        print("\n" + "="*70)
        print("DATA PREVIEW (First 5 rows)")
        print("="*70 + "\n")
        
        for i, row in enumerate(all_data[:6], 0):  # 0 = headers, 1-5 = data
            row_label = "Headers" if i == 0 else f"Row {i}"
            # Show first 5 columns
            preview = row[:5] if len(row) >= 5 else row
            print(f"{row_label:8s}: {preview}")
        
        if len(all_data) > 6:
            print(f"\n... and {len(all_data) - 6} more rows")
        
        return worksheet, all_data
        
    except gspread.exceptions.SpreadsheetNotFound:
        print("❌ ERROR: Spreadsheet not found!")
        print("\nPossible reasons:")
        print("1. The sheet ID is incorrect")
        print("2. The sheet was not shared with the service account")
        print("\n📋 To fix:")
        print("1. Open the Google Sheet")
        print("2. Click 'Share'")
        print("3. Add the service account email (shown above)")
        print("4. Set permission to 'Editor' or 'Viewer'")
        return None, None
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return None, None


if __name__ == "__main__":
    worksheet, data = access_sheet()
    
    if worksheet and data:
        print("\n" + "="*70)
        print("✅ SUCCESS!")
        print("="*70)
        print(f"\nWorksheet: {worksheet.title}")
        print(f"Total rows: {len(data)}")
        print(f"Total columns: {len(data[0]) if data else 0}")
        print("\n🎉 You can now read and write to this Google Sheet programmatically!")
    else:
        print("\n" + "="*70)
        print("❌ FAILED TO ACCESS SHEET")
        print("="*70)
        print("\nPlease follow the instructions in GOOGLE-SHEETS-SERVICE-ACCOUNT-SETUP.md")


"""
Access Google Sheets using OAuth credentials
=============================================
This script accesses the Google Sheet and displays its data.

Sheet URL: https://docs.google.com/spreadsheets/d/1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ/edit?gid=25988507#gid=25988507

Requirements:
    pip install gspread google-auth google-auth-oauthlib google-auth-httplib2

Usage:
    python scripts/access_google_sheet.py
"""

import os
import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import gspread
import pickle

# Google Sheets API scope
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Sheet ID from the URL
SHEET_ID = '1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ'
GID = '25988507'  # The specific tab/sheet ID

# OAuth credentials file
CREDENTIALS_FILE = 'client_secret_2_201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com.json'
TOKEN_FILE = 'token.pickle'


def get_credentials():
    """Get or refresh Google OAuth credentials."""
    creds = None
    
    # Check if we have saved credentials
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    
    # If credentials don't exist or are invalid, get new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("🔄 Refreshing credentials...")
            creds.refresh(Request())
        else:
            print("🔐 Starting OAuth flow...")
            print("A browser window will open for you to authorize access.")
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=8080)
        
        # Save credentials for future use
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)
        print("✅ Credentials saved!")
    
    return creds


def access_sheet():
    """Access the Google Sheet and display data."""
    print("\n" + "="*70)
    print("📊 ACCESSING GOOGLE SHEET")
    print("="*70 + "\n")
    
    # Get credentials
    creds = get_credentials()
    
    # Create gspread client
    print("🔗 Connecting to Google Sheets...")
    client = gspread.authorize(creds)
    
    # Open the spreadsheet
    print(f"📂 Opening spreadsheet: {SHEET_ID}")
    spreadsheet = client.open_by_key(SHEET_ID)
    
    # List all worksheets
    print("\n📋 Available worksheets:")
    for i, worksheet in enumerate(spreadsheet.worksheets(), 1):
        print(f"   {i}. {worksheet.title} (ID: {worksheet.id})")
    
    # Get the specific worksheet by GID
    print(f"\n📄 Accessing worksheet with GID: {GID}")
    worksheet = None
    for ws in spreadsheet.worksheets():
        if str(ws.id) == GID:
            worksheet = ws
            break
    
    if not worksheet:
        print(f"❌ Worksheet with GID {GID} not found!")
        print("Available worksheets:")
        for ws in spreadsheet.worksheets():
            print(f"   - {ws.title} (ID: {ws.id})")
        return
    
    print(f"✅ Found worksheet: {worksheet.title}")
    
    # Get all data
    print("\n📊 Fetching data...")
    all_data = worksheet.get_all_values()
    
    print(f"✅ Retrieved {len(all_data)} rows")
    
    # Display first few rows
    print("\n" + "="*70)
    print("PREVIEW (First 10 rows)")
    print("="*70 + "\n")
    
    for i, row in enumerate(all_data[:10], 1):
        print(f"Row {i}: {row[:5]}...")  # Show first 5 columns
    
    if len(all_data) > 10:
        print(f"\n... and {len(all_data) - 10} more rows")
    
    # Get headers
    if all_data:
        headers = all_data[0]
        print("\n" + "="*70)
        print(f"HEADERS ({len(headers)} columns)")
        print("="*70 + "\n")
        for i, header in enumerate(headers, 1):
            print(f"{i:3d}. {header}")
    
    return worksheet, all_data


if __name__ == "__main__":
    try:
        worksheet, data = access_sheet()
        
        print("\n" + "="*70)
        print("✅ SUCCESS!")
        print("="*70)
        print(f"\nWorksheet: {worksheet.title}")
        print(f"Total rows: {len(data)}")
        print(f"Total columns: {len(data[0]) if data else 0}")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


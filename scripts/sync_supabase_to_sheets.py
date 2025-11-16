"""
Sync Supabase to Google Sheets - Comments & Notes
==================================================
This script syncs comments from Supabase to Google Sheets.

Features:
- Reads comments from Supabase drive_sheets_data table
- Updates Google Sheets "Comments and Notes" worksheet
- Appends new rows if restaurant not found in sheet

Usage:
    python scripts/sync_supabase_to_sheets.py
"""

import os
import json
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

# Google Sheets API scope
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]


def get_google_sheets_client():
    """Initialize Google Sheets client."""
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
    return gspread.authorize(creds)


def get_supabase_client():
    """Initialize Supabase client."""
    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        raise ValueError("Missing Supabase credentials in .env.local")
    return create_client(SUPABASE_URL, SERVICE_ROLE_KEY)


def read_comments_from_supabase(supabase: Client):
    """Read comments from Supabase."""
    print("\n" + "="*70)
    print("📥 READING FROM SUPABASE")
    print("="*70 + "\n")
    
    # Query restaurants with comments
    result = supabase.table('drive_sheets_data')\
        .select('res_id, res_name, am_email, kam_notes')\
        .not_.is_('kam_notes', 'null')\
        .execute()
    
    comments_data = []
    for row in result.data:
        if row.get('kam_notes'):
            comments_data.append({
                'res_id': row['res_id'],
                'res_name': row['res_name'] or '',
                'kam': row['am_email'] or '',
                'comments': row['kam_notes']
            })
    
    print(f"✅ Found {len(comments_data)} restaurants with comments")
    return comments_data


def update_google_sheets(client, comments_data):
    """Update Google Sheets with comments from Supabase."""
    print("\n" + "="*70)
    print("📤 UPDATING GOOGLE SHEETS")
    print("="*70 + "\n")
    
    spreadsheet = client.open_by_key(SHEET_ID)
    
    # Get Comments and Notes worksheet
    worksheet = None
    for ws in spreadsheet.worksheets():
        if ws.title == "Comments and Notes":
            worksheet = ws
            break
    
    if not worksheet:
        print("❌ 'Comments and Notes' worksheet not found!")
        return 0, 0
    
    print(f"✅ Found worksheet: {worksheet.title}")
    
    # Get existing data
    all_data = worksheet.get_all_values()
    
    # Create a map of res_id to row number
    res_id_to_row = {}
    for i, row in enumerate(all_data[1:], 2):  # Start from row 2 (skip header)
        if len(row) > 0 and row[0]:
            res_id_to_row[row[0].strip()] = i
    
    print(f"📋 Found {len(res_id_to_row)} existing rows in sheet")
    
    updated_count = 0
    appended_count = 0
    
    for item in comments_data:
        res_id = item['res_id']
        
        if res_id in res_id_to_row:
            # Update existing row
            row_num = res_id_to_row[res_id]
            worksheet.update(f'D{row_num}', [[item['comments']]])
            updated_count += 1
        else:
            # Append new row
            worksheet.append_row([
                item['res_id'],
                item['res_name'],
                item['kam'],
                item['comments']
            ])
            appended_count += 1
        
        if (updated_count + appended_count) % 10 == 0:
            print(f"   Processed {updated_count + appended_count}/{len(comments_data)}...")
    
    print(f"\n✅ Updated {updated_count} rows")
    print(f"✅ Appended {appended_count} new rows")
    
    return updated_count, appended_count


def main():
    print("\n" + "="*70)
    print("🔄 SUPABASE → GOOGLE SHEETS SYNC")
    print("="*70)
    
    try:
        # Initialize clients
        print("\n🔐 Initializing clients...")
        sheets_client = get_google_sheets_client()
        supabase_client = get_supabase_client()
        print("✅ Clients initialized")
        
        # Read from Supabase
        comments_data = read_comments_from_supabase(supabase_client)
        
        if not comments_data:
            print("\n⚠️  No comments to sync")
            return
        
        # Update Google Sheets
        updated, appended = update_google_sheets(sheets_client, comments_data)
        
        print("\n" + "="*70)
        print("✅ SYNC COMPLETE!")
        print("="*70)
        print(f"\nTotal processed: {len(comments_data)}")
        print(f"Updated: {updated}")
        print(f"Appended: {appended}")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()


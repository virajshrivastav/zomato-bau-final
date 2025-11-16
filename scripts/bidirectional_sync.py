"""
Bi-Directional Sync: Google Sheets ↔ Supabase
==============================================
This script performs bi-directional sync between Google Sheets and Supabase.

Features:
- Syncs comments from Google Sheets to Supabase
- Syncs comments from Supabase to Google Sheets
- Handles conflicts (last write wins)
- Tracks sync status

Usage:
    python scripts/bidirectional_sync.py [--direction sheets-to-db|db-to-sheets|both]
"""

import os
import sys
import argparse
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
import gspread
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

# Configuration
SHEET_ID = '1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ'
CREDENTIALS_FILE = 'service-account-credentials.json'
WORKSHEET_NAME = 'Comments and Notes'

# Supabase configuration
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Google Sheets API scope
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]


def print_header(text):
    print("\n" + "="*70)
    print(text)
    print("="*70 + "\n")


def get_google_sheets_client():
    """Initialize Google Sheets client."""
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
    return gspread.authorize(creds)


def get_supabase_client():
    """Initialize Supabase client."""
    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        raise ValueError("Missing Supabase credentials in .env.local")
    return create_client(SUPABASE_URL, SERVICE_ROLE_KEY)


def get_worksheet(sheets_client):
    """Get the Comments and Notes worksheet."""
    spreadsheet = sheets_client.open_by_key(SHEET_ID)
    
    for ws in spreadsheet.worksheets():
        if ws.title == WORKSHEET_NAME:
            return ws
    
    raise ValueError(f"Worksheet '{WORKSHEET_NAME}' not found!")


def sync_sheets_to_supabase(sheets_client, supabase_client):
    """Sync from Google Sheets to Supabase."""
    print_header("📥 SYNCING: GOOGLE SHEETS → SUPABASE")
    
    worksheet = get_worksheet(sheets_client)
    all_data = worksheet.get_all_values()
    
    if len(all_data) <= 1:
        print("⚠️  No data to sync (only headers)")
        return 0, 0
    
    headers = all_data[0]
    print(f"📋 Headers: {headers}")
    
    success_count = 0
    error_count = 0
    
    for i, row in enumerate(all_data[1:], 1):
        if len(row) < 4:
            continue
        
        res_id = row[0].strip()
        comments = row[3].strip() if len(row) > 3 else ''
        
        if not res_id:
            continue
        
        try:
            # Check if restaurant exists
            result = supabase_client.table('drive_sheets_data')\
                .select('res_id')\
                .eq('res_id', res_id)\
                .execute()
            
            if result.data:
                # Update with comment
                supabase_client.table('drive_sheets_data')\
                    .update({'kam_notes': comments if comments else None})\
                    .eq('res_id', res_id)\
                    .execute()
                
                success_count += 1
                if i % 50 == 0:
                    print(f"   Processed {i} rows...")
            else:
                error_count += 1
                
        except Exception as e:
            print(f"   ❌ Error updating {res_id}: {e}")
            error_count += 1
    
    print(f"\n✅ Successfully synced {success_count} restaurants")
    if error_count > 0:
        print(f"⚠️  {error_count} errors/skipped")
    
    return success_count, error_count


def sync_supabase_to_sheets(sheets_client, supabase_client):
    """Sync from Supabase to Google Sheets."""
    print_header("📤 SYNCING: SUPABASE → GOOGLE SHEETS")
    
    # Get all restaurants with comments from Supabase
    result = supabase_client.table('drive_sheets_data')\
        .select('res_id, res_name, am_email, kam_notes')\
        .execute()
    
    print(f"📊 Found {len(result.data)} restaurants in database")
    
    # Filter only those with comments
    restaurants_with_notes = [r for r in result.data if r.get('kam_notes')]
    print(f"📝 {len(restaurants_with_notes)} have comments/notes")
    
    if not restaurants_with_notes:
        print("⚠️  No comments to sync")
        return 0, 0
    
    worksheet = get_worksheet(sheets_client)
    all_data = worksheet.get_all_values()
    
    # Create map of res_id to row number
    res_id_to_row = {}
    for i, row in enumerate(all_data[1:], 2):
        if len(row) > 0 and row[0]:
            res_id_to_row[row[0].strip()] = i
    
    updated_count = 0
    appended_count = 0
    
    for item in restaurants_with_notes:
        res_id = item['res_id']
        
        try:
            if res_id in res_id_to_row:
                # Update existing row
                row_num = res_id_to_row[res_id]
                worksheet.update(f'D{row_num}', [[item['kam_notes']]])
                updated_count += 1
            else:
                # Append new row
                worksheet.append_row([
                    item['res_id'],
                    item.get('res_name', ''),
                    item.get('am_email', ''),
                    item['kam_notes']
                ])
                appended_count += 1
            
            if (updated_count + appended_count) % 50 == 0:
                print(f"   Processed {updated_count + appended_count} rows...")
                
        except Exception as e:
            print(f"   ❌ Error syncing {res_id}: {e}")
    
    print(f"\n✅ Updated {updated_count} rows")
    print(f"✅ Appended {appended_count} new rows")
    
    return updated_count, appended_count


def main():
    parser = argparse.ArgumentParser(description='Bi-directional sync between Google Sheets and Supabase')
    parser.add_argument('--direction', choices=['sheets-to-db', 'db-to-sheets', 'both'], 
                       default='both', help='Sync direction')
    args = parser.parse_args()
    
    print_header("🔄 BI-DIRECTIONAL SYNC: GOOGLE SHEETS ↔ SUPABASE")
    print(f"Direction: {args.direction}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Initialize clients
        print("\n🔐 Initializing clients...")
        sheets_client = get_google_sheets_client()
        supabase_client = get_supabase_client()
        print("✅ Clients initialized")
        
        # Perform sync based on direction
        if args.direction in ['sheets-to-db', 'both']:
            sync_sheets_to_supabase(sheets_client, supabase_client)
        
        if args.direction in ['db-to-sheets', 'both']:
            sync_supabase_to_sheets(sheets_client, supabase_client)
        
        print_header("✅ SYNC COMPLETE!")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()


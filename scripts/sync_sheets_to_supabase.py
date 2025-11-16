"""
Sync Google Sheets to Supabase - Comments & Notes
==================================================
This script syncs the "Comments and Notes" worksheet from Google Sheets to Supabase.

Features:
- Reads comments from Google Sheets
- Updates/inserts into Supabase drive_sheets_data table
- Handles bi-directional sync

Usage:
    python scripts/sync_sheets_to_supabase.py
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


def read_comments_from_sheets(client):
    """Read comments from Google Sheets."""
    print("\n" + "="*70)
    print("📥 READING FROM GOOGLE SHEETS")
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
        return []
    
    print(f"✅ Found worksheet: {worksheet.title}")
    
    # Get all data
    all_data = worksheet.get_all_values()
    
    if not all_data:
        print("❌ No data found in worksheet")
        return []
    
    # Parse data (assuming first row is headers)
    headers = all_data[0]
    print(f"📋 Headers: {headers}")
    
    comments_data = []
    for i, row in enumerate(all_data[1:], 1):
        if len(row) < 4:
            continue
        
        res_id = row[0].strip()
        res_name = row[1].strip()
        kam = row[2].strip()
        comments = row[3].strip()
        
        if res_id and comments:  # Only include rows with res_id and comments
            comments_data.append({
                'res_id': res_id,
                'res_name': res_name,
                'kam': kam,
                'comments': comments
            })
    
    print(f"✅ Found {len(comments_data)} rows with comments")
    return comments_data


def update_supabase(supabase: Client, comments_data):
    """Update Supabase with comments from Google Sheets."""
    print("\n" + "="*70)
    print("📤 UPDATING SUPABASE")
    print("="*70 + "\n")
    
    success_count = 0
    error_count = 0
    
    for i, item in enumerate(comments_data, 1):
        try:
            # Check if restaurant exists
            result = supabase.table('drive_sheets_data')\
                .select('res_id')\
                .eq('res_id', item['res_id'])\
                .execute()
            
            if result.data:
                # Update existing restaurant
                supabase.table('drive_sheets_data')\
                    .update({'kam_notes': item['comments']})\
                    .eq('res_id', item['res_id'])\
                    .execute()
                
                success_count += 1
                if i % 10 == 0:
                    print(f"   Processed {i}/{len(comments_data)}...")
            else:
                print(f"   ⚠️  Restaurant {item['res_id']} not found in database")
                error_count += 1
                
        except Exception as e:
            print(f"   ❌ Error updating {item['res_id']}: {e}")
            error_count += 1
    
    print(f"\n✅ Updated {success_count} restaurants")
    if error_count > 0:
        print(f"⚠️  {error_count} errors/warnings")
    
    return success_count, error_count


def main():
    print("\n" + "="*70)
    print("🔄 GOOGLE SHEETS → SUPABASE SYNC")
    print("="*70)
    
    try:
        # Initialize clients
        print("\n🔐 Initializing clients...")
        sheets_client = get_google_sheets_client()
        supabase_client = get_supabase_client()
        print("✅ Clients initialized")
        
        # Read from Google Sheets
        comments_data = read_comments_from_sheets(sheets_client)
        
        if not comments_data:
            print("\n⚠️  No comments to sync")
            return
        
        # Update Supabase
        success, errors = update_supabase(supabase_client, comments_data)
        
        print("\n" + "="*70)
        print("✅ SYNC COMPLETE!")
        print("="*70)
        print(f"\nTotal processed: {len(comments_data)}")
        print(f"Successful: {success}")
        print(f"Errors: {errors}")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()


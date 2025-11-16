"""
Sync Single Restaurant KAM Actions to Google Sheets
====================================================
This script syncs a single restaurant's KAM actions from Supabase to Google Sheets.
Designed to be called after each database mutation for real-time sync.

Usage:
    python scripts/sync_single_restaurant_to_sheets.py --res-id 19076767 --drive ncn
    python scripts/sync_single_restaurant_to_sheets.py --res-id 19076767 --drive n2r
    python scripts/sync_single_restaurant_to_sheets.py --res-id 19076767 --drive items
"""

import os
import sys
import argparse
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
import gspread
from supabase import create_client

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

# Tab names
TAB_NAMES = {
    'ncn': 'NCN',
    'n2r': 'N2R',
    'items': 'Items >=159'
}


def get_clients():
    """Initialize Google Sheets and Supabase clients."""
    # Google Sheets
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"❌ Credentials file not found: {CREDENTIALS_FILE}", file=sys.stderr)
        sys.exit(1)
    
    credentials = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
    sheets_client = gspread.authorize(credentials)
    
    # Supabase
    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        print("❌ Missing Supabase credentials", file=sys.stderr)
        sys.exit(1)
    
    supabase_client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
    
    return sheets_client, supabase_client


def fetch_restaurant_data(supabase_client, res_id):
    """Fetch restaurant data from Supabase."""
    result = supabase_client.table('drive_sheets_data')\
        .select('*')\
        .eq('res_id', res_id)\
        .single()\
        .execute()
    
    return result.data if result.data else None


def find_or_create_row(worksheet, res_id):
    """Find existing row or create new one for the restaurant."""
    all_values = worksheet.get_all_values()
    
    # Skip title and header rows
    for i, row in enumerate(all_values[2:], 3):  # Start from row 3
        if row and row[0] == str(res_id):
            return i
    
    # Not found, append new row
    return len(all_values) + 1


def sync_ncn(sheets_client, restaurant_data):
    """Sync NCN data to Google Sheets."""
    spreadsheet = sheets_client.open_by_key(SHEET_ID)
    worksheet = spreadsheet.worksheet(TAB_NAMES['ncn'])
    
    res_id = restaurant_data['res_id']
    row_num = find_or_create_row(worksheet, res_id)
    
    # Extract NCN selected codes
    selected_codes = restaurant_data.get('ncn_selected_codes') or {}
    la_codes = ', '.join(selected_codes.get('la', [])) if isinstance(selected_codes.get('la'), list) else ''
    mm_codes = ', '.join(selected_codes.get('mm', [])) if isinstance(selected_codes.get('mm'), list) else ''
    um_codes = ', '.join(selected_codes.get('um', [])) if isinstance(selected_codes.get('um'), list) else ''
    
    # Prepare row data (9 columns)
    row_data = [
        str(res_id),
        restaurant_data.get('res_name', ''),
        restaurant_data.get('am_email', ''),
        restaurant_data.get('ncn_approached_by_kam', ''),
        restaurant_data.get('ncn_converted_by_kam', ''),
        la_codes,
        mm_codes,
        um_codes,
        ''  # Picked Status - TBD
    ]
    
    # Update the row
    worksheet.update(values=[row_data], range_name=f'A{row_num}:I{row_num}')
    print(f"✅ NCN synced for restaurant {res_id}")


def sync_n2r(sheets_client, restaurant_data):
    """Sync N2R data to Google Sheets."""
    spreadsheet = sheets_client.open_by_key(SHEET_ID)
    worksheet = spreadsheet.worksheet(TAB_NAMES['n2r'])
    
    res_id = restaurant_data['res_id']
    row_num = find_or_create_row(worksheet, res_id)
    
    # Prepare row data (5 columns)
    row_data = [
        str(res_id),
        restaurant_data.get('res_name', ''),
        restaurant_data.get('am_email', ''),
        restaurant_data.get('n2r_approached_by_kam', ''),
        restaurant_data.get('n2r_converted_by_kam', '')
    ]
    
    # Update the row
    worksheet.update(values=[row_data], range_name=f'A{row_num}:E{row_num}')
    print(f"✅ N2R synced for restaurant {res_id}")


def sync_items(sheets_client, restaurant_data):
    """Sync Items data to Google Sheets."""
    spreadsheet = sheets_client.open_by_key(SHEET_ID)
    worksheet = spreadsheet.worksheet(TAB_NAMES['items'])
    
    res_id = restaurant_data['res_id']
    row_num = find_or_create_row(worksheet, res_id)
    
    # Extract items added
    items_added = restaurant_data.get('items_added') or []
    
    # Prepare row data (15 columns: basic + 5 items with prices)
    row_data = [
        str(res_id),
        restaurant_data.get('res_name', ''),
        restaurant_data.get('am_email', ''),
        restaurant_data.get('items_approached_by_kam', ''),
        restaurant_data.get('items_converted_by_kam', '')
    ]
    
    # Add up to 5 items
    for i in range(5):
        if i < len(items_added) and items_added[i].get('checked'):
            row_data.append(items_added[i].get('name', ''))
            row_data.append(items_added[i].get('price', ''))
        else:
            row_data.append('')
            row_data.append('')
    
    # Update the row
    worksheet.update(values=[row_data], range_name=f'A{row_num}:O{row_num}')
    print(f"✅ Items synced for restaurant {res_id}")


def main():
    """Main sync function."""
    parser = argparse.ArgumentParser(description='Sync single restaurant to Google Sheets')
    parser.add_argument('--res-id', required=True, help='Restaurant ID')
    parser.add_argument('--drive', required=True, choices=['ncn', 'n2r', 'items'], help='Drive type')
    args = parser.parse_args()
    
    try:
        # Initialize clients
        sheets_client, supabase_client = get_clients()
        
        # Fetch restaurant data
        restaurant_data = fetch_restaurant_data(supabase_client, args.res_id)
        
        if not restaurant_data:
            print(f"❌ Restaurant {args.res_id} not found", file=sys.stderr)
            sys.exit(1)
        
        # Sync based on drive type
        if args.drive == 'ncn':
            sync_ncn(sheets_client, restaurant_data)
        elif args.drive == 'n2r':
            sync_n2r(sheets_client, restaurant_data)
        elif args.drive == 'items':
            sync_items(sheets_client, restaurant_data)
        
        print(f"✅ Sync complete for {args.res_id} ({args.drive})")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()


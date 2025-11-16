"""
Sync KAM Actions to Google Sheets - Drive Data
===============================================
This script syncs KAM actions from Supabase to Google Sheets NCN/N2R/Items tabs.

Features:
- Reads KAM actions from Supabase drive_sheets_data table
- Updates Google Sheets NCN/N2R/Items worksheets with new columns
- Handles JSONB data transformation (selected codes, items added)

Usage:
    python scripts/sync_kam_actions_to_sheets.py
"""

import os
import json
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

# Supabase configuration
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Google Sheets API scope
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]


def print_header(text):
    """Print formatted header."""
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


def format_selected_codes(codes_json, tier):
    """
    Extract codes for a specific tier from JSONB.

    Args:
        codes_json: JSONB object like {"la": ["la-base", "la-step1"], "mm": [], "um": []}
        tier: "la", "mm", or "um"

    Returns:
        Comma-separated string like "la-base, la-step1" or empty string
    """
    if not codes_json or not isinstance(codes_json, dict):
        return ""

    tier_codes = codes_json.get(tier, [])
    if not tier_codes or not isinstance(tier_codes, list):
        return ""

    return ", ".join(tier_codes)


def format_items_added(items_json):
    """
    Extract items from JSONB array.

    Args:
        items_json: JSONB array like [{"id": "1", "name": "Paneer", "price": "150", "checked": true}, ...]

    Returns:
        Tuple of (names_str, prices_str, count)
        Example: ("Paneer Tikka, Dal Makhani", "150, 120", 2)
    """
    if not items_json or not isinstance(items_json, list):
        return "", "", 0

    # Filter only checked items
    checked_items = [item for item in items_json if item.get('checked') and item.get('name')]

    if not checked_items:
        return "", "", 0

    names = [item['name'] for item in checked_items]
    prices = [item.get('price', '') for item in checked_items]

    return ", ".join(names), ", ".join(prices), len(checked_items)


def read_kam_actions_from_supabase(supabase: Client):
    """Read KAM actions from Supabase."""
    print_header("📥 READING KAM ACTIONS FROM SUPABASE")

    # Query all restaurants with KAM action data
    result = supabase.table('drive_sheets_data')\
        .select('res_id, ncn_approached_by_kam, ncn_converted_by_kam, ncn_selected_codes, '
                'n2r_approached_by_kam, n2r_converted_by_kam, '
                'items_approached_by_kam, items_converted_by_kam, items_added, '
                'last_updated_by, last_updated_at')\
        .execute()

    print(f"✅ Found {len(result.data)} restaurants in database")

    # Filter only those with at least one KAM action
    restaurants_with_actions = []
    for row in result.data:
        has_action = any([
            row.get('ncn_approached_by_kam'),
            row.get('ncn_converted_by_kam'),
            row.get('n2r_approached_by_kam'),
            row.get('n2r_converted_by_kam'),
            row.get('items_approached_by_kam'),
            row.get('items_converted_by_kam'),
        ])

        if has_action:
            restaurants_with_actions.append(row)

    print(f"📝 {len(restaurants_with_actions)} restaurants have KAM actions")
    return restaurants_with_actions





def ensure_columns_exist(worksheet, tab_name):
    """
    Ensure the KAM action columns exist in the worksheet.
    Adds headers if they don't exist.

    Args:
        worksheet: gspread worksheet object
        tab_name: "NCN", "N2R", or "Items"
    """
    print(f"\n🔍 Checking columns in '{tab_name}' tab...")

    # Get current headers (row 1)
    headers = worksheet.row_values(1)
    current_col_count = len(headers)

    print(f"   Current columns: {current_col_count}")

    # Define new headers based on tab
    if tab_name == "NCN":
        new_headers = [
            "KAM Approached",
            "KAM Converted",
            "Selected LA Codes",
            "Selected MM Codes",
            "Selected UM Codes",
            "Last Updated By",
            "Last Updated At"
        ]
    elif tab_name == "N2R":
        new_headers = [
            "KAM Approached",
            "KAM Converted",
            "Last Updated By",
            "Last Updated At"
        ]
    elif tab_name == "Items":
        new_headers = [
            "KAM Approached",
            "KAM Converted",
            "Items Added (Names)",
            "Items Added (Prices)",
            "Items Added (Count)",
            "Last Updated By",
            "Last Updated At"
        ]
    else:
        raise ValueError(f"Unknown tab name: {tab_name}")

    # Check if headers already exist
    start_col = current_col_count + 1

    # Get column letter for start position
    def col_num_to_letter(n):
        """Convert column number to letter (1=A, 27=AA, etc.)"""
        result = ""
        while n > 0:
            n -= 1
            result = chr(65 + (n % 26)) + result
            n //= 26
        return result

    start_col_letter = col_num_to_letter(start_col)
    end_col_letter = col_num_to_letter(start_col + len(new_headers) - 1)

    # Check if headers already exist
    existing_end_headers = worksheet.row_values(1)[current_col_count:current_col_count + len(new_headers)]

    if existing_end_headers == new_headers:
        print(f"   ✅ Headers already exist ({start_col_letter}-{end_col_letter})")
        return start_col

    # Add headers
    print(f"   📝 Adding headers to columns {start_col_letter}-{end_col_letter}...")

    # Update headers row
    range_notation = f"{start_col_letter}1:{end_col_letter}1"
    worksheet.update(range_notation, [new_headers])

    print(f"   ✅ Headers added!")
    return start_col


def col_num_to_letter(n):
    """Convert column number to letter (1=A, 27=AA, etc.)"""
    result = ""
    while n > 0:
        n -= 1
        result = chr(65 + (n % 26)) + result
        n //= 26
    return result


def sync_ncn_tab(sheets_client, kam_actions):
    """Sync KAM actions to NCN tab."""
    print_header("📤 SYNCING NCN TAB")

    spreadsheet = sheets_client.open_by_key(SHEET_ID)

    # Find NCN worksheet
    worksheet = None
    for ws in spreadsheet.worksheets():
        if "NCN" in ws.title or "No cooking november" in ws.title:
            worksheet = ws
            break

    if not worksheet:
        print("❌ NCN worksheet not found!")
        return 0

    print(f"✅ Found worksheet: {worksheet.title}")

    # Ensure columns exist
    start_col = ensure_columns_exist(worksheet, "NCN")

    # Get all res_ids from sheet
    all_data = worksheet.get_all_values()
    res_id_to_row = {}

    for i, row in enumerate(all_data[1:], 2):  # Start from row 2 (skip header)
        if len(row) > 0 and row[0]:
            res_id_to_row[row[0].strip()] = i

    print(f"📋 Found {len(res_id_to_row)} restaurants in sheet")

    # Update rows
    updated_count = 0

    for action in kam_actions:
        res_id = action['res_id']

        if res_id not in res_id_to_row:
            continue

        row_num = res_id_to_row[res_id]

        # Prepare data for this row
        ncn_approached = action.get('ncn_approached_by_kam') or ""
        ncn_converted = action.get('ncn_converted_by_kam') or ""

        # Format selected codes
        selected_codes = action.get('ncn_selected_codes') or {}
        la_codes = format_selected_codes(selected_codes, 'la')
        mm_codes = format_selected_codes(selected_codes, 'mm')
        um_codes = format_selected_codes(selected_codes, 'um')

        last_updated_by = action.get('last_updated_by') or ""
        last_updated_at = action.get('last_updated_at') or ""


        # Format timestamp
        if last_updated_at:
            try:
                dt = datetime.fromisoformat(last_updated_at.replace('Z', '+00:00'))
                last_updated_at = dt.strftime('%Y-%m-%d %H:%M:%S')
            except:
                pass

        # Update row (columns AA-AG)
        row_data = [
            ncn_approached,
            ncn_converted,
            la_codes,
            mm_codes,
            um_codes,
            last_updated_by,
            last_updated_at
        ]

        start_col_letter = col_num_to_letter(start_col)
        end_col_letter = col_num_to_letter(start_col + 6)  # 7 columns total

        range_notation = f"{start_col_letter}{row_num}:{end_col_letter}{row_num}"
        worksheet.update(range_notation, [row_data])

        updated_count += 1

        if updated_count % 10 == 0:
            print(f"   Processed {updated_count}...")

    print(f"\n✅ Updated {updated_count} rows in NCN tab")
    return updated_count


def sync_n2r_tab(sheets_client, kam_actions):
    """Sync KAM actions to N2R tab."""
    print_header("📤 SYNCING N2R TAB")

    spreadsheet = sheets_client.open_by_key(SHEET_ID)

    # Find N2R worksheet
    worksheet = None
    for ws in spreadsheet.worksheets():
        if "N2R" in ws.title or "New to restaurant" in ws.title:
            worksheet = ws
            break

    if not worksheet:
        print("❌ N2R worksheet not found!")
        return 0

    print(f"✅ Found worksheet: {worksheet.title}")

    # Ensure columns exist
    start_col = ensure_columns_exist(worksheet, "N2R")

    # Get all res_ids from sheet
    all_data = worksheet.get_all_values()
    res_id_to_row = {}

    for i, row in enumerate(all_data[1:], 2):
        if len(row) > 0 and row[0]:
            res_id_to_row[row[0].strip()] = i

    print(f"📋 Found {len(res_id_to_row)} restaurants in sheet")

    # Update rows
    updated_count = 0

    for action in kam_actions:
        res_id = action['res_id']

        if res_id not in res_id_to_row:
            continue

        row_num = res_id_to_row[res_id]

        # Prepare data for this row
        n2r_approached = action.get('n2r_approached_by_kam') or ""
        n2r_converted = action.get('n2r_converted_by_kam') or ""
        last_updated_by = action.get('last_updated_by') or ""
        last_updated_at = action.get('last_updated_at') or ""

        # Format timestamp
        if last_updated_at:
            try:
                dt = datetime.fromisoformat(last_updated_at.replace('Z', '+00:00'))
                last_updated_at = dt.strftime('%Y-%m-%d %H:%M:%S')
            except:
                pass

        # Update row (columns AA-AD)
        row_data = [
            n2r_approached,
            n2r_converted,
            last_updated_by,
            last_updated_at
        ]

        start_col_letter = col_num_to_letter(start_col)
        end_col_letter = col_num_to_letter(start_col + 3)  # 4 columns total

        range_notation = f"{start_col_letter}{row_num}:{end_col_letter}{row_num}"
        worksheet.update(range_notation, [row_data])

        updated_count += 1

        if updated_count % 10 == 0:
            print(f"   Processed {updated_count}...")

    print(f"\n✅ Updated {updated_count} rows in N2R tab")
    return updated_count


def sync_items_tab(sheets_client, kam_actions):
    """Sync KAM actions to Items tab."""
    print_header("📤 SYNCING ITEMS TAB")

    spreadsheet = sheets_client.open_by_key(SHEET_ID)

    # Find Items worksheet
    worksheet = None
    for ws in spreadsheet.worksheets():
        if "Items" in ws.title and "159" in ws.title:
            worksheet = ws
            break

    if not worksheet:
        print("❌ Items worksheet not found!")
        return 0

    print(f"✅ Found worksheet: {worksheet.title}")

    # Ensure columns exist
    start_col = ensure_columns_exist(worksheet, "Items")

    # Get all res_ids from sheet
    all_data = worksheet.get_all_values()
    res_id_to_row = {}

    for i, row in enumerate(all_data[1:], 2):
        if len(row) > 0 and row[0]:
            res_id_to_row[row[0].strip()] = i

    print(f"📋 Found {len(res_id_to_row)} restaurants in sheet")

    # Update rows
    updated_count = 0

    for action in kam_actions:
        res_id = action['res_id']

        if res_id not in res_id_to_row:
            continue

        row_num = res_id_to_row[res_id]

        # Prepare data for this row
        items_approached = action.get('items_approached_by_kam') or ""
        items_converted = action.get('items_converted_by_kam') or ""

        # Format items added
        items_json = action.get('items_added') or []
        items_names, items_prices, items_count = format_items_added(items_json)

        last_updated_by = action.get('last_updated_by') or ""
        last_updated_at = action.get('last_updated_at') or ""

        # Format timestamp
        if last_updated_at:
            try:
                dt = datetime.fromisoformat(last_updated_at.replace('Z', '+00:00'))
                last_updated_at = dt.strftime('%Y-%m-%d %H:%M:%S')
            except:
                pass

        # Update row (columns AA-AG)
        row_data = [
            items_approached,
            items_converted,
            items_names,
            items_prices,
            str(items_count) if items_count > 0 else "",
            last_updated_by,
            last_updated_at
        ]

        start_col_letter = col_num_to_letter(start_col)
        end_col_letter = col_num_to_letter(start_col + 6)  # 7 columns total

        range_notation = f"{start_col_letter}{row_num}:{end_col_letter}{row_num}"
        worksheet.update(range_notation, [row_data])

        updated_count += 1

        if updated_count % 10 == 0:
            print(f"   Processed {updated_count}...")

    print(f"\n✅ Updated {updated_count} rows in Items tab")
    return updated_count


def main():
    """Main sync function."""
    print("\n" + "="*70)
    print("🔄 KAM ACTIONS → GOOGLE SHEETS SYNC")
    print("="*70)

    try:
        # Initialize clients
        print("\n🔐 Initializing clients...")
        sheets_client = get_google_sheets_client()
        supabase_client = get_supabase_client()
        print("✅ Clients initialized")

        # Read KAM actions from Supabase
        kam_actions = read_kam_actions_from_supabase(supabase_client)

        if not kam_actions:
            print("\n⚠️  No KAM actions to sync")
            return

        # Sync to each tab
        ncn_count = sync_ncn_tab(sheets_client, kam_actions)
        n2r_count = sync_n2r_tab(sheets_client, kam_actions)
        items_count = sync_items_tab(sheets_client, kam_actions)

        # Summary
        print_header("✅ SYNC COMPLETE!")
        print(f"NCN Tab:   {ncn_count} rows updated")
        print(f"N2R Tab:   {n2r_count} rows updated")
        print(f"Items Tab: {items_count} rows updated")
        print(f"\nTotal:     {ncn_count + n2r_count + items_count} updates")

    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()


"""
Import Performance Metrics Data Directly from Google Sheets
============================================================
This script imports KAM performance metrics directly from Google Sheets
using the Google Sheets API with FORMATTED_VALUE option to properly read
formula results.

This solves the issue where formulas in sheets are read as null values
when using CSV exports.

Google Sheets Tabs:
1. NCN Coverage Summary - NCN drive metrics
2. N2R Summary - N2R drive metrics  
3. Input Summary - Items drive metrics

Output:
- Directly to Supabase database

Usage:
    python scripts/import_performance_metrics_from_sheets.py
"""

import os
import sys
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

# Configuration
SHEET_ID = os.getenv('GOOGLE_SHEET_ID', '1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ')
CREDENTIALS_FILE = 'service-account-credentials.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Supabase configuration
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

# Tab names
NCN_TAB = 'NCN Coverage Summary'
N2R_TAB = 'N2R Summary'
ITEMS_TAB = 'Input Summary'


def get_sheets_service():
    """Initialize Google Sheets API service."""
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=creds)
    return service


def get_supabase_client():
    """Initialize Supabase client."""
    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        raise ValueError("Missing Supabase credentials in .env.local")
    return create_client(SUPABASE_URL, SERVICE_ROLE_KEY)


def safe_str(value):
    """Convert value to string, handling None and empty values."""
    if value is None or value == '':
        return None
    str_value = str(value).strip()
    if str_value.lower() in ['none', 'nan', 'null', 'n/a', '', '#n/a', '#value!', '#ref!']:
        return None
    return str_value


def is_valid_email(email):
    """Check if email is a valid Zomato email."""
    if not email:
        return False
    return '@zomato.com' in email.lower()


def read_sheet_data(service, tab_name, range_spec):
    """
    Read data from Google Sheets using FORMATTED_VALUE to get formula results.
    
    Args:
        service: Google Sheets API service
        tab_name: Name of the tab/worksheet
        range_spec: Range to read (e.g., 'A1:Z1000')
    
    Returns:
        List of rows with values
    """
    print(f"📖 Reading from '{tab_name}' tab...")
    
    result = service.spreadsheets().values().get(
        spreadsheetId=SHEET_ID,
        range=f"'{tab_name}'!{range_spec}",
        valueRenderOption='FORMATTED_VALUE'  # This gets calculated formula values!
    ).execute()
    
    values = result.get('values', [])
    print(f"✅ Retrieved {len(values)} rows from '{tab_name}'")
    return values


def parse_ncn_data(service):
    """Parse NCN Coverage Summary from Google Sheets."""
    print("\n" + "="*70)
    print("📊 PARSING NCN COVERAGE SUMMARY")
    print("="*70 + "\n")
    
    # Read data (skip first 2 rows which are headers)
    all_data = read_sheet_data(service, NCN_TAB, 'A1:Z1000')
    
    if len(all_data) < 3:
        print("❌ Not enough data in NCN tab")
        return []
    
    data = []
    skipped_count = 0
    
    # Start from row 3 (index 2) - actual data rows
    for row in all_data[2:]:
        if len(row) < 2:
            continue
            
        kam_email = safe_str(row[1] if len(row) > 1 else None)  # Column B
        
        if not is_valid_email(kam_email):
            skipped_count += 1
            continue
        
        record = {
            'kam_email': kam_email,
            'kam_name': kam_email.split('@')[0] if '@' in kam_email else None,
            'tl_email': safe_str(row[2] if len(row) > 2 else None),  # Column C
            'team': safe_str(row[3] if len(row) > 3 else None),  # Column D
            
            # Stepper/Base Coverage (Columns E-J)
            'la_base_coverage': safe_str(row[4] if len(row) > 4 else None),
            'mm_base_coverage': safe_str(row[5] if len(row) > 5 else None),
            'um_base_coverage': safe_str(row[6] if len(row) > 6 else None),
            'la_stepper_coverage': safe_str(row[7] if len(row) > 7 else None),
            'mm_stepper_coverage': safe_str(row[8] if len(row) > 8 else None),
            'um_stepper_coverage': safe_str(row[9] if len(row) > 9 else None),
            
            # Delta (Columns K-M)
            'delta_la': safe_str(row[10] if len(row) > 10 else None),
            'delta_mm': safe_str(row[11] if len(row) > 11 else None),
            'delta_um': safe_str(row[12] if len(row) > 12 else None),
            
            # Other metrics (Columns O, Q, T, U)
            'flash_sale_coverage': safe_str(row[14] if len(row) > 14 else None),  # Column O
            'bogo_ov_coverage': safe_str(row[16] if len(row) > 16 else None),  # Column Q
            'overall_ov_coverage': safe_str(row[19] if len(row) > 19 else None),  # Column T
            'overall_res_coverage': safe_str(row[20] if len(row) > 20 else None),  # Column U

            # BOGO sub-metrics (if available in future)
            'bogo_get150': None,
            'bogo_take150': None,
            'bogo_binge150': None,
        }
        data.append(record)

    if skipped_count > 0:
        print(f"⚠️  Skipped {skipped_count} invalid rows (non-email entries)")
    print(f"✅ Parsed {len(data)} valid NCN records")
    return data


def parse_n2r_data(service):
    """Parse N2R Summary from Google Sheets."""
    print("\n" + "="*70)
    print("📊 PARSING N2R SUMMARY")
    print("="*70 + "\n")

    # Read data (skip first 2 rows which are headers)
    all_data = read_sheet_data(service, N2R_TAB, 'A1:Z1000')

    if len(all_data) < 3:
        print("❌ Not enough data in N2R tab")
        return []

    data = []
    skipped_count = 0

    # Start from row 3 (index 2) - actual data rows
    for row in all_data[2:]:
        if len(row) < 2:
            continue

        kam_email = safe_str(row[1] if len(row) > 1 else None)  # Column B

        if not is_valid_email(kam_email):
            skipped_count += 1
            continue

        record = {
            'kam_email': kam_email,
            'kam_name': kam_email.split('@')[0] if '@' in kam_email else None,
            'tl_email': safe_str(row[2] if len(row) > 2 else None),  # Column C
            'team': safe_str(row[3] if len(row) > 3 else None),  # Column D

            # OV Conversions (Columns M, S, Y)
            'la_ov_conversion': safe_str(row[12] if len(row) > 12 else None),  # Column M
            'mm_ov_conversion': safe_str(row[18] if len(row) > 18 else None),  # Column S
            'um_ov_conversion': safe_str(row[24] if len(row) > 24 else None),  # Column Y
        }
        data.append(record)

    if skipped_count > 0:
        print(f"⚠️  Skipped {skipped_count} invalid rows (non-email entries)")
    print(f"✅ Parsed {len(data)} valid N2R records")
    return data


def parse_items_data(service):
    """Parse Input Summary from Google Sheets."""
    print("\n" + "="*70)
    print("📊 PARSING INPUT SUMMARY (ITEMS)")
    print("="*70 + "\n")

    # Read data (skip first 4 rows which are headers)
    all_data = read_sheet_data(service, ITEMS_TAB, 'A1:EZ1000')

    if len(all_data) < 5:
        print("❌ Not enough data in Items tab")
        return []

    data = []
    skipped_count = 0

    # Start from row 5 (index 4) - actual data rows
    for row in all_data[4:]:
        if len(row) < 2:
            continue

        kam_email = safe_str(row[1] if len(row) > 1 else None)  # Column B

        if not is_valid_email(kam_email):
            skipped_count += 1
            continue

        record = {
            'kam_email': kam_email,
            'kam_name': kam_email.split('@')[0] if '@' in kam_email else None,
            'tl_email': safe_str(row[2] if len(row) > 2 else None),  # Column C
            'team': safe_str(row[3] if len(row) > 3 else None),  # Column D

            # OV Coverage (Baseline, W41-44, Delta, WoW) - Columns BZ:CF (77-83)
            'ov_baseline': safe_str(row[77] if len(row) > 77 else None),
            'ov_week41': safe_str(row[78] if len(row) > 78 else None),
            'ov_week42': safe_str(row[79] if len(row) > 79 else None),
            'ov_week43': safe_str(row[80] if len(row) > 80 else None),
            'ov_week44': safe_str(row[81] if len(row) > 81 else None),
            'ov_delta': safe_str(row[82] if len(row) > 82 else None),
            'ov_wow': safe_str(row[83] if len(row) > 83 else None),

            # Items Count (Baseline, W41-44, Delta, WoW) - Columns DV:EB (103-109)
            'items_baseline': safe_str(row[103] if len(row) > 103 else None),
            'items_week41': safe_str(row[104] if len(row) > 104 else None),
            'items_week42': safe_str(row[105] if len(row) > 105 else None),
            'items_week43': safe_str(row[106] if len(row) > 106 else None),
            'items_week44': safe_str(row[107] if len(row) > 107 else None),
            'items_delta': safe_str(row[108] if len(row) > 108 else None),
            'items_wow': safe_str(row[109] if len(row) > 109 else None),
        }
        data.append(record)

    if skipped_count > 0:
        print(f"⚠️  Skipped {skipped_count} invalid rows (non-email entries)")
    print(f"✅ Parsed {len(data)} valid Items records")
    return data


def import_to_supabase(supabase: Client, table_name: str, data: list):
    """Import data to Supabase table."""
    print(f"\n📤 Importing {len(data)} records to {table_name}...")

    try:
        # Upsert in batches
        batch_size = 50
        success_count = 0

        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            result = supabase.table(table_name).upsert(batch).execute()
            success_count += len(batch)
            print(f"   Processed {min(i + batch_size, len(data))}/{len(data)} records...")

        print(f"✅ Successfully imported {success_count} records to {table_name}")
        return True
    except Exception as e:
        print(f"❌ Error importing to {table_name}: {e}")
        return False


def main():
    """Main execution function."""
    print("=" * 70)
    print("📊 PERFORMANCE METRICS IMPORT FROM GOOGLE SHEETS")
    print("=" * 70)
    print()
    print("🔑 This script reads DIRECTLY from Google Sheets using the API")
    print("✨ Formula values are properly calculated and imported")
    print()

    # Initialize services
    print("🔗 Connecting to Google Sheets API...")
    sheets_service = get_sheets_service()
    print("✅ Connected to Google Sheets")

    print("🔗 Connecting to Supabase...")
    supabase = get_supabase_client()
    print("✅ Connected to Supabase")

    # Parse data from sheets
    ncn_data = parse_ncn_data(sheets_service)
    n2r_data = parse_n2r_data(sheets_service)
    items_data = parse_items_data(sheets_service)

    # Summary
    print()
    print("=" * 70)
    print("📝 SUMMARY")
    print("=" * 70)
    print(f"NCN records: {len(ncn_data)}")
    print(f"N2R records: {len(n2r_data)}")
    print(f"Items records: {len(items_data)}")
    print(f"Total records: {len(ncn_data) + len(n2r_data) + len(items_data)}")
    print()

    # Import to Supabase
    print("=" * 70)
    print("📤 IMPORTING TO SUPABASE")
    print("=" * 70)

    ncn_success = import_to_supabase(supabase, 'ncn_summary', ncn_data)
    n2r_success = import_to_supabase(supabase, 'n2r_summary', n2r_data)
    items_success = import_to_supabase(supabase, 'items_summary', items_data)

    # Final status
    print()
    print("=" * 70)
    if ncn_success and n2r_success and items_success:
        print("🎉 SUCCESS! All data imported successfully")
    else:
        print("⚠️  PARTIAL SUCCESS - Some imports failed")
    print("=" * 70)
    print()


if __name__ == "__main__":
    main()


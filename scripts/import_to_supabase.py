"""
Import Performance Metrics Directly to Supabase
================================================
This script imports KAM performance metrics from 3 CSV files directly to Supabase.

Usage:
    python scripts/import_to_supabase.py
"""

import os
import sys
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url: str = os.getenv("VITE_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ ERROR: Missing Supabase credentials in .env.local")
    sys.exit(1)

supabase: Client = create_client(url, key)

# File paths
NCN_CSV = "performance-metrics/Dashboard Context data Drives - NCN Coverage Summary .csv"
N2R_CSV = "performance-metrics/Dashboard Context data Drives - N2R Summary.csv"
ITEMS_CSV = "performance-metrics/Dashboard Context data Drives - Input Summary.csv"


def safe_str(value):
    """Convert value to string, handling None, NaN, and empty values."""
    if value is None or pd.isna(value):
        return None
    str_value = str(value).strip()
    if str_value.lower() in ['none', 'nan', 'null', 'n/a', '']:
        return None
    return str_value


def is_valid_email(email):
    """Check if email is a valid Zomato email."""
    if email is None:
        return False
    return '@zomato.com' in email.lower()


def parse_ncn_csv():
    """Parse NCN Coverage Summary CSV"""
    print("📖 Reading NCN CSV...")
    df = pd.read_csv(NCN_CSV, skiprows=2, encoding='utf-8')

    data_dict = {}  # Use dict to automatically handle duplicates (keeps last occurrence)
    skipped_count = 0
    duplicate_count = 0

    for _, row in df.iterrows():
        kam_email = safe_str(row.iloc[1])

        if not is_valid_email(kam_email):
            skipped_count += 1
            continue

        # Check if this email already exists
        if kam_email in data_dict:
            duplicate_count += 1

        record = {
            'kam_email': kam_email,
            'kam_name': kam_email.split('@')[0],
            'tl_email': safe_str(row.iloc[2]),
            'team': safe_str(row.iloc[3]),
            'la_base_coverage': safe_str(row.iloc[4]),
            'mm_base_coverage': safe_str(row.iloc[5]),
            'um_base_coverage': safe_str(row.iloc[6]),
            'la_stepper_coverage': safe_str(row.iloc[7]),
            'mm_stepper_coverage': safe_str(row.iloc[8]),
            'um_stepper_coverage': safe_str(row.iloc[9]),
            'delta_la': safe_str(row.iloc[10]),
            'delta_mm': safe_str(row.iloc[11]),
            'delta_um': safe_str(row.iloc[12]),
            'flash_sale_coverage': safe_str(row.iloc[14]),
            'bogo_ov_coverage': safe_str(row.iloc[16]),
            'overall_ov_coverage': safe_str(row.iloc[19]),
            'overall_res_coverage': safe_str(row.iloc[20]),
            'bogo_get150': safe_str(row.iloc[22]),
            'bogo_take150': safe_str(row.iloc[23]),
            'bogo_binge150': safe_str(row.iloc[24]),
        }
        data_dict[kam_email] = record  # This will overwrite duplicates with latest

    if skipped_count > 0:
        print(f"⚠️  Skipped {skipped_count} invalid rows")
    if duplicate_count > 0:
        print(f"⚠️  Found {duplicate_count} duplicate emails (kept last occurrence)")
    print(f"✅ Parsed {len(data_dict)} unique valid NCN records")
    return list(data_dict.values())


def parse_n2r_csv():
    """Parse N2R Summary CSV"""
    print("📖 Reading N2R CSV...")
    df = pd.read_csv(N2R_CSV, skiprows=2, encoding='utf-8')

    data_dict = {}
    skipped_count = 0
    duplicate_count = 0

    for _, row in df.iterrows():
        kam_email = safe_str(row.iloc[1])

        if not is_valid_email(kam_email):
            skipped_count += 1
            continue

        if kam_email in data_dict:
            duplicate_count += 1

        record = {
            'kam_email': kam_email,
            'kam_name': kam_email.split('@')[0],
            'tl_email': safe_str(row.iloc[2]),
            'team': safe_str(row.iloc[3]),
            'la_ov_conversion': safe_str(row.iloc[12]),
            'mm_ov_conversion': safe_str(row.iloc[18]),
            'um_ov_conversion': safe_str(row.iloc[24]),
        }
        data_dict[kam_email] = record

    if skipped_count > 0:
        print(f"⚠️  Skipped {skipped_count} invalid rows")
    if duplicate_count > 0:
        print(f"⚠️  Found {duplicate_count} duplicate emails (kept last occurrence)")
    print(f"✅ Parsed {len(data_dict)} unique valid N2R records")
    return list(data_dict.values())





def parse_items_csv():
    """Parse Items Summary CSV"""
    print("📖 Reading Items CSV...")
    df = pd.read_csv(ITEMS_CSV, skiprows=4, encoding='utf-8')

    data_dict = {}
    skipped_count = 0
    duplicate_count = 0

    for _, row in df.iterrows():
        kam_email = safe_str(row.iloc[1])

        if not is_valid_email(kam_email):
            skipped_count += 1
            continue

        if kam_email in data_dict:
            duplicate_count += 1

        record = {
            'kam_email': kam_email,
            'kam_name': kam_email.split('@')[0],
            'tl_email': safe_str(row.iloc[2]),
            'team': safe_str(row.iloc[3]),
            'ov_baseline': safe_str(row.iloc[77]),
            'ov_week41': safe_str(row.iloc[78]),
            'ov_week42': safe_str(row.iloc[79]),
            'ov_week43': safe_str(row.iloc[80]),
            'ov_week44': safe_str(row.iloc[81]),
            'ov_delta': safe_str(row.iloc[82]),
            'ov_wow': safe_str(row.iloc[83]),
            'items_baseline': safe_str(row.iloc[103]),
            'items_week41': safe_str(row.iloc[104]),
            'items_week42': safe_str(row.iloc[105]),
            'items_week43': safe_str(row.iloc[106]),
            'items_week44': safe_str(row.iloc[107]),
            'items_delta': safe_str(row.iloc[108]),
            'items_wow': safe_str(row.iloc[109]),
        }
        data_dict[kam_email] = record

    if skipped_count > 0:
        print(f"⚠️  Skipped {skipped_count} invalid rows")
    if duplicate_count > 0:
        print(f"⚠️  Found {duplicate_count} duplicate emails (kept last occurrence)")
    print(f"✅ Parsed {len(data_dict)} unique valid Items records")
    return list(data_dict.values())


def import_to_supabase(table_name, data):
    """Import data to Supabase using upsert"""
    print(f"\n🚀 Importing {len(data)} records to {table_name}...")

    try:
        # Use UPSERT instead of DELETE + INSERT
        # This handles duplicates automatically
        print(f"📝 Upserting records (insert or update if exists)...")

        batch_size = 50
        success_count = 0

        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]

            # Upsert: insert new records or update existing ones
            result = supabase.table(table_name).upsert(batch).execute()
            success_count += len(batch)
            print(f"   Processed {min(i + batch_size, len(data))}/{len(data)} records...")

        print(f"✅ Successfully imported/updated {success_count} records to {table_name}")
        return True
    except Exception as e:
        print(f"❌ Error importing to {table_name}: {e}")
        return False


def main():
    print("=" * 70)
    print("  PERFORMANCE METRICS IMPORT TO SUPABASE")
    print("=" * 70)

    # Parse all CSVs
    ncn_data = parse_ncn_csv()
    n2r_data = parse_n2r_csv()
    items_data = parse_items_csv()

    # Import to Supabase
    success = True
    success &= import_to_supabase('ncn_summary', ncn_data)
    success &= import_to_supabase('n2r_summary', n2r_data)
    success &= import_to_supabase('items_summary', items_data)

    print("\n" + "=" * 70)
    if success:
        print("  ✅ ALL IMPORTS COMPLETED SUCCESSFULLY")
    else:
        print("  ⚠️  SOME IMPORTS FAILED - CHECK ERRORS ABOVE")
    print("=" * 70)


if __name__ == "__main__":
    main()

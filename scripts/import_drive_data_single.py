"""
Import Drive Data - Single Restaurant Test
==========================================
This script imports data for ONE test restaurant (6503620 - Kanha Veg)
from three CSV files into the drive_sheets_data table.

CSV Sources:
1. drive-data/NCN-codes.csv
2. drive-data/N2R-Codes.csv
3. drive-data/Items-159LL.csv

Usage:
    python scripts/import_drive_data_single.py
"""

import os
import sys
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

# Test restaurant ID
TEST_RES_ID = "6503620"

# CSV file paths
NCN_CSV = "drive-data/NCN-codes.csv"
N2R_CSV = "drive-data/N2R-Codes.csv"
ITEMS_CSV = "drive-data/Items-159LL.csv"


def safe_str(value):
    """
    Convert value to string, handling None, NaN, and empty values.
    Returns empty string for None/NaN instead of "None"/"nan".
    """
    if value is None:
        return ''
    if pd.isna(value):
        return ''
    str_value = str(value).strip()
    if str_value.lower() in ['none', 'nan', 'null', 'n/a', '']:
        return ''
    return str_value


def load_ncn_data(res_id):
    """Load NCN data for specific restaurant."""
    print(f"📂 Loading NCN data for restaurant {res_id}...")
    
    # Read CSV (skip first 2 header rows, use row 3 as column names)
    df = pd.read_csv(NCN_CSV, skiprows=2)
    
    # Filter for our test restaurant
    restaurant = df[df['res_id'].astype(str) == res_id]
    
    if restaurant.empty:
        print(f"   ⚠️  Restaurant {res_id} not found in NCN CSV")
        return {}
    
    row = restaurant.iloc[0]
    
    # Map CSV columns to database columns
    data = {
        'res_id': safe_str(row['res_id']),
        'res_name': safe_str(row['res_name']),
        'am_name': safe_str(row['am_name']),
        'am_email': safe_str(row['AM Email']),
        'tl_email': safe_str(row['TL Email']),
        'cuisine': safe_str(row['Cuisine']),
        'locality': safe_str(row['Locality']),
        'concat_field': safe_str(row['Concat']),
        'toing_check': safe_str(row['Toing Check']),
        'account_type': safe_str(row['account_type']),
        'sept_ov': safe_str(row['Sept OV']),
        'res_orders': safe_str(row['res_orders']),
        
        # Priorities
        'ncn_p1': safe_str(row['P1']),
        'ncn_p2': safe_str(row['P2']),
        'ncn_p3': safe_str(row['P3']),
        'ncn_p4': safe_str(row['P4']),
        'ncn_p5': safe_str(row['P5']),
        'ncn_p6': safe_str(row['P6']),
        
        # LA Metrics
        'ncn_la': safe_str(row['LA']),
        'ncn_la_res_asv': safe_str(row['la_res_asv']),
        'ncn_la_asv_50p': safe_str(row['la_asv_50p']),
        'ncn_la_asv_70p': safe_str(row['la_asv_70p']),
        'ncn_la_asv_90p': safe_str(row['la_asv_90p']),
        'ncn_la_active_promos': safe_str(row['la_active_promos']),
        'ncn_la_remove': safe_str(row['la_remove']),
        'ncn_la_base_code_suggested': safe_str(row['la_base_code_suggested']),
        'ncn_la_step1': safe_str(row['la_step1']),
        'ncn_la_step2': safe_str(row['la_step2']),
        'ncn_la_step3': safe_str(row['la_step3']),
        
        # MM Metrics
        'ncn_mm': safe_str(row['MM']),
        'ncn_mm_res_asvc': safe_str(row['mm_res_asvc']),
        'ncn_mm_asv_50pc': safe_str(row['mm_asv_50pc']),
        'ncn_mm_asv_70pc': safe_str(row['mm_asv_70pc']),
        'ncn_mm_asv_90pc': safe_str(row['mm_asv_90pc']),
        'ncn_mm_active_promos': safe_str(row['mm_active_promos']),
        'ncn_mm_remove': safe_str(row['mm_remove']),
        'ncn_mm_base_code_suggested': safe_str(row['mm_base_code_suggested']),
        'ncn_mm_step1': safe_str(row['mm_step1']),
        'ncn_mm_step2': safe_str(row['mm_step2']),
        'ncn_mm_step3': safe_str(row['mm_step3']),
        
        # UM Metrics
        'ncn_um': safe_str(row['UM']),
        'ncn_um_res_asvc': safe_str(row['um_res_asvc']),
        'ncn_um_asv_50pc': safe_str(row['um_asv_50pc']),
        'ncn_um_asv_70pc': safe_str(row['um_asv_70pc']),
        'ncn_um_asv_90pc': safe_str(row['um_asv_90pc']),
        'ncn_um_active_promos': safe_str(row['um_active_promos']),
        'ncn_um_remove': safe_str(row['um_remove']),
        'ncn_um_base_code_suggested': safe_str(row['um_base_code_suggested']),
        'ncn_um_step1': safe_str(row['um_step1']),
        'ncn_um_step2': safe_str(row['um_step2']),
        'ncn_um_step3': safe_str(row['um_step3']),
        
        # Other NCN fields
        'ncn_mvdo_for_bogo': safe_str(row['MVDO% for BOGO']),
        'ncn_priority': safe_str(row['priority']),
        'ncn_res_cuisine': safe_str(row['Res Cuisine']),
        
        # Dish Tags
        'ncn_dish_tag_1': safe_str(row['Dish Tag Priority 1']),
        'ncn_dish_tag_2': safe_str(row['Dish Tag Priority 2']),
        'ncn_dish_tag_3': safe_str(row['Dish Tag Priority 3']),
        'ncn_dish_tag_4': safe_str(row['Dish Tag Priority 4']),
        'ncn_dish_tag_5': safe_str(row['Dish Tag Priority 5']),
        'ncn_dish_tag_6': safe_str(row['Dish Tag Priority 6']),
        'ncn_dish_tag_7': safe_str(row['Dish Tag Priority 7']),
        
        'ncn_locality_x_cuisine': safe_str(row['Locality X Cuisine']),
        'ncn_approached': safe_str(row['Approached']),
        'ncn_converted_stepper': safe_str(row['Converted for Stepper']),
    }
    
    print(f"   ✅ NCN data loaded: {data['res_name']} ({data['am_email']})")
    return data


def load_n2r_data(res_id):
    """Load N2R data for specific restaurant."""
    print(f"📂 Loading N2R data for restaurant {res_id}...")

    df = pd.read_csv(N2R_CSV)

    # Filter for our test restaurant (res_id is in column D, index 3)
    restaurant = df[df['res_id'].astype(str) == res_id]

    if restaurant.empty:
        print(f"   ⚠️  Restaurant {res_id} not found in N2R CSV")
        return {}

    row = restaurant.iloc[0]

    data = {
        'chain_id': safe_str(row['chain_id']),
        'city_cluster': safe_str(row['city_cluster']),
        'city_name': safe_str(row['city_name']),

        # Order Volumes
        'n2r_la_ov': safe_str(row['LA OV']),
        'n2r_mm_ov': safe_str(row['MM OV']),
        'n2r_um_ov': safe_str(row['UM OV']),

        # LA Current & Suggested
        'n2r_la_current_code': safe_str(row['LA | Current code']),
        'n2r_la_current_aov': safe_str(row['LA | current aov']),
        'n2r_la_suggested_construct': safe_str(row['LA | suggested construct']),
        'n2r_la_suggested_max_amount': safe_str(row['LA | suggested max amount']),
        'n2r_la_suggested_mov': safe_str(row['LA | suggested mov']),

        # MM Current & Suggested
        'n2r_mm_current_code': safe_str(row['MM | Current code']),
        'n2r_mm_current_aov': safe_str(row['MM | current aov']),
        'n2r_mm_suggested_construct': safe_str(row['MM | suggested construct']),
        'n2r_mm_suggested_max_amount': safe_str(row['MM | suggested max amount']),
        'n2r_mm_suggested_mov': safe_str(row['MM | suggested mov']),

        # UM Current & Suggested
        'n2r_um_current_code': safe_str(row['UM | Current code']),
        'n2r_um_current_aov': safe_str(row['UM | current aov']),
        'n2r_um_suggested_construct': safe_str(row['UM | suggested construct']),
        'n2r_um_suggested_max_amount': safe_str(row['UM | suggested max amount']),
        'n2r_um_suggested_mov': safe_str(row['UM | suggested mov']),

        # Minimum Coupons
        'n2r_la_min_coupons': safe_str(row['LA | minimum daily coupons required']),
        'n2r_mm_min_coupons': safe_str(row['MM | minimum daily coupons required']),
        'n2r_um_min_coupons': safe_str(row['UM | minimum daily coupons required']),

        # Approached
        'n2r_approached': safe_str(row['Approached']),
    }

    print(f"   ✅ N2R data loaded: LA AOV={data['n2r_la_current_aov']}, MM AOV={data['n2r_mm_current_aov']}")
    return data


def load_items_data(res_id):
    """Load Items data for specific restaurant."""
    print(f"📂 Loading Items data for restaurant {res_id}...")

    df = pd.read_csv(ITEMS_CSV)

    # Filter for our test restaurant
    restaurant = df[df['Res ID'].astype(str) == res_id]

    if restaurant.empty:
        print(f"   ⚠️  Restaurant {res_id} not found in Items CSV")
        return {}

    row = restaurant.iloc[0]

    data = {
        'subzone_name': safe_str(row['subzone_name']),

        # Priority & Flags
        'items_priority': safe_str(row['priority']),
        'items_pg_7_10_contribution': safe_str(row['PG 7-10 OV Contribution']),
        'items_locality_pg_7_10_pct': safe_str(row['Locality PG 7-10 OV Contribution %']),
        'items_pg_7_10_higher_flag': safe_str(row['PG 7-10 OV Higher Flag']),
        'items_pos_flag': safe_str(row['POS FLag']),
        'items_res_cuisine': safe_str(row['Res Cuisine']),

        # Dish Tags
        'items_dish_tag_1': safe_str(row['Dish Tag Priority 1']),
        'items_dish_tag_2': safe_str(row['Dish Tag Priority 2']),
        'items_dish_tag_3': safe_str(row['Dish Tag Priority 3']),
        'items_dish_tag_4': safe_str(row['Dish Tag Priority 4']),
        'items_dish_tag_5': safe_str(row['Dish Tag Priority 5']),
        'items_dish_tag_6': safe_str(row['Dish Tag Priority 6']),
        'items_dish_tag_7': safe_str(row['Dish Tag Priority 7']),

        'items_locality_x_cuisine': safe_str(row['Locality X Cuisine']),

        # Conversion
        'items_approached': safe_str(row['Approached']),
        'items_converted': safe_str(row['Converted']),
        'items_dish_added': safe_str(row['Dish Added <159 in the menu']),
        'items_no_items_added': safe_str(row['No of Items Added']),
    }

    print(f"   ✅ Items data loaded: Priority={data['items_priority']}, POS={data['items_pos_flag']}")
    return data


def merge_data(ncn_data, n2r_data, items_data):
    """Merge data from all three sources."""
    print("🔄 Merging data from all sources...")

    # Start with NCN data (has most complete basic info)
    merged = ncn_data.copy()

    # Add N2R data
    merged.update(n2r_data)

    # Add Items data
    merged.update(items_data)

    # Ensure res_id and am_email are present
    if not merged.get('res_id'):
        raise ValueError("Missing res_id in merged data")
    if not merged.get('am_email'):
        raise ValueError("Missing am_email in merged data")

    print(f"   ✅ Merged data: {len(merged)} fields")
    return merged


def upload_to_supabase(data):
    """Upload data to Supabase."""
    print("📤 Uploading to Supabase...")

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Missing Supabase credentials. Check .env file.")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    try:
        # Upsert (insert or update if exists)
        result = supabase.table('drive_sheets_data').upsert(data).execute()

        print(f"   ✅ Upload successful!")
        print(f"   📊 Restaurant: {data['res_name']} ({data['res_id']})")
        print(f"   👤 KAM: {data['am_email']}")

        return result

    except Exception as e:
        print(f"   ❌ Upload failed: {str(e)}")
        raise


def main():
    """Main execution function."""
    print("=" * 60)
    print("🚀 Drive Data Import - Single Restaurant Test")
    print("=" * 60)
    print(f"Test Restaurant ID: {TEST_RES_ID}")
    print(f"Test Restaurant: Kanha Veg")
    print(f"KAM Email: gupta.ansh@zomato.com")
    print("=" * 60)
    print()

    try:
        # Load data from each CSV
        ncn_data = load_ncn_data(TEST_RES_ID)
        n2r_data = load_n2r_data(TEST_RES_ID)
        items_data = load_items_data(TEST_RES_ID)

        # Check if we have at least some data
        if not ncn_data and not n2r_data and not items_data:
            print("❌ No data found for this restaurant in any CSV file!")
            sys.exit(1)

        # Merge all data
        merged_data = merge_data(ncn_data, n2r_data, items_data)

        # Upload to Supabase
        upload_to_supabase(merged_data)

        print()
        print("=" * 60)
        print("✅ IMPORT COMPLETE!")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Verify data in Supabase dashboard")
        print("2. Test frontend display")
        print("3. If successful, import all restaurants")
        print()

    except Exception as e:
        print()
        print("=" * 60)
        print(f"❌ ERROR: {str(e)}")
        print("=" * 60)
        sys.exit(1)


if __name__ == "__main__":
    main()


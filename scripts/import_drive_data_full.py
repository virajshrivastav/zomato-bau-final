"""
Import Drive Data - Full Dataset (Sprint 2)
============================================
This script imports ALL 6,625 restaurants following the clean data strategy:

PHASE 1: Import base restaurants from kam-data.txt (SOURCE OF TRUTH)
PHASE 2: Enrich with NCN data (UPDATE only)
PHASE 3: Enrich with N2R data (UPDATE only)
PHASE 4: Enrich with Items data (UPDATE only)

CSV Sources:
1. archive/data/kam-data.txt - 6,625 restaurants (base layer)
2. data/drives/NCN-codes.csv - ~5,541 restaurants (enrichment)
3. data/drives/N2R-Codes.csv - ~5,668 restaurants (enrichment)
4. data/drives/Items-159LL.csv - ~1,909 restaurants (enrichment)

Output:
- insert_base_restaurants.sql
- update_ncn_fields.sql
- update_n2r_fields.sql
- update_items_fields.sql
- verify_import.sql

Usage:
    python scripts/import_drive_data_full.py
    
    # For testing with limited rows:
    python scripts/import_drive_data_full.py --limit 100
"""

import os
import sys
import pandas as pd
import argparse
from datetime import datetime

# File paths
KAM_DATA_FILE = "archive/data/kam-data.txt"
NCN_CSV = "data/drives/NCN-codes.csv"
N2R_CSV = "data/drives/N2R-Codes.csv"
ITEMS_CSV = "data/drives/Items-159LL.csv"

# Output SQL files
OUTPUT_DIR = "."
BASE_SQL = os.path.join(OUTPUT_DIR, "insert_base_restaurants.sql")
NCN_SQL = os.path.join(OUTPUT_DIR, "update_ncn_fields.sql")
N2R_SQL = os.path.join(OUTPUT_DIR, "update_n2r_fields.sql")
ITEMS_SQL = os.path.join(OUTPUT_DIR, "update_items_fields.sql")
VERIFY_SQL = os.path.join(OUTPUT_DIR, "verify_import.sql")

# Logging
warnings_log = []


def safe_str(value):
    """
    Convert value to string, handling None, NaN, and empty values.
    Returns 'NULL' for database insertion.
    """
    if value is None:
        return 'NULL'
    if pd.isna(value):
        return 'NULL'
    str_value = str(value).strip()
    if str_value.lower() in ['none', 'nan', 'null', 'n/a', '']:
        return 'NULL'
    return str_value


def escape_sql(value):
    """Escape single quotes for SQL and wrap in quotes if not NULL."""
    if value == 'NULL':
        return 'NULL'
    # Escape single quotes by doubling them
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def format_base_code(value):
    """
    Format base codes from '40 upto 80' to '40% upto 80rs' format.
    Handles LA, MM, and UM base codes.
    """
    if value == 'NULL' or not value:
        return 'NULL'
    
    str_value = str(value).strip()
    
    # Check if already formatted (contains '%' and 'rs')
    if '%' in str_value and 'rs' in str_value.lower():
        return str_value
    
    # Pattern: "40 upto 80" -> "40% upto 80rs"
    if 'upto' in str_value.lower():
        parts = str_value.split()
        if len(parts) >= 3:
            # parts[0] is the percentage, parts[2] is the amount
            return f"{parts[0]}% upto {parts[2]}rs"
    
    # Return as-is if pattern doesn't match
    return str_value


def log_warning(message):
    """Log a warning message."""
    warnings_log.append(message)
    print(f"⚠️  {message}")


def print_header(title):
    """Print a formatted section header."""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


# ============================================================================
# PHASE 1: Load and Insert Base Restaurants from kam-data.txt
# ============================================================================

def load_kam_data(limit=None):
    """
    Load base restaurant data from kam-data.txt.
    This is the SOURCE OF TRUTH for restaurant list and KAM assignments.

    Args:
        limit: Optional limit for testing (e.g., 100 for first 100 restaurants)

    Returns:
        dict: {res_id: {res_name, am_email, tl_email, ...}}
    """
    print_header("PHASE 1: Loading Base Restaurants from kam-data.txt")
    print(f"📂 Reading file: {KAM_DATA_FILE}")

    df = pd.read_csv(KAM_DATA_FILE)

    if limit:
        df = df.head(limit)
        print(f"⚠️  TESTING MODE: Limited to first {limit} restaurants")

    kam_mapping = {}

    for idx, row in df.iterrows():
        res_id = safe_str(row['res_id'])

        if res_id == 'NULL':
            log_warning(f"Row {idx+2}: Missing res_id, skipping")
            continue

        kam_mapping[res_id] = {
            'res_id': res_id,
            'res_name': safe_str(row['res_name']),
            'am_email': safe_str(row['am_email']),
            'tl_email': safe_str(row['tl_email']),
            'subzone_name': safe_str(row['subzone_name']),
            'city_cluster': safe_str(row['Zone']),
            'sept_ov': safe_str(row['oct_ov']),  # Use oct_ov as sept_ov
        }

        # Validate critical fields
        if kam_mapping[res_id]['am_email'] == 'NULL':
            log_warning(f"Restaurant {res_id}: Missing am_email")

    print(f"✅ Loaded {len(kam_mapping)} restaurants from kam-data.txt")
    return kam_mapping


def generate_base_insert_sql(kam_mapping):
    """
    Generate SQL INSERT statements for base restaurants.
    All drive fields will be NULL initially.

    Args:
        kam_mapping: dict from load_kam_data()

    Returns:
        int: Number of SQL statements generated
    """
    print(f"\n📝 Generating SQL INSERT statements...")

    sql_statements = []

    # Add header comment
    sql_statements.append("-- ============================================")
    sql_statements.append("-- Base Restaurants Import (from kam-data.txt)")
    sql_statements.append(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total restaurants: {len(kam_mapping)}")
    sql_statements.append("-- ============================================\n")

    for res_id, data in kam_mapping.items():
        sql = f"""INSERT INTO drive_sheets_data
(res_id, res_name, am_email, tl_email, subzone_name, city_cluster, sept_ov)
VALUES (
    {escape_sql(data['res_id'])},
    {escape_sql(data['res_name'])},
    {escape_sql(data['am_email'])},
    {escape_sql(data['tl_email'])},
    {escape_sql(data['subzone_name'])},
    {escape_sql(data['city_cluster'])},
    {escape_sql(data['sept_ov'])}
)
ON CONFLICT (res_id) DO NOTHING;
"""
        sql_statements.append(sql)

    # Write to file
    with open(BASE_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))

    print(f"✅ Generated {len(kam_mapping)} INSERT statements")
    print(f"📄 SQL saved to: {BASE_SQL}")

    return len(kam_mapping)


# ============================================================================
# PHASE 2: Load and Update NCN Data
# ============================================================================

def load_ncn_data(kam_mapping):
    """
    Load NCN drive data.
    Only process restaurants that exist in kam_mapping (validation).

    Args:
        kam_mapping: dict from load_kam_data() (for validation)

    Returns:
        dict: {res_id: {ncn_p1, ncn_p2, ...}}
    """
    print_header("PHASE 2: Loading NCN Drive Data")
    print(f"📂 Reading file: {NCN_CSV}")

    # Read CSV (skip first 2 header rows, use row 3 as column names)
    df = pd.read_csv(NCN_CSV, skiprows=2)

    ncn_data = {}
    skipped = 0
    email_mismatches = 0

    for idx, row in df.iterrows():
        res_id = safe_str(row['res_id'])

        if res_id == 'NULL':
            continue

        # CRITICAL: Only process if restaurant exists in kam-data
        if res_id not in kam_mapping:
            skipped += 1
            if skipped <= 5:  # Only log first 5
                log_warning(f"NCN: Restaurant {res_id} not in kam-data.txt, skipping")
            continue

        # Check for email mismatch
        kam_email = kam_mapping[res_id]['am_email']
        ncn_email = safe_str(row['AM Email'])
        if kam_email != ncn_email and kam_email != 'NULL' and ncn_email != 'NULL':
            email_mismatches += 1
            if email_mismatches <= 5:  # Only log first 5
                log_warning(f"NCN: Email mismatch for {res_id}: kam-data={kam_email}, ncn={ncn_email}")

        # Extract and format base codes
        la_base = format_base_code(safe_str(row['la_base_code_suggested']))
        mm_base = format_base_code(safe_str(row['mm_base_code_suggested']))
        um_base = format_base_code(safe_str(row['um_base_code_suggested']))

        ncn_data[res_id] = {
            'res_id': res_id,
            # Basic Info (from NCN CSV)
            'cuisine': safe_str(row['Cuisine']),
            'locality': safe_str(row['Locality']),

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
            'ncn_la_base_code_suggested': la_base,
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
            'ncn_mm_base_code_suggested': mm_base,
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
            'ncn_um_base_code_suggested': um_base,
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

    print(f"✅ Loaded NCN data for {len(ncn_data)} restaurants")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped} restaurants not in kam-data.txt")
    if email_mismatches > 0:
        print(f"⚠️  Found {email_mismatches} email mismatches (using kam-data.txt email)")

    return ncn_data


def generate_ncn_update_sql(ncn_data):
    """
    Generate SQL UPDATE statements for NCN fields.

    Args:
        ncn_data: dict from load_ncn_data()

    Returns:
        int: Number of SQL statements generated
    """
    print(f"\n📝 Generating NCN UPDATE statements...")

    sql_statements = []

    # Add header comment
    sql_statements.append("-- ============================================")
    sql_statements.append("-- NCN Data Updates")
    sql_statements.append(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total updates: {len(ncn_data)}")
    sql_statements.append("-- ============================================\n")

    for res_id, data in ncn_data.items():
        sql = f"""UPDATE drive_sheets_data
SET
    cuisine = {escape_sql(data['cuisine'])},
    locality = {escape_sql(data['locality'])},
    ncn_p1 = {escape_sql(data['ncn_p1'])},
    ncn_p2 = {escape_sql(data['ncn_p2'])},
    ncn_p3 = {escape_sql(data['ncn_p3'])},
    ncn_p4 = {escape_sql(data['ncn_p4'])},
    ncn_p5 = {escape_sql(data['ncn_p5'])},
    ncn_p6 = {escape_sql(data['ncn_p6'])},
    ncn_la = {escape_sql(data['ncn_la'])},
    ncn_la_res_asv = {escape_sql(data['ncn_la_res_asv'])},
    ncn_la_asv_50p = {escape_sql(data['ncn_la_asv_50p'])},
    ncn_la_asv_70p = {escape_sql(data['ncn_la_asv_70p'])},
    ncn_la_asv_90p = {escape_sql(data['ncn_la_asv_90p'])},
    ncn_la_active_promos = {escape_sql(data['ncn_la_active_promos'])},
    ncn_la_remove = {escape_sql(data['ncn_la_remove'])},
    ncn_la_base_code_suggested = {escape_sql(data['ncn_la_base_code_suggested'])},
    ncn_la_step1 = {escape_sql(data['ncn_la_step1'])},
    ncn_la_step2 = {escape_sql(data['ncn_la_step2'])},
    ncn_la_step3 = {escape_sql(data['ncn_la_step3'])},
    ncn_mm = {escape_sql(data['ncn_mm'])},
    ncn_mm_res_asvc = {escape_sql(data['ncn_mm_res_asvc'])},
    ncn_mm_asv_50pc = {escape_sql(data['ncn_mm_asv_50pc'])},
    ncn_mm_asv_70pc = {escape_sql(data['ncn_mm_asv_70pc'])},
    ncn_mm_asv_90pc = {escape_sql(data['ncn_mm_asv_90pc'])},
    ncn_mm_active_promos = {escape_sql(data['ncn_mm_active_promos'])},
    ncn_mm_remove = {escape_sql(data['ncn_mm_remove'])},
    ncn_mm_base_code_suggested = {escape_sql(data['ncn_mm_base_code_suggested'])},
    ncn_mm_step1 = {escape_sql(data['ncn_mm_step1'])},
    ncn_mm_step2 = {escape_sql(data['ncn_mm_step2'])},
    ncn_mm_step3 = {escape_sql(data['ncn_mm_step3'])},
    ncn_um = {escape_sql(data['ncn_um'])},
    ncn_um_res_asvc = {escape_sql(data['ncn_um_res_asvc'])},
    ncn_um_asv_50pc = {escape_sql(data['ncn_um_asv_50pc'])},
    ncn_um_asv_70pc = {escape_sql(data['ncn_um_asv_70pc'])},
    ncn_um_asv_90pc = {escape_sql(data['ncn_um_asv_90pc'])},
    ncn_um_active_promos = {escape_sql(data['ncn_um_active_promos'])},
    ncn_um_remove = {escape_sql(data['ncn_um_remove'])},
    ncn_um_base_code_suggested = {escape_sql(data['ncn_um_base_code_suggested'])},
    ncn_um_step1 = {escape_sql(data['ncn_um_step1'])},
    ncn_um_step2 = {escape_sql(data['ncn_um_step2'])},
    ncn_um_step3 = {escape_sql(data['ncn_um_step3'])},
    ncn_mvdo_for_bogo = {escape_sql(data['ncn_mvdo_for_bogo'])},
    ncn_priority = {escape_sql(data['ncn_priority'])},
    ncn_res_cuisine = {escape_sql(data['ncn_res_cuisine'])},
    ncn_dish_tag_1 = {escape_sql(data['ncn_dish_tag_1'])},
    ncn_dish_tag_2 = {escape_sql(data['ncn_dish_tag_2'])},
    ncn_dish_tag_3 = {escape_sql(data['ncn_dish_tag_3'])},
    ncn_dish_tag_4 = {escape_sql(data['ncn_dish_tag_4'])},
    ncn_dish_tag_5 = {escape_sql(data['ncn_dish_tag_5'])},
    ncn_dish_tag_6 = {escape_sql(data['ncn_dish_tag_6'])},
    ncn_dish_tag_7 = {escape_sql(data['ncn_dish_tag_7'])},
    ncn_locality_x_cuisine = {escape_sql(data['ncn_locality_x_cuisine'])},
    ncn_approached = {escape_sql(data['ncn_approached'])},
    ncn_converted_stepper = {escape_sql(data['ncn_converted_stepper'])}
WHERE res_id = {escape_sql(res_id)};
"""
        sql_statements.append(sql)

    # Write to file
    with open(NCN_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))

    print(f"✅ Generated {len(ncn_data)} UPDATE statements")
    print(f"📄 SQL saved to: {NCN_SQL}")

    return len(ncn_data)


# ============================================================================
# PHASE 3: Load and Update N2R Data
# ============================================================================

def load_n2r_data(kam_mapping):
    """Load N2R drive data (similar to NCN)."""
    print_header("PHASE 3: Loading N2R Drive Data")
    print(f"📂 Reading file: {N2R_CSV}")

    df = pd.read_csv(N2R_CSV)

    n2r_data = {}
    skipped = 0

    for idx, row in df.iterrows():
        res_id = safe_str(row['res_id'])

        if res_id == 'NULL':
            continue

        # Only process if restaurant exists in kam-data
        if res_id not in kam_mapping:
            skipped += 1
            if skipped <= 5:
                log_warning(f"N2R: Restaurant {res_id} not in kam-data.txt, skipping")
            continue

        # Format base codes
        la_code = format_base_code(safe_str(row['LA | Current code']))
        mm_code = format_base_code(safe_str(row['MM | Current code']))
        um_code = format_base_code(safe_str(row['UM | Current code']))

        n2r_data[res_id] = {
            'res_id': res_id,
            'n2r_la_ov': safe_str(row['LA OV']),
            'n2r_mm_ov': safe_str(row['MM OV']),
            'n2r_um_ov': safe_str(row['UM OV']),
            'n2r_la_current_code': la_code,
            'n2r_la_current_aov': safe_str(row['LA | current aov']),
            'n2r_la_suggested_construct': safe_str(row['LA | suggested construct']),
            'n2r_la_suggested_max_amount': safe_str(row['LA | suggested max amount']),
            'n2r_la_suggested_mov': safe_str(row['LA | suggested mov']),
            'n2r_mm_current_code': mm_code,
            'n2r_mm_current_aov': safe_str(row['MM | current aov']),
            'n2r_mm_suggested_construct': safe_str(row['MM | suggested construct']),
            'n2r_mm_suggested_max_amount': safe_str(row['MM | suggested max amount']),
            'n2r_mm_suggested_mov': safe_str(row['MM | suggested mov']),
            'n2r_um_current_code': um_code,
            'n2r_um_current_aov': safe_str(row['UM | current aov']),
            'n2r_um_suggested_construct': safe_str(row['UM | suggested construct']),
            'n2r_um_suggested_max_amount': safe_str(row['UM | suggested max amount']),
            'n2r_um_suggested_mov': safe_str(row['UM | suggested mov']),
            'n2r_la_min_coupons': safe_str(row['LA | minimum daily coupons required']),
            'n2r_mm_min_coupons': safe_str(row['MM | minimum daily coupons required']),
            'n2r_um_min_coupons': safe_str(row['UM | minimum daily coupons required']),
            'n2r_approached': safe_str(row['Approached']),
        }

    print(f"✅ Loaded N2R data for {len(n2r_data)} restaurants")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped} restaurants not in kam-data.txt")

    return n2r_data


def generate_n2r_update_sql(n2r_data):
    """Generate SQL UPDATE statements for N2R fields."""
    print(f"\n📝 Generating N2R UPDATE statements...")

    sql_statements = []
    sql_statements.append("-- ============================================")
    sql_statements.append("-- N2R Data Updates")
    sql_statements.append(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total updates: {len(n2r_data)}")
    sql_statements.append("-- ============================================\n")

    for res_id, data in n2r_data.items():
        sql = f"""UPDATE drive_sheets_data
SET
    n2r_la_ov = {escape_sql(data['n2r_la_ov'])},
    n2r_mm_ov = {escape_sql(data['n2r_mm_ov'])},
    n2r_um_ov = {escape_sql(data['n2r_um_ov'])},
    n2r_la_current_code = {escape_sql(data['n2r_la_current_code'])},
    n2r_la_current_aov = {escape_sql(data['n2r_la_current_aov'])},
    n2r_la_suggested_construct = {escape_sql(data['n2r_la_suggested_construct'])},
    n2r_la_suggested_max_amount = {escape_sql(data['n2r_la_suggested_max_amount'])},
    n2r_la_suggested_mov = {escape_sql(data['n2r_la_suggested_mov'])},
    n2r_mm_current_code = {escape_sql(data['n2r_mm_current_code'])},
    n2r_mm_current_aov = {escape_sql(data['n2r_mm_current_aov'])},
    n2r_mm_suggested_construct = {escape_sql(data['n2r_mm_suggested_construct'])},
    n2r_mm_suggested_max_amount = {escape_sql(data['n2r_mm_suggested_max_amount'])},
    n2r_mm_suggested_mov = {escape_sql(data['n2r_mm_suggested_mov'])},
    n2r_um_current_code = {escape_sql(data['n2r_um_current_code'])},
    n2r_um_current_aov = {escape_sql(data['n2r_um_current_aov'])},
    n2r_um_suggested_construct = {escape_sql(data['n2r_um_suggested_construct'])},
    n2r_um_suggested_max_amount = {escape_sql(data['n2r_um_suggested_max_amount'])},
    n2r_um_suggested_mov = {escape_sql(data['n2r_um_suggested_mov'])},
    n2r_la_min_coupons = {escape_sql(data['n2r_la_min_coupons'])},
    n2r_mm_min_coupons = {escape_sql(data['n2r_mm_min_coupons'])},
    n2r_um_min_coupons = {escape_sql(data['n2r_um_min_coupons'])},
    n2r_approached = {escape_sql(data['n2r_approached'])}
WHERE res_id = {escape_sql(res_id)};
"""
        sql_statements.append(sql)

    with open(N2R_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))

    print(f"✅ Generated {len(n2r_data)} UPDATE statements")
    print(f"📄 SQL saved to: {N2R_SQL}")

    return len(n2r_data)


# ============================================================================
# PHASE 4: Load and Update Items Data
# ============================================================================

def load_items_data(kam_mapping):
    """Load Items drive data (similar to NCN and N2R)."""
    print_header("PHASE 4: Loading Items Drive Data")
    print(f"📂 Reading file: {ITEMS_CSV}")

    df = pd.read_csv(ITEMS_CSV)

    items_data = {}
    skipped = 0

    for idx, row in df.iterrows():
        res_id = safe_str(row['Res ID'])

        if res_id == 'NULL':
            continue

        # Only process if restaurant exists in kam-data
        if res_id not in kam_mapping:
            skipped += 1
            if skipped <= 5:
                log_warning(f"Items: Restaurant {res_id} not in kam-data.txt, skipping")
            continue

        items_data[res_id] = {
            'res_id': res_id,
            'items_priority': safe_str(row['priority']),
            'items_pg_7_10_contribution': safe_str(row['PG 7-10 OV Contribution']),
            'items_locality_pg_7_10_pct': safe_str(row['Locality PG 7-10 OV Contribution %']),
            'items_pg_7_10_higher_flag': safe_str(row['PG 7-10 OV Higher Flag']),
            'items_pos_flag': safe_str(row['POS FLag']),
            'items_res_cuisine': safe_str(row['Res Cuisine']),
            'items_dish_tag_1': safe_str(row['Dish Tag Priority 1']),
            'items_dish_tag_2': safe_str(row['Dish Tag Priority 2']),
            'items_dish_tag_3': safe_str(row['Dish Tag Priority 3']),
            'items_dish_tag_4': safe_str(row['Dish Tag Priority 4']),
            'items_dish_tag_5': safe_str(row['Dish Tag Priority 5']),
            'items_dish_tag_6': safe_str(row['Dish Tag Priority 6']),
            'items_dish_tag_7': safe_str(row['Dish Tag Priority 7']),
            'items_locality_x_cuisine': safe_str(row['Locality X Cuisine']),
            'items_approached': safe_str(row['Approached']),
            'items_converted': safe_str(row['Converted']),
            'items_dish_added': safe_str(row['Dish Added <159 in the menu']),
            'items_no_items_added': safe_str(row['No of Items Added']),
        }

    print(f"✅ Loaded Items data for {len(items_data)} restaurants")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped} restaurants not in kam-data.txt")

    return items_data


def generate_items_update_sql(items_data):
    """Generate SQL UPDATE statements for Items fields."""
    print(f"\n📝 Generating Items UPDATE statements...")

    sql_statements = []
    sql_statements.append("-- ============================================")
    sql_statements.append("-- Items Data Updates")
    sql_statements.append(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total updates: {len(items_data)}")
    sql_statements.append("-- ============================================\n")

    for res_id, data in items_data.items():
        sql = f"""UPDATE drive_sheets_data
SET
    items_priority = {escape_sql(data['items_priority'])},
    items_pg_7_10_contribution = {escape_sql(data['items_pg_7_10_contribution'])},
    items_locality_pg_7_10_pct = {escape_sql(data['items_locality_pg_7_10_pct'])},
    items_pg_7_10_higher_flag = {escape_sql(data['items_pg_7_10_higher_flag'])},
    items_pos_flag = {escape_sql(data['items_pos_flag'])},
    items_res_cuisine = {escape_sql(data['items_res_cuisine'])},
    items_dish_tag_1 = {escape_sql(data['items_dish_tag_1'])},
    items_dish_tag_2 = {escape_sql(data['items_dish_tag_2'])},
    items_dish_tag_3 = {escape_sql(data['items_dish_tag_3'])},
    items_dish_tag_4 = {escape_sql(data['items_dish_tag_4'])},
    items_dish_tag_5 = {escape_sql(data['items_dish_tag_5'])},
    items_dish_tag_6 = {escape_sql(data['items_dish_tag_6'])},
    items_dish_tag_7 = {escape_sql(data['items_dish_tag_7'])},
    items_locality_x_cuisine = {escape_sql(data['items_locality_x_cuisine'])},
    items_approached = {escape_sql(data['items_approached'])},
    items_converted = {escape_sql(data['items_converted'])},
    items_dish_added = {escape_sql(data['items_dish_added'])},
    items_no_items_added = {escape_sql(data['items_no_items_added'])}
WHERE res_id = {escape_sql(res_id)};
"""
        sql_statements.append(sql)

    with open(ITEMS_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))

    print(f"✅ Generated {len(items_data)} UPDATE statements")
    print(f"📄 SQL saved to: {ITEMS_SQL}")

    return len(items_data)


# ============================================================================
# Verification SQL Generation
# ============================================================================

def generate_verification_sql():
    """Generate SQL queries to verify the import."""
    print_header("Generating Verification SQL")

    verification_sql = f"""-- ============================================
-- Data Import Verification Queries
-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- ============================================

-- Check 1: Total restaurant count
-- Expected: 6,625 (from kam-data.txt)
SELECT COUNT(*) as total_restaurants FROM drive_sheets_data;

-- Check 2: All restaurants have KAM assignment
-- Expected: 0 (all should have am_email)
SELECT COUNT(*) as missing_kam FROM drive_sheets_data WHERE am_email IS NULL;

-- Check 3: Drive participation distribution
-- Shows how many restaurants have 0, 1, 2, or 3 active drives
SELECT
    (CASE WHEN ncn_p1 IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN n2r_la_current_code IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN items_priority IS NOT NULL THEN 1 ELSE 0 END) as active_drives,
    COUNT(*) as restaurant_count
FROM drive_sheets_data
GROUP BY active_drives
ORDER BY active_drives;

-- Check 4: NCN data count
-- Expected: ~5,541
SELECT COUNT(*) as ncn_restaurants FROM drive_sheets_data WHERE ncn_p1 IS NOT NULL;

-- Check 5: N2R data count
-- Expected: ~5,668
SELECT COUNT(*) as n2r_restaurants FROM drive_sheets_data WHERE n2r_la_current_code IS NOT NULL;

-- Check 6: Items data count
-- Expected: ~1,909
SELECT COUNT(*) as items_restaurants FROM drive_sheets_data WHERE items_priority IS NOT NULL;

-- Check 7: KAM distribution
-- Shows restaurant count per KAM
SELECT
    am_email,
    COUNT(*) as total_restaurants,
    SUM(CASE WHEN ncn_p1 IS NOT NULL THEN 1 ELSE 0 END) as ncn_count,
    SUM(CASE WHEN n2r_la_current_code IS NOT NULL THEN 1 ELSE 0 END) as n2r_count,
    SUM(CASE WHEN items_priority IS NOT NULL THEN 1 ELSE 0 END) as items_count
FROM drive_sheets_data
GROUP BY am_email
ORDER BY total_restaurants DESC
LIMIT 20;

-- Check 8: Sample restaurant with all 3 drives
SELECT res_id, res_name, am_email, ncn_p1, n2r_la_current_code, items_priority
FROM drive_sheets_data
WHERE ncn_p1 IS NOT NULL
  AND n2r_la_current_code IS NOT NULL
  AND items_priority IS NOT NULL
LIMIT 5;

-- Check 9: Sample restaurant with 0 drives
SELECT res_id, res_name, am_email, ncn_p1, n2r_la_current_code, items_priority
FROM drive_sheets_data
WHERE ncn_p1 IS NULL
  AND n2r_la_current_code IS NULL
  AND items_priority IS NULL
LIMIT 5;

-- Check 10: Base code formatting check (NCN)
-- Verify base codes are formatted as "40% upto 80rs"
SELECT res_id, res_name,
    ncn_la_base_code_suggested as la_base,
    ncn_mm_base_code_suggested as mm_base,
    ncn_um_base_code_suggested as um_base
FROM drive_sheets_data
WHERE ncn_p1 IS NOT NULL
LIMIT 10;
"""

    with open(VERIFY_SQL, 'w', encoding='utf-8') as f:
        f.write(verification_sql)

    print(f"✅ Verification SQL generated")
    print(f"📄 SQL saved to: {VERIFY_SQL}")


# ============================================================================
# Main Execution
# ============================================================================

def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description='Import full drive data for Sprint 2')
    parser.add_argument('--limit', type=int, help='Limit number of restaurants (for testing)')
    args = parser.parse_args()

    print("=" * 70)
    print("  🚀 SPRINT 2: FULL DATA IMPORT")
    print("=" * 70)
    print(f"  Strategy: Clean Data Import (kam-data.txt first)")
    print(f"  Total Expected: 6,625 restaurants")
    if args.limit:
        print(f"  ⚠️  TESTING MODE: Limited to {args.limit} restaurants")
    print("=" * 70)

    try:
        # PHASE 1: Load and insert base restaurants
        kam_mapping = load_kam_data(limit=args.limit)
        base_count = generate_base_insert_sql(kam_mapping)

        # PHASE 2: Load and update NCN data
        ncn_data = load_ncn_data(kam_mapping)
        ncn_count = generate_ncn_update_sql(ncn_data)

        # PHASE 3: Load and update N2R data
        n2r_data = load_n2r_data(kam_mapping)
        n2r_count = generate_n2r_update_sql(n2r_data)

        # PHASE 4: Load and update Items data
        items_data = load_items_data(kam_mapping)
        items_count = generate_items_update_sql(items_data)

        # Generate verification SQL
        generate_verification_sql()

        # Summary
        print_header("✅ IMPORT SCRIPT COMPLETE")
        print(f"\n📊 Summary:")
        print(f"  Base restaurants:  {base_count:,}")
        print(f"  NCN enriched:      {ncn_count:,}")
        print(f"  N2R enriched:      {n2r_count:,}")
        print(f"  Items enriched:    {items_count:,}")

        if warnings_log:
            print(f"\n⚠️  Warnings: {len(warnings_log)}")
            print(f"  (First few shown above, check logs for all)")

        print(f"\n📄 Generated SQL Files:")
        print(f"  1. {BASE_SQL}")
        print(f"  2. {NCN_SQL}")
        print(f"  3. {N2R_SQL}")
        print(f"  4. {ITEMS_SQL}")
        print(f"  5. {VERIFY_SQL}")

        print(f"\n🎯 Next Steps:")
        print(f"  1. Open Supabase SQL Editor")
        print(f"  2. Execute SQL files IN ORDER:")
        print(f"     a) {BASE_SQL}")
        print(f"     b) {NCN_SQL}")
        print(f"     c) {N2R_SQL}")
        print(f"     d) {ITEMS_SQL}")
        print(f"  3. Run verification: {VERIFY_SQL}")
        print(f"  4. Check results match expected counts")
        print("=" * 70)

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()



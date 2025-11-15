"""
Import Performance Metrics Data
================================
This script imports KAM performance metrics from 3 CSV files into Supabase.

CSV Sources:
1. NCN Coverage Summary.csv - 129 KAMs (NCN drive metrics)
2. N2R Summary.csv - 61 KAMs (N2R drive metrics)
3. Input Summary.csv - 62 KAMs (Items drive metrics)

Output:
- sql_output/insert_ncn_summary.sql
- sql_output/insert_n2r_summary.sql
- sql_output/insert_items_summary.sql

Usage:
    python scripts/import_performance_metrics.py
"""

import os
import sys
import pandas as pd
from datetime import datetime

# File paths
NCN_CSV = "performance-metrics/Dashboard Context data Drives - NCN Coverage Summary .csv"
N2R_CSV = "performance-metrics/Dashboard Context data Drives - N2R Summary.csv"
ITEMS_CSV = "performance-metrics/Dashboard Context data Drives - Input Summary.csv"

# Output directory
OUTPUT_DIR = "sql_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Output SQL files
NCN_SQL = os.path.join(OUTPUT_DIR, "insert_ncn_summary.sql")
N2R_SQL = os.path.join(OUTPUT_DIR, "insert_n2r_summary.sql")
ITEMS_SQL = os.path.join(OUTPUT_DIR, "insert_items_summary.sql")


def safe_str(value):
    """Convert value to string, handling None, NaN, and empty values."""
    if value is None or pd.isna(value):
        return 'NULL'
    str_value = str(value).strip()
    if str_value.lower() in ['none', 'nan', 'null', 'n/a', '']:
        return 'NULL'
    return str_value


def escape_sql(value):
    """Escape single quotes for SQL and wrap in quotes if not NULL."""
    if value == 'NULL':
        return 'NULL'
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def parse_ncn_csv():
    """Parse NCN Coverage Summary CSV"""
    print("📖 Reading NCN CSV...")
    
    # Read CSV, skipping first 2 header rows
    df = pd.read_csv(NCN_CSV, skiprows=2, encoding='utf-8')
    
    # Column mapping (0-based index after skipping 2 rows)
    # Row 3 (index 0 after skip) has: KAM, TL, Team, LA Base, MM Base, UM Base, LA, MM, UM, Delta LA, Delta MM, Delta UM, ..., Flash, BOGO, Overall OV, Overall Res, ..., GET150, TAKE150, BINGE150
    
    data = []
    for _, row in df.iterrows():
        kam_email = safe_str(row.iloc[1])  # Column B (index 1)
        if kam_email == 'NULL':
            continue
        
        record = {
            'kam_email': kam_email,
            'kam_name': safe_str(row.iloc[1]).split('@')[0] if '@' in safe_str(row.iloc[1]) else 'NULL',
            'tl_email': safe_str(row.iloc[2]),  # Column C
            'team': safe_str(row.iloc[3]),  # Column D
            
            # Stepper/Base Coverage (Columns E-J)
            'la_base_coverage': safe_str(row.iloc[4]),
            'mm_base_coverage': safe_str(row.iloc[5]),
            'um_base_coverage': safe_str(row.iloc[6]),
            'la_stepper_coverage': safe_str(row.iloc[7]),
            'mm_stepper_coverage': safe_str(row.iloc[8]),
            'um_stepper_coverage': safe_str(row.iloc[9]),
            
            # Delta (Columns K-M)
            'delta_la': safe_str(row.iloc[10]),
            'delta_mm': safe_str(row.iloc[11]),
            'delta_um': safe_str(row.iloc[12]),
            
            # Other metrics (Columns O, Q, T, U)
            'flash_sale_coverage': safe_str(row.iloc[14]),  # Column O
            'bogo_ov_coverage': safe_str(row.iloc[16]),  # Column Q
            'overall_ov_coverage': safe_str(row.iloc[19]),  # Column T
            'overall_res_coverage': safe_str(row.iloc[20]),  # Column U
            
            # BOGO sub-metrics (Columns V-X)
            'bogo_get150': safe_str(row.iloc[22]),  # Column W (GET150)
            'bogo_take150': safe_str(row.iloc[23]),  # Column X (TAKE150)
            'bogo_binge150': safe_str(row.iloc[24]),  # Column Y (BINGE150)
        }
        data.append(record)
    
    print(f"✅ Parsed {len(data)} NCN records")
    return data


def parse_n2r_csv():
    """Parse N2R Summary CSV"""
    print("📖 Reading N2R CSV...")
    
    # Read CSV, skipping first 2 header rows
    df = pd.read_csv(N2R_CSV, skiprows=2, encoding='utf-8')
    
    data = []
    for _, row in df.iterrows():
        kam_email = safe_str(row.iloc[1])  # Column B
        if kam_email == 'NULL':
            continue
        
        record = {
            'kam_email': kam_email,
            'kam_name': safe_str(row.iloc[1]).split('@')[0] if '@' in safe_str(row.iloc[1]) else 'NULL',
            'tl_email': safe_str(row.iloc[2]),  # Column C
            'team': safe_str(row.iloc[3]),  # Column D
            
            # OV Conversions (Columns M, S, Y)
            'la_ov_conversion': safe_str(row.iloc[12]),  # Column M (LA OV Conversion)
            'mm_ov_conversion': safe_str(row.iloc[18]),  # Column S (MM OV Conversion)
            'um_ov_conversion': safe_str(row.iloc[24]),  # Column Y (UM OV Conversion)
        }
        data.append(record)
    
    print(f"✅ Parsed {len(data)} N2R records")
    return data


def parse_items_csv():
    """Parse Items Summary CSV"""
    print("📖 Reading Items CSV...")
    
    # Read CSV, skipping first 4 header rows
    df = pd.read_csv(ITEMS_CSV, skiprows=4, encoding='utf-8')
    
    data = []
    for _, row in df.iterrows():
        kam_email = safe_str(row.iloc[1])  # Column B
        if kam_email == 'NULL':
            continue
        
        # OV Coverage columns: BZ:CV (columns 77-83)
        # Items Count columns: DV:ER (columns 103-109)
        
        record = {
            'kam_email': kam_email,
            'kam_name': safe_str(row.iloc[1]).split('@')[0] if '@' in safe_str(row.iloc[1]) else 'NULL',
            'tl_email': safe_str(row.iloc[2]),  # Column C
            'team': safe_str(row.iloc[3]),  # Column D
            
            # OV Coverage (Baseline, W41-44, Delta, WoW) - Columns 77-83
            'ov_baseline': safe_str(row.iloc[77]),
            'ov_week41': safe_str(row.iloc[78]),
            'ov_week42': safe_str(row.iloc[79]),
            'ov_week43': safe_str(row.iloc[80]),
            'ov_week44': safe_str(row.iloc[81]),
            'ov_delta': safe_str(row.iloc[82]),
            'ov_wow': safe_str(row.iloc[83]),
            
            # Items Count (Baseline, W41-44, Delta, WoW) - Columns 103-109
            'items_baseline': safe_str(row.iloc[103]),
            'items_week41': safe_str(row.iloc[104]),
            'items_week42': safe_str(row.iloc[105]),
            'items_week43': safe_str(row.iloc[106]),
            'items_week44': safe_str(row.iloc[107]),
            'items_delta': safe_str(row.iloc[108]),
            'items_wow': safe_str(row.iloc[109]),
        }
        data.append(record)
    
    print(f"✅ Parsed {len(data)} Items records")
    return data


def generate_ncn_sql(data):
    """Generate SQL INSERT statements for NCN summary"""
    print("🔨 Generating NCN SQL...")

    sql_statements = []
    sql_statements.append("-- NCN Summary Data Import")
    sql_statements.append(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total records: {len(data)}\n")

    for record in data:
        sql = f"""INSERT INTO ncn_summary (
    kam_email, kam_name, tl_email, team,
    la_base_coverage, mm_base_coverage, um_base_coverage,
    la_stepper_coverage, mm_stepper_coverage, um_stepper_coverage,
    delta_la, delta_mm, delta_um,
    flash_sale_coverage, bogo_ov_coverage, overall_ov_coverage, overall_res_coverage,
    bogo_get150, bogo_take150, bogo_binge150
) VALUES (
    {escape_sql(record['kam_email'])}, {escape_sql(record['kam_name'])}, {escape_sql(record['tl_email'])}, {escape_sql(record['team'])},
    {escape_sql(record['la_base_coverage'])}, {escape_sql(record['mm_base_coverage'])}, {escape_sql(record['um_base_coverage'])},
    {escape_sql(record['la_stepper_coverage'])}, {escape_sql(record['mm_stepper_coverage'])}, {escape_sql(record['um_stepper_coverage'])},
    {escape_sql(record['delta_la'])}, {escape_sql(record['delta_mm'])}, {escape_sql(record['delta_um'])},
    {escape_sql(record['flash_sale_coverage'])}, {escape_sql(record['bogo_ov_coverage'])}, {escape_sql(record['overall_ov_coverage'])}, {escape_sql(record['overall_res_coverage'])},
    {escape_sql(record['bogo_get150'])}, {escape_sql(record['bogo_take150'])}, {escape_sql(record['bogo_binge150'])}
)
ON CONFLICT (kam_email) DO UPDATE SET
    kam_name = EXCLUDED.kam_name,
    tl_email = EXCLUDED.tl_email,
    team = EXCLUDED.team,
    la_base_coverage = EXCLUDED.la_base_coverage,
    mm_base_coverage = EXCLUDED.mm_base_coverage,
    um_base_coverage = EXCLUDED.um_base_coverage,
    la_stepper_coverage = EXCLUDED.la_stepper_coverage,
    mm_stepper_coverage = EXCLUDED.mm_stepper_coverage,
    um_stepper_coverage = EXCLUDED.um_stepper_coverage,
    delta_la = EXCLUDED.delta_la,
    delta_mm = EXCLUDED.delta_mm,
    delta_um = EXCLUDED.delta_um,
    flash_sale_coverage = EXCLUDED.flash_sale_coverage,
    bogo_ov_coverage = EXCLUDED.bogo_ov_coverage,
    overall_ov_coverage = EXCLUDED.overall_ov_coverage,
    overall_res_coverage = EXCLUDED.overall_res_coverage,
    bogo_get150 = EXCLUDED.bogo_get150,
    bogo_take150 = EXCLUDED.bogo_take150,
    bogo_binge150 = EXCLUDED.bogo_binge150,
    updated_at = NOW();"""

        sql_statements.append(sql)

    return '\n\n'.join(sql_statements)


def generate_n2r_sql(data):
    """Generate SQL INSERT statements for N2R summary"""
    print("🔨 Generating N2R SQL...")

    sql_statements = []
    sql_statements.append("-- N2R Summary Data Import")
    sql_statements.append(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total records: {len(data)}\n")

    for record in data:
        sql = f"""INSERT INTO n2r_summary (
    kam_email, kam_name, tl_email, team,
    la_ov_conversion, mm_ov_conversion, um_ov_conversion
) VALUES (
    {escape_sql(record['kam_email'])}, {escape_sql(record['kam_name'])}, {escape_sql(record['tl_email'])}, {escape_sql(record['team'])},
    {escape_sql(record['la_ov_conversion'])}, {escape_sql(record['mm_ov_conversion'])}, {escape_sql(record['um_ov_conversion'])}
)
ON CONFLICT (kam_email) DO UPDATE SET
    kam_name = EXCLUDED.kam_name,
    tl_email = EXCLUDED.tl_email,
    team = EXCLUDED.team,
    la_ov_conversion = EXCLUDED.la_ov_conversion,
    mm_ov_conversion = EXCLUDED.mm_ov_conversion,
    um_ov_conversion = EXCLUDED.um_ov_conversion,
    updated_at = NOW();"""

        sql_statements.append(sql)

    return '\n\n'.join(sql_statements)


def generate_items_sql(data):
    """Generate SQL INSERT statements for Items summary"""
    print("🔨 Generating Items SQL...")

    sql_statements = []
    sql_statements.append("-- Items Summary Data Import")
    sql_statements.append(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total records: {len(data)}\n")

    for record in data:
        sql = f"""INSERT INTO items_summary (
    kam_email, kam_name, tl_email, team,
    ov_baseline, ov_week41, ov_week42, ov_week43, ov_week44, ov_delta, ov_wow,
    items_baseline, items_week41, items_week42, items_week43, items_week44, items_delta, items_wow
) VALUES (
    {escape_sql(record['kam_email'])}, {escape_sql(record['kam_name'])}, {escape_sql(record['tl_email'])}, {escape_sql(record['team'])},
    {escape_sql(record['ov_baseline'])}, {escape_sql(record['ov_week41'])}, {escape_sql(record['ov_week42'])}, {escape_sql(record['ov_week43'])}, {escape_sql(record['ov_week44'])}, {escape_sql(record['ov_delta'])}, {escape_sql(record['ov_wow'])},
    {escape_sql(record['items_baseline'])}, {escape_sql(record['items_week41'])}, {escape_sql(record['items_week42'])}, {escape_sql(record['items_week43'])}, {escape_sql(record['items_week44'])}, {escape_sql(record['items_delta'])}, {escape_sql(record['items_wow'])}
)
ON CONFLICT (kam_email) DO UPDATE SET
    kam_name = EXCLUDED.kam_name,
    tl_email = EXCLUDED.tl_email,
    team = EXCLUDED.team,
    ov_baseline = EXCLUDED.ov_baseline,
    ov_week41 = EXCLUDED.ov_week41,
    ov_week42 = EXCLUDED.ov_week42,
    ov_week43 = EXCLUDED.ov_week43,
    ov_week44 = EXCLUDED.ov_week44,
    ov_delta = EXCLUDED.ov_delta,
    ov_wow = EXCLUDED.ov_wow,
    items_baseline = EXCLUDED.items_baseline,
    items_week41 = EXCLUDED.items_week41,
    items_week42 = EXCLUDED.items_week42,
    items_week43 = EXCLUDED.items_week43,
    items_week44 = EXCLUDED.items_week44,
    items_delta = EXCLUDED.items_delta,
    items_wow = EXCLUDED.items_wow,
    updated_at = NOW();"""

        sql_statements.append(sql)

    return '\n\n'.join(sql_statements)


def main():
    """Main execution function"""
    print("=" * 70)
    print("📊 PERFORMANCE METRICS DATA IMPORT")
    print("=" * 70)
    print()

    # Parse CSVs
    ncn_data = parse_ncn_csv()
    n2r_data = parse_n2r_csv()
    items_data = parse_items_csv()

    print()
    print("=" * 70)
    print("📝 SUMMARY")
    print("=" * 70)
    print(f"NCN records: {len(ncn_data)}")
    print(f"N2R records: {len(n2r_data)}")
    print(f"Items records: {len(items_data)}")
    print(f"Total records: {len(ncn_data) + len(n2r_data) + len(items_data)}")
    print()

    # Generate SQL
    ncn_sql = generate_ncn_sql(ncn_data)
    n2r_sql = generate_n2r_sql(n2r_data)
    items_sql = generate_items_sql(items_data)

    # Write SQL files
    print()
    print("💾 Writing SQL files...")

    with open(NCN_SQL, 'w', encoding='utf-8') as f:
        f.write(ncn_sql)
    print(f"✅ Created: {NCN_SQL}")

    with open(N2R_SQL, 'w', encoding='utf-8') as f:
        f.write(n2r_sql)
    print(f"✅ Created: {N2R_SQL}")

    with open(ITEMS_SQL, 'w', encoding='utf-8') as f:
        f.write(items_sql)
    print(f"✅ Created: {ITEMS_SQL}")

    print()
    print("=" * 70)
    print("🎉 SUCCESS!")
    print("=" * 70)
    print()
    print("📋 Next steps:")
    print("1. Execute SQL files in Supabase SQL Editor:")
    print(f"   - {NCN_SQL}")
    print(f"   - {N2R_SQL}")
    print(f"   - {ITEMS_SQL}")
    print()
    print("2. Or use Supabase dashboard:")
    print("   https://app.supabase.com/project/lqtjghnremwiybqzmprn/sql")
    print()
    print("=" * 70)


if __name__ == "__main__":
    main()


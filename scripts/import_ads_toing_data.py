"""
Import ADs, ZVD PO, and Toing Data
===================================
This script imports ADs Historic, ZVD PO, and Toing Flag data and generates SQL UPDATE statements.

Data Sources:
1. data/ads-commission/Dashboard Context data Drives - Ads Historic (2).csv
   - Column A: KAM (email)
   - Column B: Team
   - Column C: AVG. Ach % (2025)

2. Dashboard Context data Drives - comm data (2).csv
   - Column A: res_id
   - Column J: ZVD PO
   - Column K: current_commission
   - Column L: last_change_date

Output:
- update_ads_data.sql - UPDATE statements for ADs achievement by KAM email
- update_zvd_po_data.sql - UPDATE statements for ZVD PO by restaurant ID
"""

import pandas as pd
import sys
import os

# File paths
ADS_CSV = 'data/ads-commission/Dashboard Context data Drives - Ads Historic (2).csv'
ZVD_PO_CSV = 'Dashboard Context data Drives - comm data (2).csv'
ADS_SQL = 'update_ads_data.sql'
ZVD_PO_SQL = 'update_zvd_po_data.sql'


def safe_str(value):
    """Convert value to string, handling NaN and None"""
    if pd.isna(value) or value is None or str(value).strip() == '':
        return 'NULL'
    return str(value).strip()


def escape_sql(value):
    """Escape SQL string values"""
    if value == 'NULL':
        return 'NULL'
    # Escape single quotes
    escaped = value.replace("'", "''")
    return f"'{escaped}'"


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)


def load_ads_data():
    """
    Load ADs Historic data.
    Returns: dict {kam_email: avg_achievement}
    """
    print_header("Loading ADs Historic Data")
    print(f"📂 Reading file: {ADS_CSV}")
    
    df = pd.read_csv(ADS_CSV)
    
    ads_data = {}
    skipped = 0
    
    for idx, row in df.iterrows():
        kam_email = safe_str(row['KAM'])
        avg_achievement = safe_str(row['AVG. Ach %\n(2025)'])
        
        if kam_email == 'NULL':
            skipped += 1
            continue
        
        ads_data[kam_email] = avg_achievement
    
    print(f"✅ Loaded {len(ads_data)} KAM ADs records")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped} rows with missing KAM email")
    
    return ads_data


def load_zvd_po_data():
    """
    Load ZVD PO data from column J.
    Returns: dict {res_id: zvd_po}
    """
    print_header("Loading ZVD PO Data")
    print(f"📂 Reading file: {ZVD_PO_CSV}")

    df = pd.read_csv(ZVD_PO_CSV)

    zvd_po_data = {}
    skipped = 0

    for idx, row in df.iterrows():
        res_id = safe_str(row['res_id'])
        zvd_po = safe_str(row['ZVD PO'])

        if res_id == 'NULL':
            skipped += 1
            continue

        zvd_po_data[res_id] = zvd_po

    print(f"✅ Loaded {len(zvd_po_data)} restaurant ZVD PO records")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped} rows with missing res_id")

    return zvd_po_data


def generate_ads_update_sql(ads_data):
    """Generate SQL UPDATE statements for ADs data"""
    print_header("Generating ADs UPDATE SQL")
    
    sql_statements = []
    
    for kam_email, avg_achievement in ads_data.items():
        sql = f"""UPDATE drive_sheets_data
SET ads_avg_achievement = {escape_sql(avg_achievement)}
WHERE am_email = {escape_sql(kam_email)};
"""
        sql_statements.append(sql)
    
    # Write to file
    with open(ADS_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"✅ Generated {len(ads_data)} UPDATE statements")
    print(f"📄 SQL saved to: {ADS_SQL}")
    
    return len(ads_data)


def generate_zvd_po_update_sql(zvd_po_data):
    """Generate SQL UPDATE statements for ZVD PO data"""
    print_header("Generating ZVD PO UPDATE SQL")

    sql_statements = []

    for res_id, zvd_po in zvd_po_data.items():
        sql = f"""UPDATE drive_sheets_data
SET zvd_po = {escape_sql(zvd_po)}
WHERE res_id = {escape_sql(res_id)};
"""
        sql_statements.append(sql)

    # Write to file
    with open(ZVD_PO_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))

    print(f"✅ Generated {len(zvd_po_data)} UPDATE statements")
    print(f"📄 SQL saved to: {ZVD_PO_SQL}")

    return len(zvd_po_data)


def main():
    """Main execution function"""
    print_header("ADs and ZVD PO Data Import Script")

    try:
        # Load ADs data
        ads_data = load_ads_data()
        ads_count = generate_ads_update_sql(ads_data)

        # Load ZVD PO data
        zvd_po_data = load_zvd_po_data()
        zvd_po_count = generate_zvd_po_update_sql(zvd_po_data)

        # Summary
        print_header("IMPORT SUMMARY")
        print(f"✅ ADs Data: {ads_count} KAMs")
        print(f"✅ ZVD PO Data: {zvd_po_count} restaurants")

        print(f"\n📄 Generated SQL Files:")
        print(f"  1. {ADS_SQL}")
        print(f"  2. {ZVD_PO_SQL}")

        print(f"\n🎯 Next Steps:")
        print(f"  1. Ensure zvd_po column exists in drive_sheets_data table")
        print(f"  2. Execute: {ADS_SQL} (update ADs data)")
        print(f"  3. Execute: {ZVD_PO_SQL} (update ZVD PO data)")
        print("=" * 70)

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()



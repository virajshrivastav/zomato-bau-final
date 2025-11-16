"""
Import ADs and Toing Data
==========================
This script imports ADs Historic and Toing Flag data and generates SQL UPDATE statements.

Data Sources:
1. ADs-and-Toing/Dashboard Context data Drives - Ads Historic (2).csv
   - Column A: KAM (email)
   - Column B: Team
   - Column C: AVG. Ach % (2025)

2. ADs-and-Toing/Dashboard Context data Drives - Copy of comm data.csv
   - Column A: res_id
   - Column B: res_name
   - Column C: am_email
   - Column D: TOING Flag ("Live" or "Not Live")

Output:
- update_ads_data.sql - UPDATE statements for ADs achievement by KAM email
- update_toing_data.sql - UPDATE statements for Toing flag by restaurant ID
"""

import pandas as pd
import sys
import os

# File paths
ADS_CSV = 'ADs-and-Toing/Dashboard Context data Drives - Ads Historic (2).csv'
TOING_CSV = 'ADs-and-Toing/Dashboard Context data Drives - Copy of comm data.csv'
ADS_SQL = 'update_ads_data.sql'
TOING_SQL = 'update_toing_data.sql'


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


def load_toing_data():
    """
    Load Toing Flag data.
    Returns: dict {res_id: toing_flag}
    """
    print_header("Loading Toing Flag Data")
    print(f"📂 Reading file: {TOING_CSV}")
    
    df = pd.read_csv(TOING_CSV)
    
    toing_data = {}
    skipped = 0
    
    for idx, row in df.iterrows():
        res_id = safe_str(row['res_id'])
        toing_flag = safe_str(row['TOING Flag'])
        
        if res_id == 'NULL':
            skipped += 1
            continue
        
        toing_data[res_id] = toing_flag
    
    print(f"✅ Loaded {len(toing_data)} restaurant Toing records")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped} rows with missing res_id")
    
    return toing_data


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


def generate_toing_update_sql(toing_data):
    """Generate SQL UPDATE statements for Toing data"""
    print_header("Generating Toing UPDATE SQL")
    
    sql_statements = []
    
    for res_id, toing_flag in toing_data.items():
        sql = f"""UPDATE drive_sheets_data
SET toing_flag = {escape_sql(toing_flag)}
WHERE res_id = {escape_sql(res_id)};
"""
        sql_statements.append(sql)
    
    # Write to file
    with open(TOING_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"✅ Generated {len(toing_data)} UPDATE statements")
    print(f"📄 SQL saved to: {TOING_SQL}")

    return len(toing_data)


def main():
    """Main execution function"""
    print_header("ADs and Toing Data Import Script")

    try:
        # Load ADs data
        ads_data = load_ads_data()
        ads_count = generate_ads_update_sql(ads_data)

        # Load Toing data
        toing_data = load_toing_data()
        toing_count = generate_toing_update_sql(toing_data)

        # Summary
        print_header("IMPORT SUMMARY")
        print(f"✅ ADs Data: {ads_count} KAMs")
        print(f"✅ Toing Data: {toing_count} restaurants")

        print(f"\n📄 Generated SQL Files:")
        print(f"  1. {ADS_SQL}")
        print(f"  2. {TOING_SQL}")

        print(f"\n🎯 Next Steps:")
        print(f"  1. Execute: supabase/add_ads_toing_columns.sql (add columns)")
        print(f"  2. Execute: {ADS_SQL} (update ADs data)")
        print(f"  3. Execute: {TOING_SQL} (update Toing data)")
        print("=" * 70)

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()



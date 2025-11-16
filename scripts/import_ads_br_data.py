"""
Import ADS BR (Booked Revenue) Data
====================================
This script imports ADS BR (Booked Revenue) data per restaurant and generates SQL UPDATE statements.

Data Source:
data/ads-commission/Dashboard Context data Drives - ADS BR Exact.csv
   - Column A: res_id
   - Column B: res_name
   - Column C: am_email
   - Column D: ADS BR CM (Booked Revenue in Current Month)

Output:
- update_ads_br_data.sql - UPDATE statements for ADS BR by restaurant ID
"""

import pandas as pd
import sys
import os

# File paths
ADS_BR_CSV = 'data/ads-commission/Dashboard Context data Drives - ADS BR Exact.csv'
ADS_BR_SQL = 'update_ads_br_data.sql'


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


def load_ads_br_data():
    """
    Load ADS BR data.
    Returns: dict {res_id: ads_br_cm}
    """
    print_header("Loading ADS BR Data")
    print(f"📂 Reading file: {ADS_BR_CSV}")
    
    df = pd.read_csv(ADS_BR_CSV)
    
    ads_br_data = {}
    skipped = 0
    
    for idx, row in df.iterrows():
        res_id = safe_str(row['res_id'])
        ads_br_cm = safe_str(row['ADS BR CM'])
        
        if res_id == 'NULL':
            skipped += 1
            continue
        
        ads_br_data[res_id] = ads_br_cm
    
    print(f"✅ Loaded {len(ads_br_data)} restaurant ADS BR records")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped} rows with missing res_id")
    
    return ads_br_data


def generate_ads_br_update_sql(ads_br_data):
    """Generate SQL UPDATE statements for ADS BR data"""
    print_header("Generating ADS BR UPDATE SQL")
    
    sql_statements = []
    sql_statements.append("-- ADS BR (Booked Revenue) Data Import")
    sql_statements.append(f"-- Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total records: {len(ads_br_data)}\n")
    
    for res_id, ads_br_cm in ads_br_data.items():
        sql = f"""UPDATE drive_sheets_data
SET ads_br_cm = {escape_sql(ads_br_cm)}
WHERE res_id = {escape_sql(res_id)};
"""
        sql_statements.append(sql)
    
    # Write to file
    with open(ADS_BR_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"✅ Generated {len(ads_br_data)} UPDATE statements")
    print(f"📄 SQL saved to: {ADS_BR_SQL}")
    
    return len(ads_br_data)


def main():
    """Main execution function"""
    print_header("ADS BR Data Import Script")

    try:
        # Load ADS BR data
        ads_br_data = load_ads_br_data()
        ads_br_count = generate_ads_br_update_sql(ads_br_data)

        # Summary
        print_header("IMPORT SUMMARY")
        print(f"✅ ADS BR Data: {ads_br_count} restaurants")

        print(f"\n📄 Generated SQL File:")
        print(f"  1. {ADS_BR_SQL}")

        print(f"\n🎯 Next Steps:")
        print(f"  1. Execute: supabase/add_ads_br_column.sql (add column)")
        print(f"  2. Execute: {ADS_BR_SQL} (update ADS BR data)")
        print("=" * 70)

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()


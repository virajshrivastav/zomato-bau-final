"""
Import Commission Data
======================
This script imports commission and last change date data per restaurant and generates SQL UPDATE statements.

Data Source:
ADs-and-Toing/Dashboard Context data Drives - comm data (1).csv
   - Column A: res_id
   - Column K: current_commission
   - Column L: last_change_date

Output:
- update_commission_data.sql - UPDATE statements for commission data by restaurant ID
"""

import pandas as pd
import sys
import os

# File paths
COMMISSION_CSV = 'ADs-and-Toing/Dashboard Context data Drives - comm data (1).csv'
COMMISSION_SQL = 'update_commission_data.sql'


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


def load_commission_data():
    """
    Load commission data.
    Returns: dict {res_id: {'commission': value, 'last_change_date': value}}
    """
    print_header("Loading Commission Data")
    print(f"📂 Reading file: {COMMISSION_CSV}")
    
    df = pd.read_csv(COMMISSION_CSV)
    
    commission_data = {}
    skipped = 0
    
    for idx, row in df.iterrows():
        res_id = safe_str(row['res_id'])
        current_commission = safe_str(row['current_commission'])
        last_change_date = safe_str(row['last_change_date'])
        
        if res_id == 'NULL':
            skipped += 1
            continue
        
        commission_data[res_id] = {
            'commission': current_commission,
            'last_change_date': last_change_date
        }
    
    print(f"✅ Loaded {len(commission_data)} restaurant commission records")
    if skipped > 0:
        print(f"⚠️  Skipped {skipped} rows with missing res_id")
    
    return commission_data


def generate_commission_update_sql(commission_data):
    """Generate SQL UPDATE statements for commission data"""
    print_header("Generating Commission UPDATE SQL")
    
    sql_statements = []
    sql_statements.append("-- Commission Data Import")
    sql_statements.append(f"-- Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append(f"-- Total records: {len(commission_data)}\n")
    
    for res_id, data in commission_data.items():
        sql = f"""UPDATE drive_sheets_data
SET current_commission = {escape_sql(data['commission'])},
    last_change_date = {escape_sql(data['last_change_date'])}
WHERE res_id = {escape_sql(res_id)};
"""
        sql_statements.append(sql)
    
    # Write to file
    with open(COMMISSION_SQL, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"✅ Generated {len(commission_data)} UPDATE statements")
    print(f"📄 SQL saved to: {COMMISSION_SQL}")
    
    return len(commission_data)


def main():
    """Main execution function"""
    print_header("Commission Data Import Script")

    try:
        # Load commission data
        commission_data = load_commission_data()
        commission_count = generate_commission_update_sql(commission_data)

        # Summary
        print_header("IMPORT SUMMARY")
        print(f"✅ Commission Data: {commission_count} restaurants")

        print(f"\n📄 Generated SQL File:")
        print(f"  1. {COMMISSION_SQL}")

        print(f"\n🎯 Next Steps:")
        print(f"  1. Execute: supabase/add_commission_columns.sql (add columns)")
        print(f"  2. Execute: {COMMISSION_SQL} (update commission data)")
        print("=" * 70)

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()


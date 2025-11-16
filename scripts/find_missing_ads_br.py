"""
Find Missing ADS BR Records
============================
Identify which restaurants from the CSV are missing in the database.
"""

import os
import csv
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url: str = os.getenv("VITE_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ ERROR: Missing Supabase credentials")
    exit(1)

supabase: Client = create_client(url, key)

CSV_FILE = 'ADs-and-Toing/Dashboard Context data Drives - ADS BR Exact.csv'

print("=" * 70)
print("  Finding Missing ADS BR Records")
print("=" * 70)

# Load all res_ids from CSV
print(f"\n📂 Reading CSV file: {CSV_FILE}")
csv_res_ids = set()
csv_data = {}

with open(CSV_FILE, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        res_id = row['res_id'].strip()
        ads_br_cm = row['ADS BR CM'].strip()
        csv_res_ids.add(res_id)
        csv_data[res_id] = ads_br_cm

print(f"✅ Found {len(csv_res_ids)} restaurants in CSV")

# Get all res_ids with ADS BR data from database
print(f"\n🔍 Checking database...")
db_result = supabase.table('drive_sheets_data')\
    .select('res_id, ads_br_cm')\
    .not_.is_('ads_br_cm', 'null')\
    .execute()

db_res_ids = set(record['res_id'] for record in db_result.data)
print(f"✅ Found {len(db_res_ids)} restaurants with ADS BR in database")

# Find missing res_ids
missing_res_ids = csv_res_ids - db_res_ids
print(f"\n⚠️  Missing {len(missing_res_ids)} restaurants")

if len(missing_res_ids) > 0:
    print(f"\n📋 First 20 missing res_ids:")
    for i, res_id in enumerate(list(missing_res_ids)[:20], 1):
        ads_br_value = csv_data.get(res_id, 'N/A')
        print(f"  {i}. {res_id}: {ads_br_value}")
    
    # Check if these restaurants exist in the database at all
    print(f"\n🔍 Checking if missing restaurants exist in database...")
    sample_missing = list(missing_res_ids)[:10]
    
    for res_id in sample_missing:
        result = supabase.table('drive_sheets_data')\
            .select('res_id, res_name')\
            .eq('res_id', res_id)\
            .execute()
        
        if result.data:
            print(f"  ✅ {res_id} exists: {result.data[0]['res_name']}")
        else:
            print(f"  ❌ {res_id} NOT FOUND in database")
    
    # Save missing res_ids to file for retry
    print(f"\n💾 Saving missing res_ids to file...")
    with open('missing_ads_br_res_ids.txt', 'w') as f:
        for res_id in sorted(missing_res_ids):
            f.write(f"{res_id},{csv_data[res_id]}\n")
    
    print(f"✅ Saved to: missing_ads_br_res_ids.txt")

print("\n" + "=" * 70)


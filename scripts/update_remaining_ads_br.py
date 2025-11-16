"""
Update Remaining ADS BR Records
================================
Update the remaining ~483 restaurants that don't have ADS BR data yet.
"""

import os
import csv
import time
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
print("  Updating Remaining ADS BR Records")
print("=" * 70)

# Load all data from CSV
print(f"\n📂 Reading CSV file: {CSV_FILE}")
csv_data = {}

with open(CSV_FILE, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        res_id = row['res_id'].strip()
        ads_br_cm = row['ADS BR CM'].strip()
        csv_data[res_id] = ads_br_cm

print(f"✅ Loaded {len(csv_data)} restaurants from CSV")

# Get all restaurants from database that DON'T have ADS BR data
print(f"\n🔍 Finding restaurants without ADS BR data...")

# Query in batches to avoid pagination limits
batch_size = 1000
offset = 0
restaurants_without_ads_br = []

while True:
    result = supabase.table('drive_sheets_data')\
        .select('res_id, res_name')\
        .is_('ads_br_cm', 'null')\
        .range(offset, offset + batch_size - 1)\
        .execute()
    
    if not result.data:
        break
    
    restaurants_without_ads_br.extend(result.data)
    offset += batch_size
    
    if len(result.data) < batch_size:
        break

print(f"✅ Found {len(restaurants_without_ads_br)} restaurants without ADS BR data")

# Filter to only those that exist in CSV
to_update = []
for restaurant in restaurants_without_ads_br:
    res_id = restaurant['res_id']
    if res_id in csv_data:
        to_update.append({
            'res_id': res_id,
            'res_name': restaurant['res_name'],
            'ads_br_cm': csv_data[res_id]
        })

print(f"📊 {len(to_update)} restaurants need to be updated")

if len(to_update) == 0:
    print("\n✅ All restaurants already have ADS BR data!")
    print("=" * 70)
    exit(0)

# Update in batches
print(f"\n🚀 Starting updates...")
success_count = 0
error_count = 0
start_time = time.time()

for i, restaurant in enumerate(to_update, 1):
    try:
        data = {'ads_br_cm': restaurant['ads_br_cm']}
        supabase.table('drive_sheets_data').update(data).eq('res_id', restaurant['res_id']).execute()
        
        success_count += 1
        
        # Progress tracking every 50 updates
        if i % 50 == 0:
            elapsed = time.time() - start_time
            rate = i / elapsed
            remaining = (len(to_update) - i) / rate
            print(f"Progress: {i}/{len(to_update)} ({i/len(to_update)*100:.1f}%) - "
                  f"Rate: {rate:.1f} updates/sec - ETA: {remaining/60:.1f} min")
        
        # Small delay to avoid rate limiting
        time.sleep(0.3)
        
    except Exception as e:
        print(f"❌ Error updating {restaurant['res_id']}: {e}")
        error_count += 1
        
        if error_count > 10:
            print(f"\n⚠️  Too many errors, stopping")
            break

elapsed_time = time.time() - start_time

print("\n" + "=" * 70)
print("  UPDATE SUMMARY")
print("=" * 70)
print(f"✅ Successful updates: {success_count}")
print(f"❌ Failed updates: {error_count}")
print(f"⏱️  Execution time: {elapsed_time/60:.2f} minutes")
print("=" * 70)

# Final verification
print(f"\n🔍 Final verification...")
try:
    result = supabase.table('drive_sheets_data').select('ads_br_cm', count='exact').not_.is_('ads_br_cm', 'null').execute()
    total_with_data = result.count
    
    print(f"✅ Total restaurants with ADS BR data: {total_with_data}")
    print(f"📊 Expected: 6610")
    print(f"📈 Coverage: {total_with_data/6610*100:.1f}%")
    
    if total_with_data >= 6600:
        print("\n🎉 SUCCESS: ADS BR data import is complete!")
    
except Exception as e:
    print(f"❌ Verification error: {e}")

print("=" * 70)


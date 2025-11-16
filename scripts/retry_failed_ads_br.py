"""
Retry Failed ADS BR Updates
============================
This script retries the failed updates from the previous import.
"""

import os
import time
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url: str = os.getenv("VITE_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ ERROR: Missing Supabase credentials in .env.local")
    exit(1)

supabase: Client = create_client(url, key)

# Failed records from the previous run
failed_records = [
    ('20837973', None),  # Statement 941
    ('21415457', None),  # Statement 6118
    ('21381088', None),  # Statement 6119
    ('20940787', None),  # Statement 6120
    ('19583560', None),  # Statement 6121
    ('19189925', None),  # Statement 6122
    ('6505296', None),   # Statement 6123
    ('20818818', None),  # Statement 6124
    ('22274273', None),  # Statement 6125
    ('19947209', None),  # Statement 6126
    ('19201069', None),  # Statement 6127
]

# We need to get the actual values from the SQL file
# Let me read the SQL file to get the correct values
import re

def get_ads_br_value(res_id):
    """Get ADS BR value for a specific res_id from SQL file"""
    with open('update_ads_br_data.sql', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the UPDATE statement for this res_id
    pattern = rf"SET ads_br_cm = ('(?:[^']|'')*'|NULL)\s+WHERE res_id = '{res_id}'"
    match = re.search(pattern, content)
    
    if match:
        value = match.group(1)
        if value == 'NULL':
            return None
        else:
            return value.strip("'").replace("''", "'")
    return None


print("=" * 70)
print("  Retrying Failed ADS BR Updates")
print("=" * 70)

success_count = 0
error_count = 0

for res_id, _ in failed_records:
    try:
        # Get the actual value from SQL file
        ads_br_cm = get_ads_br_value(res_id)
        
        print(f"Updating res_id {res_id} with value: {ads_br_cm}")
        
        # Execute update
        data = {'ads_br_cm': ads_br_cm}
        result = supabase.table('drive_sheets_data').update(data).eq('res_id', res_id).execute()
        
        success_count += 1
        print(f"  ✅ Success")
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        error_count += 1

print("\n" + "=" * 70)
print("  RETRY SUMMARY")
print("=" * 70)
print(f"✅ Successful updates: {success_count}")
print(f"❌ Failed updates: {error_count}")
print("=" * 70)

# Verify total count
print("\n🔍 Verifying total import...")
try:
    result = supabase.table('drive_sheets_data').select('ads_br_cm', count='exact').not_.is_('ads_br_cm', 'null').execute()
    count_with_data = result.count
    
    print(f"✅ Total restaurants with ADS BR data: {count_with_data}")
    print(f"📊 Expected: 6610")
    print(f"📈 Coverage: {count_with_data/6610*100:.1f}%")
    
except Exception as e:
    print(f"❌ Verification error: {e}")


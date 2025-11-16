"""
Verify ADS BR Data Import
==========================
Check how many restaurants have ADS BR data populated.
"""

import os
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

print("=" * 70)
print("  ADS BR Data Verification")
print("=" * 70)

try:
    # Count total restaurants
    total_result = supabase.table('drive_sheets_data').select('res_id', count='exact').execute()
    total_count = total_result.count
    
    # Count restaurants with ADS BR data
    ads_br_result = supabase.table('drive_sheets_data').select('ads_br_cm', count='exact').not_.is_('ads_br_cm', 'null').execute()
    ads_br_count = ads_br_result.count
    
    # Count restaurants with revenue > 0
    revenue_result = supabase.table('drive_sheets_data').select('ads_br_cm', count='exact').neq('ads_br_cm', '0').not_.is_('ads_br_cm', 'null').execute()
    revenue_count = revenue_result.count
    
    print(f"\n📊 Database Statistics:")
    print(f"  Total restaurants: {total_count}")
    print(f"  Restaurants with ADS BR data: {ads_br_count}")
    print(f"  Restaurants with revenue > 0: {revenue_count}")
    print(f"  Restaurants with zero revenue: {ads_br_count - revenue_count}")
    print(f"\n📈 Coverage: {ads_br_count/6610*100:.1f}% of expected 6610 restaurants")
    
    # Get top 10 restaurants by revenue
    print(f"\n🏆 Top 10 Restaurants by ADS BR:")
    top_restaurants = supabase.table('drive_sheets_data')\
        .select('res_id, res_name, ads_br_cm')\
        .not_.is_('ads_br_cm', 'null')\
        .order('ads_br_cm', desc=True)\
        .limit(10)\
        .execute()
    
    for i, restaurant in enumerate(top_restaurants.data, 1):
        revenue = float(restaurant['ads_br_cm']) if restaurant['ads_br_cm'] else 0
        print(f"  {i}. {restaurant['res_name']} (ID: {restaurant['res_id']}): ₹{revenue:,.0f}")
    
    # Check if any of the previously failed records are now updated
    print(f"\n🔍 Checking Previously Failed Records:")
    failed_ids = ['20837973', '21415457', '21381088', '20940787', '19583560', 
                  '19189925', '6505296', '20818818', '22274273', '19947209', '19201069']
    
    for res_id in failed_ids:
        result = supabase.table('drive_sheets_data')\
            .select('res_id, res_name, ads_br_cm')\
            .eq('res_id', res_id)\
            .execute()
        
        if result.data:
            record = result.data[0]
            status = "✅" if record['ads_br_cm'] is not None else "❌"
            value = record['ads_br_cm'] if record['ads_br_cm'] is not None else "NULL"
            print(f"  {status} {res_id}: {value}")
        else:
            print(f"  ⚠️  {res_id}: Not found in database")
    
    print("\n" + "=" * 70)
    
    if ads_br_count >= 6600:
        print("✅ SUCCESS: ADS BR data import is complete!")
    elif ads_br_count >= 6100:
        print("⚠️  PARTIAL SUCCESS: Most data imported, some records may need retry")
    else:
        print("❌ INCOMPLETE: Significant number of records missing")
    
    print("=" * 70)

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()


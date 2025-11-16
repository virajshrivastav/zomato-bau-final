"""
Check Restaurant Counts in Database
====================================
Quick script to check how many restaurants exist in total and per drive.
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def get_supabase_client() -> Client:
    """Initialize Supabase client."""
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def main():
    print("\n" + "="*70)
    print("📊 RESTAURANT COUNT ANALYSIS")
    print("="*70 + "\n")
    
    supabase = get_supabase_client()
    
    # Total restaurants
    print("🔍 Counting total restaurants...")
    total_result = supabase.table('drive_sheets_data').select('res_id', count='exact').execute()
    total_count = total_result.count
    print(f"✅ Total restaurants in database: {total_count}")
    
    # NCN restaurants
    print("\n🔍 Counting NCN restaurants...")
    ncn_result = supabase.table('drive_sheets_data').select('res_id', count='exact').not_.is_('ncn_p1', 'null').execute()
    ncn_count = ncn_result.count
    print(f"✅ Restaurants with NCN data (ncn_p1 not null): {ncn_count}")
    
    # N2R restaurants
    print("\n🔍 Counting N2R restaurants...")
    n2r_result = supabase.table('drive_sheets_data').select('res_id', count='exact').not_.is_('n2r_la_current_code', 'null').execute()
    n2r_count = n2r_result.count
    print(f"✅ Restaurants with N2R data (n2r_la_current_code not null): {n2r_count}")
    
    # Items restaurants
    print("\n🔍 Counting Items restaurants...")
    items_result = supabase.table('drive_sheets_data').select('res_id', count='exact').not_.is_('items_priority', 'null').execute()
    items_count = items_result.count
    print(f"✅ Restaurants with Items data (items_priority not null): {items_count}")
    
    # Summary
    print("\n" + "="*70)
    print("📊 SUMMARY")
    print("="*70)
    print(f"Total Restaurants:     {total_count:,}")
    print(f"NCN Participants:      {ncn_count:,} ({ncn_count/total_count*100:.1f}%)")
    print(f"N2R Participants:      {n2r_count:,} ({n2r_count/total_count*100:.1f}%)")
    print(f"Items Participants:    {items_count:,} ({items_count/total_count*100:.1f}%)")
    print(f"\nTotal Drive Entries:   {ncn_count + n2r_count + items_count:,}")

if __name__ == "__main__":
    main()


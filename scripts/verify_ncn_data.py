"""
Verify NCN Data Import
======================
Quick script to verify NCN data was imported correctly
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

print("="*70)
print("  NCN DATA VERIFICATION")
print("="*70)

# Get first record
response = supabase.table('ncn_summary').select('*').limit(1).execute()

if response.data:
    record = response.data[0]
    print(f"\n✅ Sample Record Found:")
    print(f"   KAM Email: {record['kam_email']}")
    print(f"   Team: {record['team']}")
    print(f"\n📊 Stepper/Base Coverage:")
    print(f"   LA Base: {record['la_base_coverage']}")
    print(f"   MM Base: {record['mm_base_coverage']}")
    print(f"   UM Base: {record['um_base_coverage']}")
    print(f"   LA Stepper: {record['la_stepper_coverage']}")
    print(f"   MM Stepper: {record['mm_stepper_coverage']}")
    print(f"   UM Stepper: {record['um_stepper_coverage']}")
    print(f"\n📈 Other Metrics:")
    print(f"   Flash Sale Coverage: {record['flash_sale_coverage']}")
    print(f"   BOGO OV Coverage: {record['bogo_ov_coverage']}")
    print(f"   Overall OV Coverage: {record['overall_ov_coverage']}")
    print(f"   Overall Res Coverage: {record['overall_res_coverage']}")
else:
    print("\n❌ No records found!")

# Get total count
count_response = supabase.table('ncn_summary').select('*', count='exact').execute()
print(f"\n📊 Total NCN Records: {count_response.count}")

print("\n" + "="*70)


"""
Verify Specific KAM Data
========================
Check data for bhuwneshwari.dhouni@zomato.com (first data row in CSV)
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
print("  SPECIFIC KAM DATA VERIFICATION")
print("="*70)

# Get specific KAM
kam_email = "bhuwneshwari.dhouni@zomato.com"
response = supabase.table('ncn_summary').select('*').eq('kam_email', kam_email).execute()

if response.data:
    record = response.data[0]
    print(f"\n✅ Record Found for: {kam_email}")
    print(f"   Team: {record['team']}")
    print(f"   TL: {record['tl_email']}")
    print(f"\n📊 Stepper/Base Coverage:")
    print(f"   LA Base: {record['la_base_coverage']} (Expected: 36.51%)")
    print(f"   MM Base: {record['mm_base_coverage']} (Expected: 27.33%)")
    print(f"   UM Base: {record['um_base_coverage']} (Expected: 47.19%)")
    print(f"   LA Stepper: {record['la_stepper_coverage']} (Expected: 55.77%)")
    print(f"   MM Stepper: {record['mm_stepper_coverage']} (Expected: 55.47%)")
    print(f"   UM Stepper: {record['um_stepper_coverage']} (Expected: 53.74%)")
    print(f"\n📈 Other Metrics:")
    print(f"   Flash Sale Coverage: {record['flash_sale_coverage']} (Expected: 11.8%)")
    print(f"   BOGO OV Coverage: {record['bogo_ov_coverage']} (Expected: 0.0%)")
    print(f"   Overall OV Coverage: {record['overall_ov_coverage']} (Expected: 55.8%)")
    print(f"   Overall Res Coverage: {record['overall_res_coverage']} (Expected: 52.0%)")
else:
    print(f"\n❌ No record found for {kam_email}!")

print("\n" + "="*70)


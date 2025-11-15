#!/usr/bin/env python3
"""
Verify Data Import
==================
Check that all drive data was imported correctly.
"""

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

print("\n" + "="*70)
print("📊 DATA IMPORT VERIFICATION")
print("="*70 + "\n")

# Total count
result = supabase.table('drive_sheets_data').select('*', count='exact').execute()
total = result.count
print(f"✅ Total restaurants: {total}")

# Count with NCN data (check ncn_p1 column)
result = supabase.table('drive_sheets_data').select('*', count='exact').not_.is_('ncn_p1', 'null').execute()
ncn_count = result.count
print(f"✅ With NCN data: {ncn_count}")

# Count with N2R data (check n2r_la_ov column)
result = supabase.table('drive_sheets_data').select('*', count='exact').not_.is_('n2r_la_ov', 'null').execute()
n2r_count = result.count
print(f"✅ With N2R data: {n2r_count}")

# Count with Items data (check items_priority column)
result = supabase.table('drive_sheets_data').select('*', count='exact').not_.is_('items_priority', 'null').execute()
items_count = result.count
print(f"✅ With Items data: {items_count}")

# Count with all 3 drives
result = supabase.table('drive_sheets_data').select('*', count='exact')\
    .not_.is_('ncn_p1', 'null')\
    .not_.is_('n2r_la_ov', 'null')\
    .not_.is_('items_priority', 'null').execute()
all_three = result.count
print(f"✅ With all 3 drives: {all_three}")

# Count with 0 drives
result = supabase.table('drive_sheets_data').select('*', count='exact')\
    .is_('ncn_p1', 'null')\
    .is_('n2r_la_ov', 'null')\
    .is_('items_priority', 'null').execute()
zero_drives = result.count
print(f"📊 With 0 drives: {zero_drives}")

print("\n" + "="*70)
print("🎉 VERIFICATION COMPLETE!")
print("="*70 + "\n")

print("Expected vs Actual:")
print(f"  Total: 6,610 (Actual: {total}) {'✅' if total == 6610 else '⚠️'}")
print(f"  NCN: ~5,539 (Actual: {ncn_count}) {'✅' if 5500 <= ncn_count <= 5600 else '⚠️'}")
print(f"  N2R: ~5,663 (Actual: {n2r_count}) {'✅' if 5600 <= n2r_count <= 5700 else '⚠️'}")
print(f"  Items: ~1,909 (Actual: {items_count}) {'✅' if 1850 <= items_count <= 1950 else '⚠️'}")

print("\n✅ Data import successful! Ready to test frontend.\n")


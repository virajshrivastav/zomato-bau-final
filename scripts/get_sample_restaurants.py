#!/usr/bin/env python3
"""
Get Sample Restaurant Data for Testing
=======================================
Fetch specific restaurants with different drive combinations for testing.
"""

import os
from dotenv import load_dotenv
from supabase import create_client
import json

load_dotenv('.env.local')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

print("\n" + "="*80)
print("📊 SAMPLE RESTAURANT DATA FOR TESTING")
print("="*80 + "\n")

# 1. Get the test restaurant (6503620 - Kanha Veg) - has all 3 drives
print("1️⃣  TEST RESTAURANT (All 3 Drives)")
print("-" * 80)
result = supabase.table('drive_sheets_data').select('*').eq('res_id', '6503620').execute()
if result.data:
    r = result.data[0]
    print(f"Restaurant ID: {r['res_id']}")
    print(f"Name: {r['res_name']}")
    print(f"KAM: {r['am_name']} ({r['am_email']})")
    print(f"Cuisine: {r['cuisine']}")
    print(f"Locality: {r['locality']}")
    print(f"\nNCN Data:")
    print(f"  - P1: {r['ncn_p1']}")
    print(f"  - LA Base Code: {r['ncn_la_base_code_suggested']}")
    print(f"  - Approached: {r['ncn_approached']}")
    print(f"\nN2R Data:")
    print(f"  - LA Current AOV: {r['n2r_la_current_aov']}")
    print(f"  - LA Current Code: {r['n2r_la_current_code']}")
    print(f"  - Approached: {r['n2r_approached']}")
    print(f"\nItems Data:")
    print(f"  - Priority: {r['items_priority']}")
    print(f"  - POS Flag: {r['items_pos_flag']}")
    print(f"  - Approached: {r['items_approached']}")

# 2. Get a restaurant with only NCN
print("\n\n2️⃣  RESTAURANT WITH ONLY NCN")
print("-" * 80)
result = supabase.table('drive_sheets_data').select('*')\
    .not_.is_('ncn_p1', 'null')\
    .is_('n2r_la_ov', 'null')\
    .is_('items_priority', 'null')\
    .limit(1).execute()
if result.data:
    r = result.data[0]
    print(f"Restaurant ID: {r['res_id']}")
    print(f"Name: {r['res_name']}")
    print(f"KAM: {r['am_name']} ({r['am_email']})")
    print(f"NCN P1: {r['ncn_p1']}")
    print(f"N2R Data: None")
    print(f"Items Data: None")

# 3. Get a restaurant with 0 drives
print("\n\n3️⃣  RESTAURANT WITH 0 DRIVES")
print("-" * 80)
result = supabase.table('drive_sheets_data').select('*')\
    .is_('ncn_p1', 'null')\
    .is_('n2r_la_ov', 'null')\
    .is_('items_priority', 'null')\
    .limit(1).execute()
if result.data:
    r = result.data[0]
    print(f"Restaurant ID: {r['res_id']}")
    print(f"Name: {r['res_name']}")
    print(f"KAM: {r['am_name']} ({r['am_email']})")
    print(f"NCN Data: None")
    print(f"N2R Data: None")
    print(f"Items Data: None")

# 4. Get a restaurant with NCN + N2R (no Items)
print("\n\n4️⃣  RESTAURANT WITH NCN + N2R (No Items)")
print("-" * 80)
result = supabase.table('drive_sheets_data').select('*')\
    .not_.is_('ncn_p1', 'null')\
    .not_.is_('n2r_la_ov', 'null')\
    .is_('items_priority', 'null')\
    .limit(1).execute()
if result.data:
    r = result.data[0]
    print(f"Restaurant ID: {r['res_id']}")
    print(f"Name: {r['res_name']}")
    print(f"KAM: {r['am_name']} ({r['am_email']})")
    print(f"NCN P1: {r['ncn_p1']}")
    print(f"N2R LA AOV: {r['n2r_la_current_aov']}")
    print(f"Items Data: None")

# 5. Get restaurants for a specific KAM
print("\n\n5️⃣  SAMPLE KAM'S RESTAURANTS")
print("-" * 80)
result = supabase.table('drive_sheets_data').select('res_id, res_name, am_name, am_email, ncn_p1, n2r_la_ov, items_priority')\
    .eq('am_email', 'gupta.ansh@zomato.com')\
    .limit(5).execute()
if result.data:
    print(f"KAM: {result.data[0]['am_name']} ({result.data[0]['am_email']})")
    print(f"Total restaurants: {len(result.data)}")
    for r in result.data:
        drives = []
        if r['ncn_p1']: drives.append('NCN')
        if r['n2r_la_ov']: drives.append('N2R')
        if r['items_priority']: drives.append('Items')
        print(f"  - {r['res_id']}: {r['res_name']} | Drives: {', '.join(drives) if drives else 'None'}")

print("\n" + "="*80)
print("✅ SAMPLE DATA RETRIEVED")
print("="*80 + "\n")


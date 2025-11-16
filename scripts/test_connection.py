"""
Test Supabase Connection
=========================
This script tests if Supabase connection is working properly.

Usage:
    python scripts/test_connection.py
"""

import os
import sys
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("=" * 70)
print("  SUPABASE CONNECTION TEST")
print("=" * 70)

# Check credentials
print("\n1️⃣  Checking Credentials...")
print(f"   URL: {url}")
print(f"   Service Role Key Length: {len(key) if key else 0} characters")
if key:
    print(f"   Key Preview: {key[:30]}...")
else:
    print("   ❌ Service role key is missing!")
    sys.exit(1)

# Test connection
print("\n2️⃣  Testing Connection...")
try:
    supabase = create_client(url, key)
    print("   ✅ Client created successfully")
except Exception as e:
    print(f"   ❌ Failed to create client: {e}")
    sys.exit(1)

# Test query on each table
tables = ['ncn_summary', 'n2r_summary', 'items_summary']

print("\n3️⃣  Testing Table Access...")
for table in tables:
    try:
        result = supabase.table(table).select('*', count='exact').limit(1).execute()
        print(f"   ✅ {table}: {result.count} total rows, can read data")
    except Exception as e:
        print(f"   ❌ {table}: Error - {e}")

# Test INSERT permission
print("\n4️⃣  Testing INSERT Permission...")
test_data = {
    'kam_email': 'test.user@zomato.com',
    'kam_name': 'test.user',
    'tl_email': 'test.tl@zomato.com',
    'team': 'Test Team',
    'la_base_coverage': '10%',
    'mm_base_coverage': '20%',
    'um_base_coverage': '30%',
    'la_stepper_coverage': '15%',
    'mm_stepper_coverage': '25%',
    'um_stepper_coverage': '35%',
}

try:
    result = supabase.table('ncn_summary').insert(test_data).execute()
    print(f"   ✅ INSERT successful")
    
    # Clean up test data
    print("\n5️⃣  Testing DELETE Permission...")
    supabase.table('ncn_summary').delete().eq('kam_email', 'test.user@zomato.com').execute()
    print(f"   ✅ DELETE successful")
    
except Exception as e:
    print(f"   ❌ INSERT/DELETE failed: {e}")
    print("\n   💡 This might be due to:")
    print("      - Row Level Security (RLS) blocking operations")
    print("      - Missing permissions on service role")
    print("      - Table constraints")

print("\n" + "=" * 70)
print("  TEST COMPLETE")
print("=" * 70)


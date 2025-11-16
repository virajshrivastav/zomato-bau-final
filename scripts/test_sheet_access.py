"""
Test Google Sheet Access
=========================
This script tests if we can access the Google Sheet.

Sheet URL: https://docs.google.com/spreadsheets/d/1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ/edit?gid=25988507#gid=25988507

Usage:
    python scripts/test_sheet_access.py
"""

import requests

SHEET_ID = '1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ'
GID = '25988507'

print("\n" + "="*70)
print("🔍 TESTING GOOGLE SHEET ACCESS")
print("="*70 + "\n")

print(f"Sheet ID: {SHEET_ID}")
print(f"GID: {GID}\n")

# Test 1: Check if sheet is publicly accessible via CSV export
print("Test 1: Checking public CSV export access...")
csv_url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}"
print(f"URL: {csv_url}\n")

try:
    response = requests.get(csv_url, timeout=10)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ SUCCESS! Sheet is publicly accessible!")
        print(f"\nFirst 500 characters of data:")
        print("-" * 70)
        print(response.text[:500])
        print("-" * 70)
        print(f"\nTotal data size: {len(response.text)} characters")
        
        # Count rows
        rows = response.text.split('\n')
        print(f"Total rows: {len(rows)}")
        
        if rows:
            print(f"\nFirst row (headers):")
            print(rows[0])
        
    elif response.status_code == 403:
        print("❌ FORBIDDEN - Sheet is not publicly accessible")
        print("\n📋 To fix this, you need to:")
        print("1. Open the Google Sheet")
        print("2. Click 'Share' button (top right)")
        print("3. Change 'Restricted' to 'Anyone with the link'")
        print("4. Set permission to 'Viewer'")
        print("5. Click 'Done'")
        
    else:
        print(f"❌ FAILED - Unexpected status code: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        
except Exception as e:
    print(f"❌ ERROR: {e}")

print("\n" + "="*70)

# Test 2: Check if we need service account
print("\n📋 ALTERNATIVE APPROACH - Service Account")
print("="*70 + "\n")
print("If the sheet is not public, you need to:")
print("1. Create a Google Service Account")
print("2. Download the JSON credentials file")
print("3. Share the Google Sheet with the service account email")
print("\nWould you like instructions for this? (Y/N)")


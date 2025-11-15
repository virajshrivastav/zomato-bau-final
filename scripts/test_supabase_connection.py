"""Test Supabase connection"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

print(f"URL: {SUPABASE_URL}")
print(f"Key: {SUPABASE_KEY[:20]}..." if SUPABASE_KEY else "None")

if SUPABASE_URL and SUPABASE_KEY:
    print("\nConnecting to Supabase...")
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Client created")
        
        # Test query
        result = supabase.table('drive_sheets_data').select("count").execute()
        print(f"✅ Connection successful! Table exists.")
        print(f"Result: {result}")
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print("❌ Missing credentials")


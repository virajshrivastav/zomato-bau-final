"""
Execute Performance Metrics SQL Files
======================================
Executes the generated SQL files using Supabase Python client.

Usage:
    python scripts/execute_performance_metrics_sql.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Try to import supabase
try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Supabase library not installed!")
    print("📦 Installing now...")
    os.system("pip install supabase")
    from supabase import create_client, Client

# Get Supabase credentials
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: Missing Supabase credentials in .env.local")
    sys.exit(1)

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# SQL files to execute
SQL_FILES = [
    'sql_output/insert_ncn_summary.sql',
    'sql_output/insert_n2r_summary.sql',
    'sql_output/insert_items_summary.sql'
]

print("=" * 70)
print("🚀 EXECUTING PERFORMANCE METRICS SQL")
print("=" * 70)
print()

for sql_file in SQL_FILES:
    if not os.path.exists(sql_file):
        print(f"❌ File not found: {sql_file}")
        continue
    
    print(f"📖 Reading: {sql_file}")
    
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Split into individual INSERT statements
    statements = [s.strip() for s in sql_content.split('\n\n') if s.strip() and s.strip().startswith('INSERT')]
    
    print(f"📝 Found {len(statements)} INSERT statements")
    print(f"🚀 Executing...")
    
    success_count = 0
    error_count = 0
    
    for i, statement in enumerate(statements, 1):
        try:
            # Execute via Supabase RPC
            supabase.rpc('exec_sql', {'sql': statement}).execute()
            success_count += 1
            if i % 10 == 0:
                print(f"   Progress: {i}/{len(statements)}")
        except Exception as e:
            error_count += 1
            if error_count <= 3:  # Only show first 3 errors
                print(f"   ❌ Error on statement {i}: {str(e)[:100]}")
    
    print(f"✅ Success: {success_count}/{len(statements)}")
    if error_count > 0:
        print(f"❌ Errors: {error_count}/{len(statements)}")
    print()

print("=" * 70)
print("🎉 EXECUTION COMPLETE!")
print("=" * 70)
print()
print("📋 Next steps:")
print("1. Verify data in Supabase dashboard")
print("2. Run verification queries:")
print()
print("   SELECT COUNT(*) FROM ncn_summary;")
print("   SELECT COUNT(*) FROM n2r_summary;")
print("   SELECT COUNT(*) FROM items_summary;")
print()
print("=" * 70)


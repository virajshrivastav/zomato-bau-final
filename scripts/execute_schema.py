"""
Execute Performance Metrics Schema
===================================
Displays the SQL schema and provides instructions for manual execution.

For CREATE TABLE statements, it's best to execute them via Supabase SQL Editor.

Usage:
    python scripts/execute_schema.py
"""

import os

# Read schema file
schema_file = 'supabase/performance_metrics_schema.sql'
print("=" * 70)
print("📖 PERFORMANCE METRICS SCHEMA")
print("=" * 70)
print()

if not os.path.exists(schema_file):
    print(f"❌ Error: Schema file not found: {schema_file}")
    exit(1)

with open(schema_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

print("📋 SQL Schema to Execute:")
print("-" * 70)
print(sql_content)
print("-" * 70)
print()

print("=" * 70)
print("🚀 EXECUTION INSTRUCTIONS")
print("=" * 70)
print()
print("Option 1: Supabase SQL Editor (Recommended)")
print("  1. Go to: https://app.supabase.com/project/lqtjghnremwiybqzmprn/sql")
print("  2. Copy the SQL above")
print("  3. Paste into SQL Editor")
print("  4. Click 'Run'")
print()
print("Option 2: Copy to Clipboard")
print("  The SQL has been displayed above - copy it manually")
print()
print("=" * 70)
print("✅ VERIFICATION")
print("=" * 70)
print()
print("After execution, verify tables created:")
print()
print("SELECT table_name FROM information_schema.tables")
print("WHERE table_name IN ('ncn_summary', 'n2r_summary', 'items_summary');")
print()
print("Expected: 3 rows (ncn_summary, n2r_summary, items_summary)")
print()
print("=" * 70)


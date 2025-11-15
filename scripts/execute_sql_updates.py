#!/usr/bin/env python3
"""
Execute SQL UPDATE statements via Supabase API
This script parses SQL files and executes them using the Supabase Python client
"""
import os
import re
import time
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env.local (or .env)
if os.path.exists('.env.local'):
    load_dotenv('.env.local')
else:
    load_dotenv()

# Initialize Supabase client with service role key
url: str = os.getenv("VITE_SUPABASE_URL")
service_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not service_key:
    print("❌ Error: Missing Supabase credentials")
    print("   Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local")
    exit(1)

supabase: Client = create_client(url, service_key)

def parse_update_statement(sql):
    """Parse UPDATE statement to extract res_id and field values"""
    # Extract WHERE clause (e.g., WHERE res_id = '123456')
    res_id_match = re.search(r"WHERE res_id = '([^']+)'", sql)
    if not res_id_match:
        return None, None
    res_id = res_id_match.group(1)
    
    # Extract SET clause
    set_match = re.search(r"SET\s+(.*?)\s+WHERE", sql, re.DOTALL)
    if not set_match:
        return None, None
    
    set_clause = set_match.group(1)
    data = {}
    
    # Parse field-value pairs
    pairs = re.findall(r"(\w+)\s*=\s*('(?:[^']|'')*'|NULL)", set_clause)
    
    for field, value in pairs:
        if value == 'NULL':
            data[field] = None
        else:
            # Remove quotes and unescape single quotes
            data[field] = value.strip("'").replace("''", "'")
    
    return res_id, data

def parse_insert_statement(sql):
    """Parse INSERT statement to extract values"""
    # Extract table name
    table_match = re.search(r"INSERT INTO (\w+)", sql)
    if not table_match:
        return None, None
    
    # Extract column names
    columns_match = re.search(r"\(([^)]+)\)\s+VALUES", sql)
    if not columns_match:
        return None, None
    
    columns = [c.strip() for c in columns_match.group(1).split(',')]
    
    # Extract values
    values_match = re.search(r"VALUES\s*\(([^)]+)\)", sql)
    if not values_match:
        return None, None
    
    values_str = values_match.group(1)
    values = []
    
    # Parse values (handle quoted strings with commas)
    current_value = ""
    in_quotes = False
    
    for char in values_str:
        if char == "'" and (not current_value or current_value[-1] != '\\'):
            in_quotes = not in_quotes
            current_value += char
        elif char == ',' and not in_quotes:
            values.append(current_value.strip())
            current_value = ""
        else:
            current_value += char
    
    if current_value:
        values.append(current_value.strip())
    
    # Build data dictionary
    data = {}
    for col, val in zip(columns, values):
        if val == 'NULL':
            data[col] = None
        else:
            data[col] = val.strip("'").replace("''", "'")
    
    return table_match.group(1), data

def execute_update(table_name, res_id, data):
    """Execute UPDATE via Supabase API"""
    result = supabase.table(table_name).update(data).eq('res_id', res_id).execute()
    return result

def execute_insert(table_name, data):
    """Execute INSERT via Supabase API"""
    result = supabase.table(table_name).insert(data).execute()
    return result

def process_sql_file(file_path, table_name):
    """Process a single SQL file"""
    print(f"\n{'='*70}")
    print(f"  Processing: {file_path}")
    print(f"{'='*70}")
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return 0, 0
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into individual statements
    statements = [s.strip() for s in content.split(';') if s.strip()]
    
    print(f"📝 Found {len(statements)} SQL statements")
    
    success_count = 0
    error_count = 0
    start_time = time.time()
    
    for i, statement in enumerate(statements):
        # Skip comments and empty statements
        if not statement or statement.startswith('--'):
            continue
        
        try:
            if statement.upper().startswith('UPDATE'):
                res_id, data = parse_update_statement(statement)
                if res_id and data:
                    execute_update(table_name, res_id, data)
                    success_count += 1
            elif statement.upper().startswith('INSERT'):
                table, data = parse_insert_statement(statement)
                if table and data:
                    execute_insert(table, data)
                    success_count += 1
            
            # Progress tracking
            if (i + 1) % 100 == 0:
                elapsed = time.time() - start_time
                rate = (i + 1) / elapsed
                print(f"   Progress: {i + 1}/{len(statements)} ({rate:.1f} stmt/sec)")
        
        except Exception as e:
            error_count += 1
            if error_count <= 5:  # Only show first 5 errors
                print(f"⚠️  Error on statement {i + 1}: {str(e)[:100]}")
    
    elapsed_time = time.time() - start_time
    print(f"✅ Completed: {success_count} successful, {error_count} errors")
    print(f"⏱️  Time: {elapsed_time:.2f} seconds")
    
    return success_count, error_count

def main():
    """Main execution function"""
    print("\n" + "="*70)
    print("  🚀 EXECUTING SQL FILES VIA SUPABASE API")
    print("="*70)

    # SQL files to execute in order (skipping insert since data already exists)
    sql_files = [
        # ('insert_base_restaurants.sql', 'drive_sheets_data'),  # Skip - data already exists
        ('update_ncn_fields.sql', 'drive_sheets_data'),
        ('update_n2r_fields.sql', 'drive_sheets_data'),
        ('update_items_fields.sql', 'drive_sheets_data'),
    ]

    total_success = 0
    total_errors = 0
    overall_start = time.time()

    for sql_file, table_name in sql_files:
        success, errors = process_sql_file(sql_file, table_name)
        total_success += success
        total_errors += errors

    overall_time = time.time() - overall_start

    print("\n" + "="*70)
    print("  ✅ EXECUTION COMPLETE")
    print("="*70)
    print(f"  Total successful: {total_success}")
    print(f"  Total errors: {total_errors}")
    print(f"  Total time: {overall_time/60:.2f} minutes")
    print("="*70)

if __name__ == "__main__":
    main()


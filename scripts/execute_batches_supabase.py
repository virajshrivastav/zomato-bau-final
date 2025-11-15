#!/usr/bin/env python3
"""
Execute All Batch SQL Files Using Supabase Client
==================================================
This script executes all 80 batch files using Supabase Python client with service role key.

Requirements:
    pip install supabase python-dotenv

Usage:
    python scripts/execute_batches_supabase.py
"""

import os
import sys
import time
import glob
import re
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

# Color codes
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'=' * 70}{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}{text}{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'=' * 70}{Colors.RESET}\n")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.RESET}")

def print_info(text):
    print(f"{Colors.YELLOW}📊 {text}{Colors.RESET}")

def parse_update_statement(sql):
    """Parse UPDATE statement to extract res_id and field values"""
    
    # Extract res_id from WHERE clause
    res_id_match = re.search(r"WHERE res_id = '(\d+)'", sql)
    if not res_id_match:
        return None, None
    
    res_id = res_id_match.group(1)
    
    # Extract SET clause
    set_match = re.search(r"SET\s+(.*?)\s+WHERE", sql, re.DOTALL)
    if not set_match:
        return None, None
    
    set_clause = set_match.group(1)
    
    # Parse field = value pairs
    data = {}
    # Split by comma, but be careful with commas inside quotes
    pairs = re.findall(r"(\w+)\s*=\s*('(?:[^']|'')*'|NULL)", set_clause)
    
    for field, value in pairs:
        if value == 'NULL':
            data[field] = None
        else:
            # Remove quotes and unescape single quotes
            data[field] = value.strip("'").replace("''", "'")
    
    return res_id, data

def execute_sql_file_via_supabase(supabase: Client, file_path, file_name):
    """Execute SQL file by parsing and using Supabase client"""
    
    try:
        # Read SQL file
        with open(file_path, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        # Split into individual UPDATE statements
        statements = re.split(r';\s*\n', sql)
        statements = [s.strip() for s in statements if s.strip() and 'UPDATE drive_sheets_data' in s]
        
        print_info(f"Statements to execute: {len(statements)}")
        
        start_time = time.time()
        success_count = 0
        fail_count = 0
        
        # Execute each UPDATE statement
        for i, statement in enumerate(statements, 1):
            try:
                # Parse the UPDATE statement
                res_id, data = parse_update_statement(statement)
                
                if not res_id or not data:
                    print_error(f"  Statement {i}: Failed to parse")
                    fail_count += 1
                    continue
                
                # Execute update using Supabase client
                result = supabase.table('drive_sheets_data').update(data).eq('res_id', res_id).execute()
                
                success_count += 1
                
                # Show progress every 50 statements
                if i % 50 == 0:
                    print_info(f"  Progress: {i}/{len(statements)} statements")
                
            except Exception as e:
                print_error(f"  Statement {i} failed: {str(e)[:100]}")
                fail_count += 1
                continue
        
        duration = time.time() - start_time
        
        print_success(f"Successfully executed {file_name}")
        print_info(f"Duration: {duration:.2f}s")
        print_info(f"Success: {success_count}, Failed: {fail_count}")
        
        return fail_count == 0
        
    except Exception as e:
        print_error(f"Failed to execute {file_name}: {e}")
        return False

def get_batch_files():
    """Get all batch files in correct execution order"""
    
    batch_files = []
    
    # NCN batches (40 files)
    for part in range(1, 6):
        for batch in range(1, 9):
            pattern = f"update_ncn_fields_part{part}_batch{batch:02d}.sql"
            files = glob.glob(pattern)
            if files:
                batch_files.extend(files)
    
    # N2R batches (30 files)
    for part in range(1, 6):
        for batch in range(1, 7):
            pattern = f"update_n2r_fields_part{part}_batch{batch:02d}.sql"
            files = glob.glob(pattern)
            if files:
                batch_files.extend(files)
    
    # Items batches (10 files)
    for part in range(1, 6):
        for batch in range(1, 3):
            pattern = f"update_items_fields_part{part}_batch{batch:02d}.sql"
            files = glob.glob(pattern)
            if files:
                batch_files.extend(files)
    
    return batch_files

def main():
    """Main execution function"""

    print_header("🚀 AUTOMATIC BATCH SQL EXECUTION (Supabase API)")

    # Get credentials
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        print_error("Missing Supabase credentials in .env.local")
        print_info("Make sure you have:")
        print("  - VITE_SUPABASE_URL")
        print("  - SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)

    print_success("Credentials loaded from .env.local")
    print_info(f"Supabase URL: {SUPABASE_URL}")

    # Create Supabase client with service role key
    print(f"\n{Colors.CYAN}🔗 Connecting to Supabase...{Colors.RESET}")

    try:
        supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

        # Test connection
        result = supabase.table('drive_sheets_data').select('count', count='exact').execute()
        count = result.count
        print_success("Connected to Supabase successfully!")
        print_info(f"Current restaurants in database: {count}")

    except Exception as e:
        print_error(f"Failed to connect to Supabase: {e}")
        sys.exit(1)

    # Get all batch files
    batch_files = get_batch_files()

    if not batch_files:
        print_error("No batch files found!")
        print_info("Make sure you're running this from the project root directory")
        sys.exit(1)

    print_info(f"Found {len(batch_files)} batch files to execute")

    # Confirm execution
    print(f"\n{Colors.YELLOW}⚠️  WARNING: This will execute {len(batch_files)} SQL files!{Colors.RESET}")
    confirm = input(f"{Colors.YELLOW}Ready to proceed? (yes/no): {Colors.RESET}").strip().lower()

    if confirm != 'yes':
        print_error("Execution cancelled by user")
        sys.exit(0)

    print_header("🚀 Starting Execution")

    # Track progress
    success_count = 0
    fail_count = 0
    start_time = time.time()

    # Execute each file
    for i, file_path in enumerate(batch_files, 1):
        file_name = os.path.basename(file_path)

        print(f"\n{Colors.CYAN}[{i}/{len(batch_files)}] Executing: {file_name}{Colors.RESET}")

        success = execute_sql_file_via_supabase(supabase, file_path, file_name)

        if success:
            success_count += 1
        else:
            fail_count += 1

            # Ask if user wants to continue
            cont = input(f"\n{Colors.YELLOW}⚠️  Errors occurred. Continue? (yes/no): {Colors.RESET}").strip().lower()
            if cont != 'yes':
                print_error("Execution stopped by user")
                break

    # Summary
    total_time = time.time() - start_time

    print_header("📊 EXECUTION SUMMARY")
    print_success(f"Successful: {success_count}")
    print_error(f"Failed: {fail_count}")
    print_info(f"Total time: {total_time / 60:.2f} minutes")

    if fail_count == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 ALL BATCHES EXECUTED SUCCESSFULLY!{Colors.RESET}\n")
        print(f"{Colors.YELLOW}Next steps:{Colors.RESET}")
        print("1. Run verification queries")
        print("2. Test the frontend (npm run dev)")
        print("3. Verify data displays correctly")
    else:
        print(f"\n{Colors.YELLOW}⚠️  Some batches had errors. Check output above.{Colors.RESET}\n")

if __name__ == "__main__":
    main()



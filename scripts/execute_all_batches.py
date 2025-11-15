#!/usr/bin/env python3
"""
Execute All Batch SQL Files Automatically
==========================================
This script executes all 80 batch files directly to Supabase PostgreSQL database.

Uses direct PostgreSQL connection (not Supabase API) for faster execution.

Requirements:
    pip install psycopg2-binary python-dotenv

Usage:
    python scripts/execute_all_batches.py
"""

import os
import sys
import time
import glob
from pathlib import Path
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Color codes for terminal output
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    """Print formatted header"""
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'=' * 70}{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}{text}{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'=' * 70}{Colors.RESET}\n")

def print_success(text):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}")

def print_error(text):
    """Print error message"""
    print(f"{Colors.RED}❌ {text}{Colors.RESET}")

def print_info(text):
    """Print info message"""
    print(f"{Colors.YELLOW}📊 {text}{Colors.RESET}")

def get_db_connection():
    """Create PostgreSQL database connection"""
    
    # Get database password from user
    print(f"{Colors.YELLOW}🔐 Database Password Required{Colors.RESET}")
    print(f"{Colors.YELLOW}Get it from: Supabase Dashboard → Settings → Database → Database Password{Colors.RESET}\n")
    
    db_password = input("Enter your Supabase database password: ").strip()
    
    if not db_password:
        print_error("Password cannot be empty!")
        sys.exit(1)
    
    # Connection configuration
    # Using direct connection (not pooler) for better compatibility
    conn_config = {
        'host': 'aws-0-ap-south-1.pooler.supabase.com',
        'port': 5432,
        'database': 'postgres',
        'user': 'postgres.lqtjghnremwiybqzmprn',
        'password': db_password,
        'sslmode': 'require'
    }
    
    print(f"\n{Colors.CYAN}🔗 Connecting to Supabase PostgreSQL...{Colors.RESET}")
    print(f"   Host: {conn_config['host']}")
    print(f"   Database: {conn_config['database']}")
    print(f"   User: {conn_config['user']}")
    
    try:
        conn = psycopg2.connect(**conn_config)
        print_success("Connected to database successfully!")
        
        # Test connection
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM drive_sheets_data")
        count = cursor.fetchone()[0]
        print_info(f"Current restaurants in database: {count}")
        cursor.close()
        
        return conn
        
    except psycopg2.Error as e:
        print_error(f"Failed to connect to database: {e}")
        print(f"\n{Colors.YELLOW}💡 Troubleshooting:{Colors.RESET}")
        print("   1. Check your database password is correct")
        print("   2. Ensure your IP is allowed in Supabase")
        print("   3. Try using the connection string from Supabase dashboard")
        sys.exit(1)

def execute_sql_file(conn, file_path, file_name):
    """Execute a single SQL file"""
    
    try:
        # Read SQL file
        with open(file_path, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        # Count statements (rough estimate)
        statements = [s.strip() for s in sql.split(';') if s.strip() and not s.strip().startswith('--')]
        print_info(f"Statements to execute: ~{len(statements)}")
        
        start_time = time.time()
        
        # Execute SQL
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        
        duration = time.time() - start_time
        
        print_success(f"Successfully executed {file_name}")
        print_info(f"Duration: {duration:.2f}s")
        
        if cursor.rowcount > 0:
            print_info(f"Rows affected: {cursor.rowcount}")
        
        cursor.close()
        return True

    except psycopg2.Error as e:
        print_error(f"Failed to execute {file_name}")
        print_error(f"Error: {e}")
        conn.rollback()
        return False
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        conn.rollback()
        return False

def get_batch_files():
    """Get all batch files in correct execution order"""

    batch_files = []

    # NCN batches (40 files)
    for part in range(1, 6):  # parts 1-5
        for batch in range(1, 9):  # batches 1-8 (part 5 has only 8)
            pattern = f"update_ncn_fields_part{part}_batch{batch:02d}.sql"
            files = glob.glob(pattern)
            if files:
                batch_files.extend(files)

    # N2R batches (30 files)
    for part in range(1, 6):  # parts 1-5
        for batch in range(1, 7):  # batches 1-6
            pattern = f"update_n2r_fields_part{part}_batch{batch:02d}.sql"
            files = glob.glob(pattern)
            if files:
                batch_files.extend(files)

    # Items batches (10 files)
    for part in range(1, 6):  # parts 1-5
        for batch in range(1, 3):  # batches 1-2
            pattern = f"update_items_fields_part{part}_batch{batch:02d}.sql"
            files = glob.glob(pattern)
            if files:
                batch_files.extend(files)

    return batch_files

def main():
    """Main execution function"""

    print_header("🚀 AUTOMATIC BATCH SQL EXECUTION")

    # Get all batch files
    batch_files = get_batch_files()

    if not batch_files:
        print_error("No batch files found!")
        print_info("Make sure you're running this from the project root directory")
        sys.exit(1)

    print_info(f"Found {len(batch_files)} batch files to execute")
    print()

    # Connect to database
    conn = get_db_connection()

    # Confirm execution
    print(f"\n{Colors.YELLOW}⚠️  WARNING: This will execute {len(batch_files)} SQL files!{Colors.RESET}")
    confirm = input(f"{Colors.YELLOW}Ready to proceed? (yes/no): {Colors.RESET}").strip().lower()

    if confirm != 'yes':
        print_error("Execution cancelled by user")
        conn.close()
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

        success = execute_sql_file(conn, file_path, file_name)

        if success:
            success_count += 1
        else:
            fail_count += 1

            # Ask if user wants to continue
            cont = input(f"\n{Colors.YELLOW}⚠️  Error occurred. Continue? (yes/no): {Colors.RESET}").strip().lower()
            if cont != 'yes':
                print_error("Execution stopped by user")
                break

    # Close connection
    conn.close()
    print(f"\n{Colors.CYAN}🔌 Database connection closed{Colors.RESET}")

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
        print(f"\n{Colors.YELLOW}⚠️  Some batches failed. Check errors above.{Colors.RESET}\n")

if __name__ == "__main__":
    main()



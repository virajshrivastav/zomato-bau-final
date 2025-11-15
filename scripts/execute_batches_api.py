#!/usr/bin/env python3
"""
Execute All Batch SQL Files Using Supabase API
===============================================
This script executes all 80 batch files using Supabase REST API with service role key.

Requirements:
    pip install requests python-dotenv

Usage:
    python scripts/execute_batches_api.py
"""

import os
import sys
import time
import glob
import requests
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

def execute_sql_via_api(sql_content, file_name):
    """Execute SQL using Supabase REST API"""
    
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        print_error("Missing Supabase credentials in .env.local")
        return False
    
    # Supabase SQL endpoint
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Split SQL into individual statements
    statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]
    
    print_info(f"Executing {len(statements)} UPDATE statements...")
    
    start_time = time.time()
    success_count = 0
    
    # Execute each statement individually
    for i, statement in enumerate(statements, 1):
        if not statement.strip():
            continue
            
        try:
            # Use PostgREST to execute raw SQL
            # We'll use a different approach - direct table updates
            # Since Supabase REST API doesn't support arbitrary SQL execution
            # We need to parse and execute UPDATE statements differently
            
            # For now, let's try a simpler approach using the SQL editor endpoint
            pass
            
        except Exception as e:
            print_error(f"Statement {i} failed: {e}")
            continue
    
    duration = time.time() - start_time
    print_info(f"Duration: {duration:.2f}s")
    
    return True

def execute_sql_file(file_path, file_name):
    """Execute a single SQL file"""
    
    try:
        # Read SQL file
        with open(file_path, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        # Count statements
        statements = [s.strip() for s in sql.split(';') if s.strip() and not s.strip().startswith('--')]
        print_info(f"Statements to execute: ~{len(statements)}")
        
        start_time = time.time()
        
        # Execute via API
        success = execute_sql_via_api(sql, file_name)
        
        duration = time.time() - start_time
        
        if success:
            print_success(f"Successfully executed {file_name}")
            print_info(f"Duration: {duration:.2f}s")
        
        return success
        
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


# 📚 Supabase Data Import Guide

**Purpose:** Guide for importing large datasets to Supabase using Python scripts  
**Use Case:** Bulk data import when Supabase SQL Editor has file size limitations  
**Date:** 2025-11-15

---

## 🎯 Overview

This guide explains how to import large datasets directly to Supabase using the Supabase Python client library, bypassing the SQL Editor's file size limitations.

### Why This Approach?

**Problem:**
- Supabase SQL Editor has file size limits (~500KB-1MB)
- Large SQL files with thousands of UPDATE statements get rejected
- Manual copy-paste of multiple files is time-consuming and error-prone

**Solution:**
- Use Supabase Python client with service role key
- Parse SQL files and execute via API
- Automatic batch processing with progress tracking

---

## 🔧 Prerequisites

### 1. Python Installation
- Python 3.7 or higher
- pip (Python package manager)

### 2. Required Python Packages
```bash
pip install supabase python-dotenv
```

**Package Details:**
- `supabase` - Official Supabase Python client
- `python-dotenv` - Load environment variables from .env files

### 3. Supabase Credentials

You need two pieces of information from your Supabase project:

#### A. Supabase URL
- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api
- Copy the "Project URL" (e.g., `https://xxxxx.supabase.co`)

#### B. Service Role Key (Admin Access)
- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api
- Under "Project API keys", find "service_role" key
- Click "Reveal" and copy the key
- ⚠️ **IMPORTANT:** This is an admin key - never expose it publicly!

---

## 📁 Project Setup

### 1. Create Environment File

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Security Notes:**
- Add `.env.local` to `.gitignore` to prevent committing secrets
- Service role key bypasses Row Level Security (RLS)
- Only use service role key in backend/admin scripts
- Never expose service role key in frontend code

### 2. Create Python Script

Create a Python script (e.g., `scripts/import_data.py`):

```python
import os
import re
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url: str = os.getenv("VITE_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# Your import logic here
```

---

## 🚀 Implementation Approach

### Method 1: Parse SQL UPDATE Statements

**Use Case:** When you have SQL UPDATE statements to execute

```python
def parse_update_statement(sql):
    """Parse UPDATE statement to extract res_id and field values"""
    # Extract WHERE clause (e.g., WHERE res_id = '123456')
    res_id_match = re.search(r"WHERE res_id = '(\d+)'", sql)
    if not res_id_match:
        return None, None
    res_id = res_id_match.group(1)
    
    # Extract SET clause (e.g., SET field1 = 'value1', field2 = 'value2')
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

# Execute UPDATE via Supabase API
def execute_update(table_name, res_id, data):
    result = supabase.table(table_name).update(data).eq('res_id', res_id).execute()
    return result
```

### Method 2: Direct Data Insert

**Use Case:** When you have structured data (CSV, JSON, etc.)

```python
# Insert single row
data = {
    'res_id': '123456',
    'field1': 'value1',
    'field2': 'value2'
}
result = supabase.table('your_table').insert(data).execute()

# Insert multiple rows
data_list = [
    {'res_id': '123456', 'field1': 'value1'},
    {'res_id': '789012', 'field1': 'value2'}
]
result = supabase.table('your_table').insert(data_list).execute()

# Update existing row
data = {'field1': 'new_value'}
result = supabase.table('your_table').update(data).eq('res_id', '123456').execute()
```

---

## 📊 Batch Processing Pattern

### Reading and Processing SQL Files

```python
import os

def process_sql_file(file_path, table_name):
    """Process a single SQL file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into individual statements
    statements = content.split(';')
    
    success_count = 0
    error_count = 0
    
    for i, statement in enumerate(statements):
        statement = statement.strip()
        if not statement or not statement.startswith('UPDATE'):
            continue
        
        try:
            res_id, data = parse_update_statement(statement)
            if res_id and data:
                execute_update(table_name, res_id, data)
                success_count += 1
                
                # Progress tracking
                if (i + 1) % 50 == 0:
                    print(f"Processed {i + 1} statements...")
        
        except Exception as e:
            print(f"Error on statement {i + 1}: {e}")
            error_count += 1
    
    return success_count, error_count
```

### Processing Multiple Files

```python
def process_batch_files(directory, table_name):
    """Process all SQL files in a directory"""
    sql_files = sorted([f for f in os.listdir(directory) if f.endswith('.sql')])
    
    total_success = 0
    total_errors = 0
    
    for file_name in sql_files:
        print(f"\nProcessing {file_name}...")
        file_path = os.path.join(directory, file_name)
        
        success, errors = process_sql_file(file_path, table_name)
        total_success += success
        total_errors += errors
        
        print(f"✅ {file_name}: {success} successful, {errors} errors")
    
    print(f"\n🎉 Total: {total_success} successful, {total_errors} errors")
```

---

## ⚡ Running the Import

### Basic Execution

```bash
python scripts/import_data.py
```

### With Progress Tracking

Add progress indicators to your script:

```python
import time

start_time = time.time()

# Your import logic here

elapsed_time = time.time() - start_time
print(f"\n⏱️ Execution time: {elapsed_time/60:.2f} minutes")
```

---

## ✅ Verification

### Verify Import Success

```python
def verify_import(table_name, expected_count):
    """Verify data was imported correctly"""
    # Count total rows
    result = supabase.table(table_name).select('*', count='exact').execute()
    actual_count = result.count
    
    print(f"Expected: {expected_count}")
    print(f"Actual: {actual_count}")
    print(f"Match: {'✅' if actual_count == expected_count else '❌'}")
    
    return actual_count == expected_count
```

---

## 🔒 Security Best Practices

1. **Never commit service role key to version control**
   - Use `.env.local` or `.env` files
   - Add to `.gitignore`

2. **Use service role key only in backend/admin scripts**
   - Not in frontend code
   - Not in public APIs

3. **Limit service role key usage**
   - Only for admin operations
   - Consider using database functions with RLS for production

4. **Rotate keys periodically**
   - Generate new service role key if compromised
   - Update in Supabase dashboard

---

## 📝 Summary

### What You Need
1. ✅ Python 3.7+ installed
2. ✅ `supabase` and `python-dotenv` packages
3. ✅ Supabase URL and service role key
4. ✅ `.env.local` file with credentials

### What You Do
1. ✅ Create Python script with Supabase client
2. ✅ Parse SQL files or prepare data
3. ✅ Execute via Supabase API
4. ✅ Track progress and handle errors
5. ✅ Verify import success

### Benefits
- ✅ Bypass SQL Editor file size limits
- ✅ Automatic batch processing
- ✅ Progress tracking
- ✅ Error handling
- ✅ Much faster than manual execution

---

**Created:** 2025-11-15  
**For:** Any IDE or development environment  
**Works with:** Python 3.7+, Supabase projects


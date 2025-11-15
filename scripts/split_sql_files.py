#!/usr/bin/env python3
"""
Split large SQL files into smaller chunks for Supabase SQL Editor.

This script splits each of the 4 main SQL files into 5 smaller files:
- insert_base_restaurants.sql → insert_base_restaurants_part1.sql to part5.sql
- update_ncn_fields.sql → update_ncn_fields_part1.sql to part5.sql
- update_n2r_fields.sql → update_n2r_fields_part1.sql to part5.sql
- update_items_fields.sql → update_items_fields_part1.sql to part5.sql

Total: 20 smaller SQL files (4 files × 5 parts each)
"""

import os
import re
from pathlib import Path

# Configuration
NUM_PARTS = 5
ROOT_DIR = Path(__file__).parent.parent

# Files to split
SQL_FILES = [
    {
        'name': 'insert_base_restaurants.sql',
        'pattern': r'^INSERT INTO drive_sheets_data',
        'description': 'Base Restaurant Inserts'
    },
    {
        'name': 'update_ncn_fields.sql',
        'pattern': r'^UPDATE drive_sheets_data',
        'description': 'NCN Field Updates'
    },
    {
        'name': 'update_n2r_fields.sql',
        'pattern': r'^UPDATE drive_sheets_data',
        'description': 'N2R Field Updates'
    },
    {
        'name': 'update_items_fields.sql',
        'pattern': r'^UPDATE drive_sheets_data',
        'description': 'Items Field Updates'
    }
]


def extract_statements(file_path, pattern):
    """
    Extract individual SQL statements from a file.
    
    Args:
        file_path: Path to SQL file
        pattern: Regex pattern to identify statement start
        
    Returns:
        tuple: (header_lines, statements_list)
    """
    print(f"  📖 Reading {file_path.name}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    header = []
    statements = []
    current_statement = []
    in_header = True
    
    pattern_re = re.compile(pattern)
    
    for line in lines:
        # Collect header (comments at the beginning)
        if in_header and line.strip().startswith('--'):
            header.append(line)
            continue
        elif in_header and line.strip() == '':
            header.append(line)
            continue
        else:
            in_header = False
        
        # Check if this is the start of a new statement
        if pattern_re.match(line):
            # Save previous statement if exists
            if current_statement:
                statements.append(''.join(current_statement))
            # Start new statement
            current_statement = [line]
        else:
            # Continue current statement
            current_statement.append(line)
    
    # Don't forget the last statement
    if current_statement:
        statements.append(''.join(current_statement))
    
    print(f"  ✅ Found {len(statements)} statements")
    return header, statements


def split_into_parts(statements, num_parts):
    """
    Split statements into equal parts.
    
    Args:
        statements: List of SQL statements
        num_parts: Number of parts to split into
        
    Returns:
        list: List of statement groups
    """
    total = len(statements)
    chunk_size = (total + num_parts - 1) // num_parts  # Ceiling division
    
    parts = []
    for i in range(num_parts):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, total)
        parts.append(statements[start_idx:end_idx])
    
    return parts


def write_part_file(output_path, header, statements, part_num, total_parts, description):
    """
    Write a part file with header and statements.
    
    Args:
        output_path: Path to output file
        header: Header lines from original file
        statements: List of statements for this part
        part_num: Current part number (1-based)
        total_parts: Total number of parts
        description: Description of what this file contains
    """
    with open(output_path, 'w', encoding='utf-8') as f:
        # Write modified header
        f.write(f"-- ============================================\n")
        f.write(f"-- {description} - Part {part_num} of {total_parts}\n")
        f.write(f"-- Statements in this part: {len(statements)}\n")
        f.write(f"-- ============================================\n\n")
        
        # Write statements
        for stmt in statements:
            f.write(stmt)
            if not stmt.endswith('\n\n'):
                f.write('\n')
    
    print(f"  ✅ Created {output_path.name} ({len(statements)} statements)")


def split_sql_file(file_info):
    """
    Split a single SQL file into multiple parts.
    
    Args:
        file_info: Dictionary with file information
    """
    file_path = ROOT_DIR / file_info['name']
    
    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        return
    
    print(f"\n{'='*70}")
    print(f"📄 Processing: {file_info['name']}")
    print(f"{'='*70}")
    
    # Extract statements
    header, statements = extract_statements(file_path, file_info['pattern'])
    
    if not statements:
        print(f"  ⚠️  No statements found in {file_info['name']}")
        return
    
    # Split into parts
    parts = split_into_parts(statements, NUM_PARTS)
    
    # Write part files
    base_name = file_path.stem  # filename without extension
    for i, part_statements in enumerate(parts, 1):
        if not part_statements:
            continue
            
        output_name = f"{base_name}_part{i}.sql"
        output_path = ROOT_DIR / output_name
        
        write_part_file(
            output_path,
            header,
            part_statements,
            i,
            NUM_PARTS,
            file_info['description']
        )


def main():
    """Main execution function."""
    print("\n" + "="*70)
    print("🔪 SQL FILE SPLITTER")
    print("="*70)
    print(f"📂 Working directory: {ROOT_DIR}")
    print(f"🔢 Splitting each file into {NUM_PARTS} parts")
    print("="*70)
    
    total_files = 0
    
    for file_info in SQL_FILES:
        split_sql_file(file_info)
        total_files += NUM_PARTS
    
    print("\n" + "="*70)
    print("✅ SPLITTING COMPLETE")
    print("="*70)
    print(f"📊 Total files created: {total_files}")
    print("\n📋 Execution order in Supabase SQL Editor:")
    print("\n1️⃣  Base Restaurant Inserts (5 files):")
    for i in range(1, NUM_PARTS + 1):
        print(f"   - insert_base_restaurants_part{i}.sql")
    
    print("\n2️⃣  NCN Field Updates (5 files):")
    for i in range(1, NUM_PARTS + 1):
        print(f"   - update_ncn_fields_part{i}.sql")
    
    print("\n3️⃣  N2R Field Updates (5 files):")
    for i in range(1, NUM_PARTS + 1):
        print(f"   - update_n2r_fields_part{i}.sql")
    
    print("\n4️⃣  Items Field Updates (5 files):")
    for i in range(1, NUM_PARTS + 1):
        print(f"   - update_items_fields_part{i}.sql")
    
    print("\n5️⃣  Verification:")
    print("   - verify_import.sql (run this last)")
    
    print("\n🔗 Supabase SQL Editor:")
    print("   https://supabase.com/dashboard/project/lqtjghnremwiybqzmprn/sql/new")
    print("\n" + "="*70)


if __name__ == '__main__':
    main()


#!/usr/bin/env python3
"""
Split all large SQL update files into smaller batches for Supabase SQL Editor
Handles NCN, N2R, and Items update files
"""

import os
import re

def split_sql_file(input_file, statements_per_batch=200, file_type=""):
    """Split a large SQL file into smaller batches"""
    
    print(f"\n📂 Processing: {input_file}")
    
    # Read the file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract part number from filename (e.g., part1, part2, etc.)
    part_match = re.search(r'part(\d+)', input_file)
    if not part_match:
        print(f"❌ Could not extract part number from {input_file}")
        return
    
    part_num = part_match.group(1)
    
    # Split by UPDATE statements
    statements = re.split(r'(?=UPDATE drive_sheets_data)', content)
    
    # Remove header/empty parts
    statements = [s.strip() for s in statements if 'UPDATE drive_sheets_data' in s]
    
    total_statements = len(statements)
    print(f"   Total UPDATE statements: {total_statements}")
    
    # Calculate number of batches needed
    num_batches = (total_statements + statements_per_batch - 1) // statements_per_batch
    print(f"   Splitting into {num_batches} batches ({statements_per_batch} statements each)")
    
    # Create batches
    for batch_num in range(num_batches):
        start_idx = batch_num * statements_per_batch
        end_idx = min((batch_num + 1) * statements_per_batch, total_statements)
        
        batch_statements = statements[start_idx:end_idx]
        
        # Create output filename
        output_file = f"update_{file_type}_fields_part{part_num}_batch{batch_num + 1:02d}.sql"
        
        # Write batch file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"-- ============================================\n")
            f.write(f"-- {file_type.upper()} Field Updates - Part {part_num}, Batch {batch_num + 1} of {num_batches}\n")
            f.write(f"-- Statements: {start_idx + 1} to {end_idx}\n")
            f.write(f"-- Total statements in this batch: {len(batch_statements)}\n")
            f.write(f"-- ============================================\n\n")
            
            f.write('\n\n'.join(batch_statements))
            f.write('\n')
        
        file_size_kb = os.path.getsize(output_file) / 1024
        print(f"   ✅ Created: {output_file} ({len(batch_statements)} statements, {file_size_kb:.1f}KB)")

def main():
    print("🔄 Splitting Large SQL Update Files into Smaller Batches")
    print("=" * 70)
    
    # Configuration for each file type
    configs = [
        {
            'pattern': 'update_ncn_fields_part',
            'type': 'ncn',
            'statements_per_batch': 150  # NCN files are huge, use smaller batches
        },
        {
            'pattern': 'update_n2r_fields_part',
            'type': 'n2r',
            'statements_per_batch': 200
        },
        {
            'pattern': 'update_items_fields_part',
            'type': 'items',
            'statements_per_batch': 200
        }
    ]
    
    for config in configs:
        pattern = config['pattern']
        file_type = config['type']
        statements_per_batch = config['statements_per_batch']
        
        # Find all files matching this pattern (exclude already batched files)
        files = [f for f in os.listdir('.') 
                if f.startswith(pattern) 
                and f.endswith('.sql') 
                and 'batch' not in f]
        files.sort()
        
        if not files:
            print(f"\n⚠️  No {file_type.upper()} files found to split")
            continue
        
        print(f"\n{'=' * 70}")
        print(f"📦 Processing {file_type.upper()} Files ({len(files)} files)")
        print(f"{'=' * 70}")
        
        for file in files:
            split_sql_file(file, statements_per_batch, file_type)
    
    print("\n" + "=" * 70)
    print("✅ All files split successfully!")
    print("\n📊 Summary:")
    
    # Count batch files created
    ncn_batches = len([f for f in os.listdir('.') if 'update_ncn_fields_part' in f and 'batch' in f])
    n2r_batches = len([f for f in os.listdir('.') if 'update_n2r_fields_part' in f and 'batch' in f])
    items_batches = len([f for f in os.listdir('.') if 'update_items_fields_part' in f and 'batch' in f])
    
    print(f"   NCN batches created: {ncn_batches}")
    print(f"   N2R batches created: {n2r_batches}")
    print(f"   Items batches created: {items_batches}")
    print(f"   Total batch files: {ncn_batches + n2r_batches + items_batches}")

if __name__ == "__main__":
    main()


#!/usr/bin/env python3
"""
Split N2R update files into smaller batches for Supabase SQL Editor
Each batch will contain ~200 UPDATE statements (~5000 lines)
"""

import os
import re

def split_n2r_file(input_file, statements_per_batch=200):
    """Split a large N2R SQL file into smaller batches"""
    
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
        output_file = f"update_n2r_fields_part{part_num}_batch{batch_num + 1:02d}.sql"
        
        # Write batch file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"-- ============================================\n")
            f.write(f"-- N2R Field Updates - Part {part_num}, Batch {batch_num + 1} of {num_batches}\n")
            f.write(f"-- Statements: {start_idx + 1} to {end_idx}\n")
            f.write(f"-- Total statements in this batch: {len(batch_statements)}\n")
            f.write(f"-- ============================================\n\n")
            
            f.write('\n\n'.join(batch_statements))
            f.write('\n')
        
        print(f"   ✅ Created: {output_file} ({len(batch_statements)} statements)")

def main():
    print("🔄 Splitting N2R Update Files into Smaller Batches")
    print("=" * 60)
    
    # Find all N2R part files
    n2r_files = [f for f in os.listdir('.') if f.startswith('update_n2r_fields_part') and f.endswith('.sql') and 'batch' not in f]
    n2r_files.sort()
    
    if not n2r_files:
        print("❌ No N2R part files found!")
        return
    
    print(f"Found {len(n2r_files)} N2R part files to split")
    
    for file in n2r_files:
        split_n2r_file(file, statements_per_batch=200)
    
    print("\n" + "=" * 60)
    print("✅ All N2R files split successfully!")
    print("\n📋 Next Steps:")
    print("1. Delete the old large N2R part files (part1.sql to part5.sql)")
    print("2. Execute the new batch files in order (part1_batch01.sql, part1_batch02.sql, etc.)")
    print("3. Each batch file should be small enough for Supabase SQL Editor")

if __name__ == "__main__":
    main()


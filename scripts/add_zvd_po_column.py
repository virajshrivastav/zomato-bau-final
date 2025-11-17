"""
Add ZVD PO Column to Database
==============================
This script adds the zvd_po column to the drive_sheets_data table.

Usage:
    python scripts/add_zvd_po_column.py
"""

import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Supabase credentials
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: Missing Supabase credentials in .env.local")
    sys.exit(1)

supabase: Client = create_client(url, key)


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)


def add_zvd_po_column():
    """Add zvd_po column to drive_sheets_data table"""
    print_header("Adding ZVD PO Column to Database")
    
    sql = """
    ALTER TABLE drive_sheets_data
    ADD COLUMN IF NOT EXISTS zvd_po TEXT;
    """
    
    try:
        print("📋 Executing SQL to add zvd_po column...")
        print(sql)
        
        # Execute the SQL
        result = supabase.rpc('exec_sql', {'sql': sql}).execute()
        
        print("✅ Column added successfully!")
        return True
        
    except Exception as e:
        error_msg = str(e)
        
        # Check if column already exists
        if "already exists" in error_msg.lower() or "duplicate column" in error_msg.lower():
            print("✅ Column already exists - no action needed")
            return True
        else:
            print(f"❌ Error: {error_msg}")
            return False


def verify_column():
    """Verify that the column was added"""
    print_header("Verifying Column")
    
    try:
        # Try to select the column
        result = supabase.table('drive_sheets_data')\
            .select('res_id, zvd_po')\
            .limit(1)\
            .execute()
        
        print("✅ Column verified - zvd_po exists in drive_sheets_data table")
        return True
        
    except Exception as e:
        print(f"❌ Verification failed: {str(e)}")
        return False


def main():
    """Main execution function"""
    print_header("ZVD PO Column Setup")
    
    try:
        # Add column
        if add_zvd_po_column():
            # Verify
            if verify_column():
                print_header("✅ SUCCESS")
                print("The zvd_po column has been added to the database.")
                print("\n🎯 Next Step:")
                print("   Run: python scripts/execute_zvd_po_import.py")
                print("   Or execute: update_zvd_po_data.sql")
            else:
                print_header("⚠️  WARNING")
                print("Column may have been added but verification failed.")
        else:
            print_header("❌ FAILED")
            print("Could not add the zvd_po column.")
            sys.exit(1)
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()


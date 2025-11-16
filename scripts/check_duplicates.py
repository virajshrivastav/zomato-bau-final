"""
Check for Duplicate Emails in CSVs
===================================
This script checks for duplicate KAM emails in the CSV files.

Usage:
    python scripts/check_duplicates.py
"""

import pandas as pd
from collections import Counter

# File paths
NCN_CSV = "performance-metrics/Dashboard Context data Drives - NCN Coverage Summary .csv"
N2R_CSV = "performance-metrics/Dashboard Context data Drives - N2R Summary.csv"
ITEMS_CSV = "performance-metrics/Dashboard Context data Drives - Input Summary.csv"


def safe_str(value):
    """Convert value to string, handling None, NaN, and empty values."""
    if value is None or pd.isna(value):
        return None
    str_value = str(value).strip()
    if str_value.lower() in ['none', 'nan', 'null', 'n/a', '']:
        return None
    return str_value


def is_valid_email(email):
    """Check if email is a valid Zomato email."""
    if email is None:
        return False
    return '@zomato.com' in email.lower()


def check_csv_duplicates(csv_path, skiprows, csv_name):
    """Check for duplicate emails in a CSV file"""
    print(f"\n{'='*70}")
    print(f"  Checking {csv_name}")
    print(f"{'='*70}")
    
    df = pd.read_csv(csv_path, skiprows=skiprows, encoding='utf-8')
    
    emails = []
    for _, row in df.iterrows():
        email = safe_str(row.iloc[1])  # Column B
        if is_valid_email(email):
            emails.append(email)
    
    print(f"Total valid emails: {len(emails)}")
    
    # Count duplicates
    email_counts = Counter(emails)
    duplicates = {email: count for email, count in email_counts.items() if count > 1}
    
    if duplicates:
        print(f"\n⚠️  Found {len(duplicates)} duplicate emails:")
        for email, count in sorted(duplicates.items()):
            print(f"   - {email}: appears {count} times")
    else:
        print(f"✅ No duplicates found!")
    
    return duplicates


def main():
    print("="*70)
    print("  DUPLICATE EMAIL CHECKER")
    print("="*70)
    
    ncn_dups = check_csv_duplicates(NCN_CSV, 2, "NCN Coverage Summary")
    n2r_dups = check_csv_duplicates(N2R_CSV, 2, "N2R Summary")
    items_dups = check_csv_duplicates(ITEMS_CSV, 4, "Items Summary")
    
    print("\n" + "="*70)
    print("  SUMMARY")
    print("="*70)
    print(f"NCN duplicates: {len(ncn_dups)}")
    print(f"N2R duplicates: {len(n2r_dups)}")
    print(f"Items duplicates: {len(items_dups)}")
    
    if ncn_dups or n2r_dups or items_dups:
        print("\n💡 Solution: Import script will keep only the LAST occurrence of each email")
    else:
        print("\n✅ All CSVs are clean!")


if __name__ == "__main__":
    main()


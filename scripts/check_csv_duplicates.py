import pandas as pd

# Read NCN CSV
df = pd.read_csv('performance-metrics/Dashboard Context data Drives - NCN Coverage Summary .csv', skiprows=2, encoding='utf-8')

# Get email column (column B, index 1)
emails = df.iloc[:, 1].dropna()

# Filter out non-email values
emails = emails[emails.astype(str).str.contains('@', na=False)]

print(f"Total rows in CSV: {len(df)}")
print(f"Rows with email: {len(emails)}")
print(f"Unique emails: {len(emails.unique())}")
print(f"Duplicate emails: {len(emails) - len(emails.unique())}")

# Check for duplicates
if len(emails) != len(emails.unique()):
    print("\nDuplicate emails found:")
    duplicates = emails[emails.duplicated(keep=False)].sort_values()
    for email in duplicates.unique():
        count = (emails == email).sum()
        print(f"  {email}: {count} times")
else:
    print("\n✅ No duplicates found")

print(f"\nExpected in database: {len(emails.unique())}")
print(f"Actually in database: 53")
print(f"Difference: {len(emails.unique()) - 53}")


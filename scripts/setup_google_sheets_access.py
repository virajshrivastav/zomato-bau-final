"""
Interactive Google Sheets Access Setup
=======================================
This script guides you through setting up Google Sheets access.

Usage:
    python scripts/setup_google_sheets_access.py
"""

import os
import json

SHEET_URL = "https://docs.google.com/spreadsheets/d/1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ/edit?gid=25988507"
CREDENTIALS_FILE = "service-account-credentials.json"

def print_header(text):
    print("\n" + "="*70)
    print(text)
    print("="*70 + "\n")

def print_step(number, text):
    print(f"\n{'='*70}")
    print(f"STEP {number}: {text}")
    print(f"{'='*70}\n")

def check_credentials():
    """Check if service account credentials exist."""
    if os.path.exists(CREDENTIALS_FILE):
        try:
            with open(CREDENTIALS_FILE, 'r') as f:
                creds = json.load(f)
                email = creds.get('client_email', 'Unknown')
                project = creds.get('project_id', 'Unknown')
                return True, email, project
        except:
            return False, None, None
    return False, None, None

def main():
    print_header("🚀 GOOGLE SHEETS ACCESS SETUP WIZARD")
    
    print("This wizard will help you set up access to your Google Sheet.")
    print(f"\nTarget Sheet: {SHEET_URL}")
    
    # Check if credentials already exist
    has_creds, email, project = check_credentials()
    
    if has_creds:
        print_header("✅ SERVICE ACCOUNT CREDENTIALS FOUND!")
        print(f"📧 Service Account Email: {email}")
        print(f"📁 Project ID: {project}")
        print(f"📄 Credentials File: {CREDENTIALS_FILE}")
        
        print("\n" + "="*70)
        print("NEXT STEPS:")
        print("="*70)
        print("\n1. Make sure you've shared the Google Sheet with this email:")
        print(f"   {email}")
        print("\n2. To share the sheet:")
        print(f"   a. Open: {SHEET_URL}")
        print("   b. Click 'Share' button (top right)")
        print(f"   c. Add: {email}")
        print("   d. Set permission: 'Editor' (for read/write) or 'Viewer' (for read-only)")
        print("   e. Uncheck 'Notify people'")
        print("   f. Click 'Share'")
        
        print("\n3. Test the connection:")
        print("   python scripts/access_sheet_with_service_account.py")
        
        return
    
    # No credentials found - guide user through setup
    print_header("❌ NO SERVICE ACCOUNT CREDENTIALS FOUND")
    
    print("You need to create a Google Service Account to access the sheet.")
    print("\nThis will take about 10 minutes and requires:")
    print("  ✓ Access to Google Cloud Console")
    print("  ✓ Permission to create service accounts")
    print("  ✓ Permission to share the Google Sheet")
    
    print_step(1, "Open Google Cloud Console")
    print("1. Go to: https://console.cloud.google.com/")
    print("2. Sign in with your Google account")
    print("3. Select project: 'zomato-drive-dashboard'")
    print("   (This is your existing OAuth project)")
    
    print_step(2, "Enable Google Sheets API")
    print("1. In left sidebar: APIs & Services → Library")
    print("2. Search: 'Google Sheets API'")
    print("3. Click on it and click 'Enable'")
    
    print_step(3, "Create Service Account")
    print("1. In left sidebar: APIs & Services → Credentials")
    print("2. Click: '+ CREATE CREDENTIALS' → 'Service Account'")
    print("3. Fill in:")
    print("   - Name: sheets-access")
    print("   - Description: Service account for Google Sheets access")
    print("4. Click 'CREATE AND CONTINUE'")
    print("5. Skip optional steps, click 'DONE'")
    
    print_step(4, "Download JSON Credentials")
    print("1. Click on the service account email you just created")
    print("2. Go to 'KEYS' tab")
    print("3. Click 'ADD KEY' → 'Create new key'")
    print("4. Select 'JSON' format")
    print("5. Click 'CREATE'")
    print("6. A JSON file will download")
    
    print_step(5, "Save Credentials File")
    print(f"1. Rename the downloaded file to: {CREDENTIALS_FILE}")
    print(f"2. Move it to: {os.path.abspath('.')}")
    print("3. The file should be at:")
    print(f"   {os.path.abspath(CREDENTIALS_FILE)}")
    
    print_step(6, "Share Google Sheet")
    print("1. Open the downloaded JSON file")
    print("2. Find the 'client_email' field")
    print("3. Copy that email address")
    print(f"4. Open: {SHEET_URL}")
    print("5. Click 'Share' button")
    print("6. Paste the service account email")
    print("7. Set permission: 'Editor' (for read/write)")
    print("8. Uncheck 'Notify people'")
    print("9. Click 'Share'")
    
    print_step(7, "Test Connection")
    print("After completing steps 1-6, run:")
    print("  python scripts/access_sheet_with_service_account.py")
    
    print_header("📚 DETAILED GUIDE")
    print("For detailed instructions with screenshots, see:")
    print("  GOOGLE-SHEETS-SERVICE-ACCOUNT-SETUP.md")
    
    print_header("🆘 NEED HELP?")
    print("If you get stuck:")
    print("1. Check GOOGLE-SHEETS-ACCESS-QUICK-START.md")
    print("2. Run this script again after placing the credentials file")
    print("3. Ask for help with the specific error message")

if __name__ == "__main__":
    main()


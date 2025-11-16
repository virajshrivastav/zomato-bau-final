"""
Find Google Service Account Credentials
========================================
This script helps you locate the service account JSON file.

Usage:
    python scripts/find_credentials.py
"""

import os
import json
from pathlib import Path

def check_file(filepath):
    """Check if a file is a valid service account credentials file."""
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            if 'client_email' in data and 'private_key' in data:
                return True, data.get('client_email'), data.get('project_id')
    except:
        pass
    return False, None, None

def search_current_dir():
    """Search for JSON files in current directory."""
    print("\n" + "="*70)
    print("🔍 SEARCHING FOR SERVICE ACCOUNT CREDENTIALS")
    print("="*70 + "\n")
    
    print("Searching in current directory...")
    current_dir = Path('.')
    
    json_files = list(current_dir.glob('*.json'))
    
    if not json_files:
        print("❌ No JSON files found in current directory")
        return None
    
    print(f"Found {len(json_files)} JSON files:\n")
    
    service_account_files = []
    
    for json_file in json_files:
        is_service_account, email, project = check_file(json_file)
        
        if is_service_account:
            print(f"✅ SERVICE ACCOUNT FOUND: {json_file.name}")
            print(f"   📧 Email: {email}")
            print(f"   📁 Project: {project}")
            service_account_files.append((json_file, email, project))
        else:
            print(f"   {json_file.name} (not a service account)")
    
    return service_account_files

def search_downloads():
    """Search for JSON files in Downloads folder."""
    print("\n" + "="*70)
    print("🔍 SEARCHING DOWNLOADS FOLDER")
    print("="*70 + "\n")
    
    downloads_paths = [
        Path.home() / 'Downloads',
        Path('C:/Users') / os.getenv('USERNAME', '') / 'Downloads',
    ]
    
    for downloads_path in downloads_paths:
        if downloads_path.exists():
            print(f"Searching in: {downloads_path}")
            
            # Look for recently modified JSON files
            json_files = list(downloads_path.glob('*.json'))
            
            if json_files:
                # Sort by modification time (newest first)
                json_files.sort(key=lambda x: x.stat().st_mtime, reverse=True)
                
                print(f"Found {len(json_files)} JSON files (showing newest 10):\n")
                
                for json_file in json_files[:10]:
                    is_service_account, email, project = check_file(json_file)
                    
                    if is_service_account:
                        print(f"✅ SERVICE ACCOUNT: {json_file.name}")
                        print(f"   📧 Email: {email}")
                        print(f"   📁 Project: {project}")
                        print(f"   📍 Location: {json_file}")
                        return json_file
                    else:
                        # Show file info
                        mod_time = json_file.stat().st_mtime
                        from datetime import datetime
                        mod_date = datetime.fromtimestamp(mod_time).strftime('%Y-%m-%d %H:%M:%S')
                        print(f"   {json_file.name} (modified: {mod_date})")
    
    return None

def main():
    print("\n" + "="*70)
    print("🔍 GOOGLE SERVICE ACCOUNT CREDENTIALS FINDER")
    print("="*70)
    
    # Check current directory first
    service_accounts = search_current_dir()
    
    if service_accounts:
        print("\n" + "="*70)
        print("✅ FOUND SERVICE ACCOUNT CREDENTIALS!")
        print("="*70 + "\n")
        
        for filepath, email, project in service_accounts:
            if filepath.name != 'service-account-credentials.json':
                print(f"📝 To use this file, rename it to: service-account-credentials.json")
                print(f"\nCommand to rename:")
                print(f"   Rename-Item '{filepath.name}' 'service-account-credentials.json'")
            else:
                print("✅ File is already named correctly!")
            
            print(f"\n📋 NEXT STEP: Share the Google Sheet with this email:")
            print(f"   {email}")
            print(f"\n🔗 Sheet URL:")
            print(f"   https://docs.google.com/spreadsheets/d/1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ/edit")
            print(f"\n📝 How to share:")
            print(f"   1. Open the sheet URL above")
            print(f"   2. Click 'Share' button (top right)")
            print(f"   3. Paste the email: {email}")
            print(f"   4. Set permission: 'Editor'")
            print(f"   5. Uncheck 'Notify people'")
            print(f"   6. Click 'Share'")
        
        return
    
    # Search Downloads folder
    found_file = search_downloads()
    
    if found_file:
        print("\n" + "="*70)
        print("✅ FOUND SERVICE ACCOUNT IN DOWNLOADS!")
        print("="*70 + "\n")
        print(f"📍 Location: {found_file}")
        print(f"\n📝 To use this file:")
        print(f"   1. Copy it to: {Path('.').absolute()}")
        print(f"   2. Rename to: service-account-credentials.json")
        print(f"\nCommand:")
        print(f"   Copy-Item '{found_file}' 'service-account-credentials.json'")
    else:
        print("\n" + "="*70)
        print("❌ NO SERVICE ACCOUNT CREDENTIALS FOUND")
        print("="*70 + "\n")
        print("Please check:")
        print("1. Did you download the JSON file from Google Cloud Console?")
        print("2. Where did you save it?")
        print("3. What is the filename?")
        print("\nIf you haven't created it yet, follow:")
        print("   GOOGLE-SHEETS-SERVICE-ACCOUNT-SETUP.md")

if __name__ == "__main__":
    main()


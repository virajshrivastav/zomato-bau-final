"""
Detailed Google Sheets Structure Report
========================================
Generate a comprehensive report of the current Google Sheets structure.

Usage:
    python scripts/detailed_sheets_report.py
"""

import os
import sys
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
import gspread
import json

# Load environment variables
load_dotenv('.env.local')

# Configuration
SHEET_ID = '1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ'
CREDENTIALS_FILE = 'service-account-credentials.json'

# Google Sheets API scope
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]


def get_google_sheets_client():
    """Initialize Google Sheets client."""
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"❌ Credentials file not found: {CREDENTIALS_FILE}")
        sys.exit(1)
    
    credentials = Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=SCOPES
    )
    return gspread.authorize(credentials)


def analyze_tab(client, tab_name):
    """Analyze a specific tab in detail."""
    try:
        spreadsheet = client.open_by_key(SHEET_ID)
        worksheet = None
        
        # Find the worksheet
        for ws in spreadsheet.worksheets():
            if ws.title == tab_name:
                worksheet = ws
                break
        
        if not worksheet:
            return None
        
        # Get all data
        all_values = worksheet.get_all_values()
        
        if not all_values:
            return {
                'tab_name': tab_name,
                'title_row': '',
                'headers': [],
                'total_rows': 0,
                'total_cols': 0,
                'data_rows': 0
            }
        
        # Determine structure
        title_row = all_values[0] if len(all_values) > 0 else []
        headers = all_values[1] if len(all_values) > 1 else []
        
        return {
            'tab_name': tab_name,
            'title_row': title_row[0] if title_row else '',
            'headers': headers,
            'total_rows': len(all_values),
            'total_cols': len(headers),
            'data_rows': len(all_values) - 2 if len(all_values) > 2 else 0
        }
        
    except Exception as e:
        print(f"❌ Error analyzing {tab_name}: {str(e)}")
        return None


def main():
    """Main function."""
    print("\n" + "="*80)
    print("📊 DETAILED GOOGLE SHEETS STRUCTURE REPORT")
    print("="*80)
    
    # Initialize client
    print("\n🔐 Initializing Google Sheets client...")
    client = get_google_sheets_client()
    print("✅ Client initialized")
    
    # Get spreadsheet
    spreadsheet = client.open_by_key(SHEET_ID)
    all_tabs = [ws.title for ws in spreadsheet.worksheets()]
    
    print(f"\n📄 Spreadsheet: {spreadsheet.title}")
    print(f"   URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit")
    print(f"   Total Tabs: {len(all_tabs)}")
    
    # Analyze each tab
    results = {}
    for tab in all_tabs:
        result = analyze_tab(client, tab)
        if result:
            results[tab] = result
    
    # Generate detailed report
    print("\n" + "="*80)
    print("📋 DETAILED TAB ANALYSIS")
    print("="*80)
    
    for tab_name, data in results.items():
        print(f"\n{'='*80}")
        print(f"📑 TAB: {tab_name}")
        print('='*80)
        print(f"Title Row: {data['title_row']}")
        print(f"Total Rows: {data['total_rows']}")
        print(f"Total Columns: {data['total_cols']}")
        print(f"Data Rows: {data['data_rows']}")
        
        print(f"\n📋 HEADERS ({len(data['headers'])} columns):")
        for i, header in enumerate(data['headers'], 1):
            if header:  # Only show non-empty headers
                print(f"   {i:2d}. {header}")
    
    # Summary
    print("\n" + "="*80)
    print("📊 SUMMARY")
    print("="*80)
    
    for tab_name, data in results.items():
        print(f"\n✅ {tab_name}")
        print(f"   Columns: {data['total_cols']}")
        print(f"   Headers: {', '.join([h for h in data['headers'] if h][:5])}...")
    
    print("\n🎉 Report generated successfully!")
    
    # Save to file
    output_file = "GOOGLE-SHEETS-CURRENT-STRUCTURE.md"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Google Sheets Current Structure\n\n")
        f.write(f"**Generated**: {spreadsheet.title}\n")
        f.write(f"**Sheet ID**: {SHEET_ID}\n")
        f.write(f"**URL**: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit\n\n")
        f.write("---\n\n")
        
        for tab_name, data in results.items():
            f.write(f"## Tab: {tab_name}\n\n")
            f.write(f"**Title**: {data['title_row']}\n")
            f.write(f"**Total Rows**: {data['total_rows']}\n")
            f.write(f"**Total Columns**: {data['total_cols']}\n")
            f.write(f"**Data Rows**: {data['data_rows']}\n\n")
            
            f.write("### Headers:\n\n")
            for i, header in enumerate(data['headers'], 1):
                if header:
                    f.write(f"{i}. **{header}**\n")
            f.write("\n---\n\n")
    
    print(f"\n📄 Report saved to: {output_file}")


if __name__ == "__main__":
    main()


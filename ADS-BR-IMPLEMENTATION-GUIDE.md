# ADS BR (Booked Revenue) Implementation Guide

## Overview
This guide documents the implementation of ADS BR (Booked Revenue) data per restaurant in the Zomato KAM system.

**Date:** 2025-11-16
**Status:** ✅ Implementation Complete - Ready for Execution

---

## 📊 Data Source

**CSV File:** `ADs-and-Toing/Dashboard Context data Drives - ADS BR Exact.csv`

**Columns:**
- Column A: `res_id` - Restaurant ID
- Column B: `res_name` - Restaurant Name
- Column C: `am_email` - KAM Email
- Column D: `ADS BR CM` - ADS Booked Revenue Current Month (in rupees)

**Data Characteristics:**
- **6,625 restaurants** total
- Restaurant-level data (not KAM-level)
- Numeric values representing booked revenue in rupees
- Some restaurants may have 0 revenue

---

## 🗄️ Database Changes

### New Column Added to `drive_sheets_data` Table

```sql
-- ADS Booked Revenue Current Month (per restaurant)
ads_br_cm TEXT
```

### Schema Files Modified

1. **`supabase/drive_sheets_data_schema.sql`**
   - Added `ads_br_cm` column to table definition (line 40)

2. **`supabase/add_ads_br_column.sql`** (NEW)
   - ALTER TABLE script to add column to existing database

---

## 🔧 Implementation Files

### 1. Database Schema

**File: `supabase/add_ads_br_column.sql`**
```sql
ALTER TABLE drive_sheets_data
ADD COLUMN IF NOT EXISTS ads_br_cm TEXT;
```

### 2. Data Import Script

**File: `scripts/import_ads_br_data.py`**
- Reads CSV file
- Generates SQL UPDATE statements
- Maps res_id → ads_br_cm

**Output:** `update_ads_br_data.sql`

### 3. TypeScript Interfaces

**File: `src/hooks/useDriveSheets.ts`**
```typescript
export interface DriveSheetData {
  // ... existing fields
  
  // ADs & Toing Data
  ads_avg_achievement: string | null;
  ads_br_cm: string | null; // ADS Booked Revenue Current Month
  toing_flag: string | null;
}
```

**File: `src/types/restaurantTemp.ts`**
```typescript
export interface RestaurantMetrics {
  activeDrives: number;
  zvdPo: string;
  adsBudget: {
    total: number;
    utilized: number;
    percentage: number;
  };
  adsAvgAchievement?: string; // Average ADS Achievement % from database
  adsBRCM?: string; // ADS Booked Revenue Current Month
  toingFlag: "Live" | "Not Live";
}
```

### 4. UI Components Updated

**File: `src/pages/KAMHub.tsx`**
- Added ADS BR display in restaurant cards
- Shows formatted revenue (₹X,XXX) in green color
- Only displays if data exists

**File: `src/pages/RestaurantDetail.tsx`**
- Added `adsBRCM` to metrics data

**File: `src/components/temp/restaurant/MetricsRow.tsx`**
- Added new metric card for ADS BR (CM)
- Changed grid from 4 columns to 5 columns
- Formatted display with Indian number format

---

## 🚀 Execution Steps

### Step 1: Add Database Column (1 minute)

Execute in Supabase SQL Editor:
```bash
supabase/add_ads_br_column.sql
```

**Expected Output:**
```
ALTER TABLE
column_name | data_type
------------|----------
ads_br_cm   | text
```

---

### Step 2: Generate SQL Update File (30 seconds)

Run in terminal:
```bash
python scripts/import_ads_br_data.py
```

**Expected Output:**
```
✅ ADS BR Data: 6625 restaurants

📄 Generated SQL File:
  1. update_ads_br_data.sql
```

---

### Step 3: Update ADS BR Data (2-3 minutes)

Execute in Supabase SQL Editor:
```bash
update_ads_br_data.sql
```

This updates `ads_br_cm` for all 6,625 restaurants.

---

## ✅ Verification

### Database Verification

```sql
-- Check ADS BR data distribution
SELECT 
  CASE 
    WHEN ads_br_cm::numeric = 0 THEN 'Zero Revenue'
    WHEN ads_br_cm::numeric > 0 AND ads_br_cm::numeric <= 50000 THEN '₹1-50K'
    WHEN ads_br_cm::numeric > 50000 AND ads_br_cm::numeric <= 100000 THEN '₹50K-100K'
    WHEN ads_br_cm::numeric > 100000 AND ads_br_cm::numeric <= 200000 THEN '₹100K-200K'
    ELSE '₹200K+'
  END as revenue_range,
  COUNT(*) as restaurant_count
FROM drive_sheets_data
WHERE ads_br_cm IS NOT NULL
GROUP BY revenue_range
ORDER BY revenue_range;

-- Sample restaurants with ADS BR data
SELECT res_id, res_name, am_email, ads_br_cm
FROM drive_sheets_data
WHERE ads_br_cm IS NOT NULL
  AND ads_br_cm::numeric > 0
ORDER BY ads_br_cm::numeric DESC
LIMIT 10;

-- Check total revenue by KAM
SELECT
  am_email,
  COUNT(*) as restaurant_count,
  SUM(ads_br_cm::numeric) as total_revenue,
  AVG(ads_br_cm::numeric) as avg_revenue
FROM drive_sheets_data
WHERE ads_br_cm IS NOT NULL
GROUP BY am_email
ORDER BY total_revenue DESC
LIMIT 10;
```

### Frontend Verification

1. Navigate to KAM Hub (`/kam-hub`)
2. Check restaurant cards show **ADS BR** in green color (e.g., "₹150,386 ADS BR")
3. Navigate to any restaurant detail page
4. Check the metrics row shows **ADS BR (CM)** card with formatted revenue

---

## 📊 Data Summary

| Metric | Count |
|--------|-------|
| Total restaurants in CSV | 6,625 |
| Restaurants with revenue > 0 | ~4,500 (estimated) |
| Restaurants with zero revenue | ~2,125 (estimated) |

---

## 🎨 UI Display

### KAM Hub - Restaurant Cards
```
Restaurant Name                    [Status Badge]
📍 Locality • Cuisine • 2,500 Sept OV • ₹150,386 ADS BR
```

### Restaurant Detail - Metrics Row
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Active      │ ZVD.PO      │ ADS         │ ADS BR (CM) │ TOING Flag  │
│ Drives      │             │ Achievement │             │             │
│ 3           │ 2,500       │ 85%         │ ₹150,386    │ Live        │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## 🔍 Notes

1. **ADS BR** is stored at restaurant level (individual per restaurant)
2. **ADS Achievement** is stored at KAM level (same for all restaurants of a KAM)
3. Both fields are optional (can be NULL)
4. Frontend gracefully handles missing data (shows "N/A" or hides the field)
5. Data can be updated by re-running the import script and SQL file
6. Revenue is formatted with Indian number format (₹1,50,386)
7. Zero revenue restaurants still have the field populated with "0"

---

## 📁 Files Created/Modified

### Created Files
- `supabase/add_ads_br_column.sql`
- `scripts/import_ads_br_data.py`
- `update_ads_br_data.sql` (generated)
- `ADS-BR-IMPLEMENTATION-GUIDE.md` (this file)

### Modified Files
- `supabase/drive_sheets_data_schema.sql`
- `src/hooks/useDriveSheets.ts`
- `src/types/restaurantTemp.ts`
- `src/pages/KAMHub.tsx`
- `src/pages/RestaurantDetail.tsx`
- `src/components/temp/restaurant/MetricsRow.tsx`

---

## 🎯 Next Steps

1. Execute `supabase/add_ads_br_column.sql` in Supabase SQL Editor
2. Run `python scripts/import_ads_br_data.py` to generate SQL file
3. Execute `update_ads_br_data.sql` in Supabase SQL Editor
4. Verify data in database using verification queries
5. Test frontend display in KAM Hub and Restaurant Detail pages

---

## ✨ Benefits

- **KAMs can see revenue data** at a glance in the restaurant list
- **Better prioritization** - KAMs can focus on high-revenue restaurants
- **Performance tracking** - Monitor booked revenue per restaurant
- **Data-driven decisions** - Revenue data helps in strategic planning

---

**Implementation Status:** ✅ Complete - Ready for Execution
**Estimated Execution Time:** 5 minutes total




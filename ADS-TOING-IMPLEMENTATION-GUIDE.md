# ADs and Toing Data Implementation Guide

## 📋 Overview

This guide documents the implementation of ADs Historic and Toing Flag data integration into the Zomato KAM system.

### Data Sources

1. **ADs Historic Data** (`ADs-and-Toing/Dashboard Context data Drives - Ads Historic (2).csv`)
   - Column A: KAM (email)
   - Column B: Team
   - Column C: AVG. Ach % (2025)
   - **46 KAM records**

2. **Toing Flag Data** (`ADs-and-Toing/Dashboard Context data Drives - Copy of comm data.csv`)
   - Column A: res_id
   - Column B: res_name
   - Column C: am_email
   - Column D: TOING Flag ("Live" or "Not Live")
   - **6,610 restaurant records**

---

## 🗄️ Database Changes

### New Columns Added to `drive_sheets_data` Table

```sql
-- ADs Average Achievement (by KAM email)
ads_avg_achievement TEXT

-- Toing Flag (by restaurant ID)
toing_flag TEXT  -- Values: "Live" or "Not Live"
```

### Schema Files Modified

1. **`supabase/drive_sheets_data_schema.sql`**
   - Added `ads_avg_achievement` and `toing_flag` columns to table definition

2. **`supabase/add_ads_toing_columns.sql`** (NEW)
   - ALTER TABLE script to add columns to existing database

---

## 🐍 Python Import Script

### Script: `scripts/import_ads_toing_data.py`

**Purpose:** Parse CSV files and generate SQL UPDATE statements

**Functions:**
- `load_ads_data()` - Parse ADs Historic CSV
- `load_toing_data()` - Parse Toing Flag CSV
- `generate_ads_update_sql()` - Generate UPDATE statements for ADs data
- `generate_toing_update_sql()` - Generate UPDATE statements for Toing data

**Output Files:**
- `update_ads_data.sql` - 46 UPDATE statements (by KAM email)
- `update_toing_data.sql` - 6,610 UPDATE statements (by restaurant ID)

**Execution:**
```bash
python scripts/import_ads_toing_data.py
```

**Results:**
```
✅ ADs Data: 46 KAMs
✅ Toing Data: 6610 restaurants
```

---

## 💻 Frontend Changes

### 1. TypeScript Interfaces Updated

**File: `src/hooks/useDriveSheets.ts`**
```typescript
export interface DriveSheetData {
  // ... existing fields
  
  // ADs & Toing Data
  ads_avg_achievement: string | null;
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
  adsAvgAchievement?: string; // NEW - from database
  toingFlag: "Live" | "Not Live";
}
```

### 2. Components Updated

**File: `src/pages/RestaurantDetail.tsx`**
- Changed hardcoded `toingFlag: "Not Live"` to use database value
- Added `adsAvgAchievement` from database

**Before:**
```typescript
toingFlag: "Not Live",  // Hardcoded
```

**After:**
```typescript
toingFlag: (restaurant.toing_flag as "Live" | "Not Live") || "Not Live",
adsAvgAchievement: restaurant.ads_avg_achievement || undefined,
```

**File: `src/components/temp/restaurant/MetricsRow.tsx`**
- Updated ADS Budget card to show ADs achievement if available

**Before:**
```typescript
description={`₹${metrics.adsBudget.utilized.toLocaleString()} utilized`}
```

**After:**
```typescript
description={
  metrics.adsAvgAchievement
    ? `Avg Achievement: ${metrics.adsAvgAchievement}`
    : `₹${metrics.adsBudget.utilized.toLocaleString()} utilized`
}
```

---

## 🚀 Execution Steps

### Step 1: Add Database Columns
Execute in Supabase SQL Editor:
```bash
supabase/add_ads_toing_columns.sql
```

### Step 2: Generate SQL Update Files
```bash
python scripts/import_ads_toing_data.py
```

### Step 3: Update ADs Data
Execute in Supabase SQL Editor:
```bash
update_ads_data.sql
```

This updates `ads_avg_achievement` for all restaurants belonging to each KAM.

### Step 4: Update Toing Data
Execute in Supabase SQL Editor:
```bash
update_toing_data.sql
```

This updates `toing_flag` for each restaurant individually.

---

## ✅ Verification

### Database Verification

```sql
-- Check ADs data
SELECT am_email, ads_avg_achievement, COUNT(*) as restaurant_count
FROM drive_sheets_data
WHERE ads_avg_achievement IS NOT NULL
GROUP BY am_email, ads_avg_achievement
ORDER BY am_email
LIMIT 10;

-- Check Toing data
SELECT toing_flag, COUNT(*) as count
FROM drive_sheets_data
WHERE toing_flag IS NOT NULL
GROUP BY toing_flag;

-- Sample restaurants with both fields
SELECT res_id, res_name, am_email, ads_avg_achievement, toing_flag
FROM drive_sheets_data
WHERE ads_avg_achievement IS NOT NULL 
  AND toing_flag IS NOT NULL
LIMIT 10;
```

### Frontend Verification

1. Navigate to any restaurant detail page
2. Check the **TOING Flag** metric card shows correct status ("Live" or "Not Live")
3. Check the **ADS Budget** card description shows "Avg Achievement: X%" if data exists

---

## 📊 Data Summary

| Metric | Count |
|--------|-------|
| KAMs with ADs data | 46 |
| Restaurants with Toing data | 6,610 |
| Total restaurants in system | 6,625 |

---

## 🔍 Notes

1. **ADs Achievement** is stored at KAM level (same value for all restaurants of a KAM)
2. **Toing Flag** is stored at restaurant level (individual per restaurant)
3. Both fields are optional (can be NULL)
4. Frontend gracefully handles missing data
5. Data can be updated by re-running the import script and SQL files

---

## 📁 Files Created/Modified

### Created Files
- `supabase/add_ads_toing_columns.sql`
- `scripts/import_ads_toing_data.py`
- `update_ads_data.sql` (generated)
- `update_toing_data.sql` (generated)
- `ADS-TOING-IMPLEMENTATION-GUIDE.md` (this file)

### Modified Files
- `supabase/drive_sheets_data_schema.sql`
- `src/hooks/useDriveSheets.ts`
- `src/types/restaurantTemp.ts`
- `src/pages/RestaurantDetail.tsx`
- `src/components/temp/restaurant/MetricsRow.tsx`


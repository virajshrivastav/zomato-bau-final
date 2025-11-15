# 📘 Database to Frontend - Complete Implementation Guide

**Purpose:** Reference guide for implementing database-driven data display across all 5,500 restaurants
**Last Updated:** 2025-11-15
**Status:** ✅ Single Restaurant Working | 🔄 Ready for Scale-Up

---

## 🎯 OVERVIEW

This guide documents how we successfully connected Supabase database to the frontend to display restaurant data dynamically. Use this as a reference for scaling to all restaurants.

---

## 🏗️ ARCHITECTURE: DATA FLOW

```
CSV Files (NCN, N2R, Items)
    ↓
Python Import Script
    ↓
Supabase Database (drive_sheets_data table)
    ↓
React Query Hooks (useDriveSheets)
    ↓
RestaurantDetail.tsx (Data Transformation)
    ↓
UI Components (NCNManagementCard, etc.)
    ↓
User sees dynamic data
```

---

## 📦 KEY COMPONENTS

### 1. **Database Layer**

**Table:** `drive_sheets_data`
**Location:** Supabase Cloud Database
**Schema File:** `supabase/drive_sheets_data_schema.sql`

**Key Characteristics:**
- **200+ columns** covering NCN, N2R, and Items data
- **Primary Key:** `res_id` (restaurant ID)
- **RLS Status:** ⚠️ Currently DISABLED for testing (see IMPORTANT-NOTES.md)
- **Indexes:** On `res_id`, `am_email` for performance

**Critical Columns Used:**
```sql
-- Basic Info
res_id, res_name, am_email, locality, cuisine, sept_ov

-- NCN Data (12 base + 9 stepper codes)
ncn_p1, ncn_p2, ncn_p3, ncn_p4, ncn_p5, ncn_p6
ncn_la, ncn_mm, ncn_um (base codes)
ncn_la_base_code_suggested, ncn_mm_base_code_suggested, ncn_um_base_code_suggested
ncn_la_step1, ncn_la_step2, ncn_la_step3
ncn_mm_step1, ncn_mm_step2, ncn_mm_step3
ncn_um_step1, ncn_um_step2, ncn_um_step3
ncn_approached, ncn_converted_stepper

-- N2R Data
n2r_la_current_aov, n2r_la_current_code
n2r_mm_current_aov, n2r_mm_current_code
n2r_um_current_aov, n2r_um_current_code
n2r_la_suggested_construct, n2r_la_suggested_mov
n2r_mm_suggested_construct, n2r_mm_suggested_mov
n2r_um_suggested_construct, n2r_um_suggested_mov
n2r_la_min_coupons, n2r_mm_min_coupons, n2r_um_min_coupons

-- Items Data
items_priority, items_pos_flag, items_pg_7_10_contribution
items_dish_tag_1 through items_dish_tag_7
items_approached, items_converted
```

---

### 2. **Data Fetching Layer (React Query Hooks)**

**File:** `src/hooks/useDriveSheets.ts`

**Purpose:** Provides type-safe hooks to fetch restaurant data from Supabase

**Key Hooks:**

#### `useDriveSheets()` - Fetch All Restaurants
```typescript
export function useDriveSheets() {
  return useQuery({
    queryKey: ["drive_sheets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .select("*")
        .order("res_name", { ascending: true });

      if (error) throw error;
      return data as DriveSheetData[];
    },
  });
}
```

**Usage in KAMHub.tsx:**
```typescript
const { data: restaurants, isLoading, error } = useDriveSheets();
```

#### `useDriveSheet(resId)` - Fetch Single Restaurant
```typescript
export function useDriveSheet(resId: string) {
  return useQuery({
    queryKey: ["drive_sheet", resId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .select("*")
        .eq("res_id", resId)
        .single();

      if (error) throw error;
      return data as DriveSheetData;
    },
    enabled: !!resId,
  });
}
```

**Usage in RestaurantDetail.tsx:**
```typescript
const { data: restaurant, isLoading, error } = useDriveSheet(id || "");
```

**Benefits of React Query:**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Loading/error states
- ✅ Type safety with TypeScript
- ✅ Optimistic updates support

---

### 3. **Data Transformation Layer**

**File:** `src/pages/RestaurantDetail.tsx`

**Purpose:** Transforms raw database data into UI-ready format

**Pattern Used:** IIFE (Immediately Invoked Function Expression) with null safety

**Example - NCN Stepper Codes:**
```typescript
stepperAndBaseCodes: {
  la: [
    // Base Code (percentage-based)
    (() => {
      const parsed = parseBaseCode(restaurant.ncn_la_base_code_suggested);
      return parsed && {
        id: "la-base",
        percentage: parsed.percentage,
        maxAmount: parsed.maxAmount,
        status: "Picked" as const,
        selected: false,
      };
    })(),

    // Stepper Code 1 (flat discount)
    (() => {
      const parsed = parseStepperCode(restaurant.ncn_la_step1);
      return parsed && {
        id: "la-step1",
        flatOff: parsed.flatOff,
        mov: parsed.mov,
        status: "Picked" as const,
        selected: false,
      };
    })(),
    // ... step2, step3
  ].filter(Boolean), // Remove null entries
}
```

**Why IIFE Pattern?**
- ✅ Inline parsing with local scope
- ✅ Null safety (returns undefined if parsing fails)
- ✅ Clean, readable code
- ✅ No temporary variables polluting scope

---

### 4. **Parser Utilities**

**Critical for handling different data formats from CSV**

#### `parseStepperCode()` - Flat Discount Codes
**File:** `src/utils/parseStepperCode.ts`

```typescript
/**
 * Parses: "100 off at mov 249" → { flatOff: 100, mov: 249 }
 */
export function parseStepperCode(text: string | null): {
  flatOff: number;
  mov: number;
} | null {
  if (!text) return null;
  const match = text.match(/(\d+)\s*off\s*at\s*mov\s*(\d+)/i);
  if (!match) return null;
  return {
    flatOff: parseInt(match[1], 10),
    mov: parseInt(match[2], 10),
  };
}
```

**Display Format:** "100 off at 249"

#### `parseBaseCode()` - Percentage Discount Codes
**File:** `src/utils/parseBaseCode.ts`

```typescript
/**
 * Parses: "40 upto 80" → { percentage: 40, maxAmount: 80 }
 */
export function parseBaseCode(text: string | null): {
  percentage: number;
  maxAmount: number;
} | null {
  if (!text) return null;
  const match = text.match(/(\d+)\s*upto\s*(\d+)/i);
  if (!match) return null;
  return {
    percentage: parseInt(match[1], 10),
    maxAmount: parseInt(match[2], 10),
  };
}
```

**Display Format:** "40% upto 80rs"

**Why Parsers Are Critical:**
- ✅ CSV data comes as text strings, not structured objects
- ✅ Different formats for different code types
- ✅ Centralized parsing logic (DRY principle)
- ✅ Easy to test and maintain
- ✅ Handles edge cases (null, invalid format)

---

### 5. **UI Components Layer**

**File:** `src/components/temp/restaurant/NCNManagementCard.tsx`

**Purpose:** Renders the NCN section with conditional formatting

**Key Feature:** Conditional rendering based on code type

```typescript
{code.percentage !== undefined ? (
  // Percentage-based code (base code)
  <>
    <div className="flex items-center gap-1">
      <span className="text-[10px]">Flat</span>
      <Input type="number" value={code.percentage} />
      <span className="text-[10px]">%</span>
    </div>
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[10px]">upto</span>
      <Input type="number" value={code.maxAmount} />
      <span className="text-[10px]">rs</span>
    </div>
  </>
) : (
  // Flat discount code (stepper code)
  <>
    <div className="flex items-center gap-1">
      <span className="text-[10px]">Flat</span>
      <Input type="number" value={code.flatOff} />
      <span className="text-[10px]">rs</span>
    </div>
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[10px]">MOV</span>
      <Input type="number" value={code.mov} />
      <span className="text-[10px]">rs</span>
    </div>
  </>
)}
```

**Pattern:** Check which properties exist to determine display format

---

### 6. **Type System**

**File:** `src/types/restaurantTemp.ts`

**Purpose:** Provides TypeScript interfaces for type safety

**Key Interface - PromoCode (supports both formats):**
```typescript
export interface PromoCode {
  id: string;
  // For flat discount codes (stepper codes)
  flatOff?: number;
  mov?: number;
  // For percentage-based codes (base codes)
  percentage?: number;
  maxAmount?: number;
  status: "Submitted" | "Picked" | "Pending";
  selected: boolean;
}
```

**Design Decision:** Optional properties instead of union types
- ✅ Simpler to implement
- ✅ Backward compatible
- ✅ UI can check which properties exist
- ⚠️ Less strict type safety (trade-off accepted)


---

## 🔥 CRITICAL CHALLENGES & SOLUTIONS

### Challenge 1: Hardcoded Values Blocking Scale-Up

**Problem:**
- MOV values were hardcoded (249, 299, 349, etc.)
- FlatOff amounts used wrong columns
- System couldn't handle 5,500 unique restaurants

**Solution:**
1. Created `parseStepperCode()` utility
2. Updated all 9 stepper fields to parse from text
3. Used IIFE pattern for inline parsing
4. Applied `.filter(Boolean)` to remove null entries

**Files Changed:**
- `src/utils/parseStepperCode.ts` (created)
- `src/pages/RestaurantDetail.tsx` (updated 9 fields)

**Verification:**
- Searched for hardcoded MOV values → 0 results ✅
- Tested with restaurant 6503620 → correct values ✅

---

### Challenge 2: Base Codes vs Stepper Codes (Different Formats)

**Problem:**
- Base codes: "40 upto 80" (percentage-based)
- Stepper codes: "100 off at mov 249" (flat discount)
- UI needed to display both formats differently

**Solution:**
1. Created `parseBaseCode()` utility
2. Added optional `percentage` and `maxAmount` to `PromoCode` interface
3. Updated UI to conditionally render based on code type
4. Used `code.percentage !== undefined` to detect base codes

**Files Changed:**
- `src/utils/parseBaseCode.ts` (created)
- `src/types/restaurantTemp.ts` (updated interface)
- `src/pages/RestaurantDetail.tsx` (updated 3 base codes)
- `src/components/temp/restaurant/NCNManagementCard.tsx` (conditional rendering)

**Result:**
- Base codes show: "40% upto 80rs" ✅
- Stepper codes show: "100 off at 249" ✅

---

### Challenge 3: RLS Policy Blocking Data Access

**Problem:**
- After importing data, frontend showed "0 restaurants visible"
- Row Level Security (RLS) policy was blocking access
- JWT token structure didn't match expected format

**Solution:**
- Temporarily disabled RLS for testing
- Created `QUICK_FIX_RLS.sql`
- Documented need to re-enable for production

**SQL Command:**
```sql
ALTER TABLE drive_sheets_data DISABLE ROW LEVEL SECURITY;
```

**⚠️ CRITICAL:** RLS is currently DISABLED
- Must re-enable before production
- See `PROPER_RLS_POLICY.sql` for correct implementation
- Or implement application-layer filtering

---

### Challenge 4: Python Scripts Cannot Connect to Supabase

**Problem:**
- Network error: `[Errno 11001] getaddrinfo failed`
- Python Supabase client couldn't connect

**Solution:**
- Created SQL INSERT fallback approach
- Export data to JSON using `export_test_restaurant_json.py`
- Generate SQL INSERT from JSON
- Run SQL directly in Supabase SQL Editor

**Files Created:**
- `scripts/export_test_restaurant_json.py`
- `test_restaurant_6503620.json`
- `insert_test_restaurant.sql`

**Lesson:** Always have SQL-based backup for data import

---

## ⚠️ MUST-DOS & CAUTIONS

### 🔴 CRITICAL - Before Production

1. **Re-enable RLS Policy**
   ```sql
   ALTER TABLE drive_sheets_data ENABLE ROW LEVEL SECURITY;
   ```
   - See `PROPER_RLS_POLICY.sql` for implementation
   - Test with multiple KAM logins
   - Verify each KAM sees only their restaurants

2. **Fix Mock Data in Metrics**
   - `activeDrives: 3` → Calculate dynamically
   - `adsBudget` → Fetch from database or remove
   - `toingFlag: "Not Live"` → Fetch from database or remove

3. **Test with All 5,500 Restaurants**
   - Import all CSV data
   - Test performance with large dataset
   - Verify no memory issues
   - Check query performance

4. **Error Handling**
   - Handle parsing failures gracefully
   - Display user-friendly messages
   - Log errors for debugging

---

### ⚡ PERFORMANCE CONSIDERATIONS

**Current Status:** Single restaurant tested, no performance issues

**For 5,500 Restaurants:**

1. **Database Indexes**
   - ✅ Already created on `res_id` and `am_email`
   - Consider composite index if needed

2. **React Query Caching**
   - ✅ Already implemented
   - Reduces unnecessary API calls
   - Background refetching keeps data fresh

3. **Pagination/Virtual Scrolling**
   - May be needed for KAM Hub restaurant list
   - Consider implementing if list becomes slow

4. **Lazy Loading**
   - Restaurant detail data only loads when page is visited
   - ✅ Already implemented with `enabled: !!resId`

---

### 🛡️ DATA INTEGRITY CHECKS

**Before Importing All Restaurants:**

1. **Verify CSV Data Quality**
   ```python
   # Check for missing required fields
   # Validate data formats
   # Check for duplicates
   ```

2. **Test Edge Cases**
   - Restaurants with missing data
   - Invalid code formats
   - Null values in critical fields

3. **Backup Strategy**
   - Export current database state
   - Test import on staging environment first
   - Have rollback plan ready


---

## 📋 STEP-BY-STEP: SCALING TO ALL RESTAURANTS

### Phase 1: Preparation (1-2 hours)

1. **Verify Current System**
   - [ ] Test restaurant 6503620 still works
   - [ ] No TypeScript errors
   - [ ] No console errors
   - [ ] All features functional

2. **Prepare CSV Files**
   - [ ] Validate all 3 CSV files (NCN, N2R, Items)
   - [ ] Check for data quality issues
   - [ ] Verify column mappings

3. **Update Import Script**
   - [ ] Modify `import_drive_data_single.py` to import all restaurants
   - [ ] Add progress logging
   - [ ] Add error handling
   - [ ] Test on small batch first (10-20 restaurants)

---

### Phase 2: Database Import (2-4 hours)

1. **Backup Current Database**
   ```sql
   -- Export current drive_sheets_data
   SELECT * FROM drive_sheets_data;
   ```

2. **Import in Batches**
   - Start with 100 restaurants
   - Verify data integrity
   - Continue with larger batches
   - Monitor for errors

3. **Verify Import Success**
   ```sql
   -- Check total count
   SELECT COUNT(*) FROM drive_sheets_data;

   -- Check for nulls in critical fields
   SELECT COUNT(*) FROM drive_sheets_data WHERE res_id IS NULL;

   -- Verify KAM distribution
   SELECT am_email, COUNT(*) FROM drive_sheets_data GROUP BY am_email;
   ```

---

### Phase 3: Frontend Testing (1-2 hours)

1. **Test Multiple KAMs**
   - [ ] Login as different KAMs
   - [ ] Verify each sees correct restaurants
   - [ ] Check data accuracy

2. **Test Different Restaurants**
   - [ ] Restaurants with all data
   - [ ] Restaurants with missing data
   - [ ] Restaurants with edge cases

3. **Performance Testing**
   - [ ] KAM Hub loads quickly
   - [ ] Restaurant detail loads quickly
   - [ ] No browser lag or freezing

---

### Phase 4: Production Deployment (1 hour)

1. **Re-enable RLS**
   ```sql
   -- Run PROPER_RLS_POLICY.sql
   ```

2. **Final Verification**
   - [ ] All KAMs can access their data
   - [ ] No unauthorized access
   - [ ] All features working

3. **Monitor & Support**
   - Watch for errors
   - Gather user feedback
   - Fix issues quickly

---

## 🎓 KEY LEARNINGS & BEST PRACTICES

### 1. **Always Parse, Never Hardcode**
- CSV data comes as text strings
- Create parser utilities for different formats
- Centralize parsing logic
- Handle edge cases (null, invalid format)

### 2. **Use IIFE Pattern for Inline Transformations**
```typescript
(() => {
  const parsed = parseData(rawData);
  return parsed && { ...transformedData };
})()
```
- Clean, readable code
- Null safety built-in
- No scope pollution

### 3. **Filter Boolean to Remove Nulls**
```typescript
[item1, item2, item3].filter(Boolean)
```
- Removes undefined/null entries
- TypeScript-friendly
- Clean array output

### 4. **Optional Properties for Flexible Interfaces**
```typescript
interface PromoCode {
  flatOff?: number;  // Optional
  percentage?: number;  // Optional
}
```
- Supports multiple formats
- Backward compatible
- UI checks which properties exist

### 5. **React Query for Data Fetching**
- Automatic caching
- Loading/error states
- Background refetching
- Type safety

### 6. **Conditional Rendering Based on Data Shape**
```typescript
{code.percentage !== undefined ? (
  <PercentageView />
) : (
  <FlatDiscountView />
)}
```
- Flexible UI
- Handles different data formats
- Clean separation of concerns


---

## 📁 CRITICAL FILES REFERENCE

### Database & Schema
- `supabase/drive_sheets_data_schema.sql` - Table definition
- `QUICK_FIX_RLS.sql` - Disable RLS (already run)
- `PROPER_RLS_POLICY.sql` - Re-enable RLS (for production)

### Data Import
- `scripts/import_drive_data_single.py` - Import script
- `scripts/export_test_restaurant_json.py` - Export to JSON
- `test_restaurant_6503620.json` - Test data
- `insert_test_restaurant.sql` - SQL INSERT

### Frontend - Data Fetching
- `src/lib/supabase.ts` - Supabase client
- `src/hooks/useDriveSheets.ts` - React Query hooks
- `src/App.tsx` - QueryClient setup

### Frontend - Data Transformation
- `src/pages/RestaurantDetail.tsx` - Main transformation logic
- `src/utils/parseStepperCode.ts` - Stepper code parser
- `src/utils/parseBaseCode.ts` - Base code parser

### Frontend - UI Components
- `src/components/temp/restaurant/NCNManagementCard.tsx` - NCN UI
- `src/components/temp/restaurant/N2RManagementCard.tsx` - N2R UI
- `src/components/temp/restaurant/ItemsManagementCard.tsx` - Items UI
- `src/components/temp/restaurant/MetricsRow.tsx` - Metrics display

### Type Definitions
- `src/types/restaurantTemp.ts` - All TypeScript interfaces
- `src/hooks/useDriveSheets.ts` - DriveSheetData interface

### Documentation
- `DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md` - This file
- `FIX-HARDCODED-VALUES-QUICK-REFERENCE.md` - Hardcoded fix guide
- `VERIFICATION-REPORT-NCN-HARDCODED-FIX.md` - Verification report
- `DRIVE-DATA-IMPLEMENTATION-PLAN.md` - Original implementation plan
- `SPRINT-1-COMPLETION-REPORT.md` - Sprint 1 summary
- `IMPORTANT-NOTES.md` - Critical reminders

---

## 🚨 COMMON PITFALLS TO AVOID

### 1. **Forgetting .filter(Boolean)**
```typescript
// ❌ WRONG - includes null/undefined
const codes = [code1, code2, code3];

// ✅ CORRECT - removes null/undefined
const codes = [code1, code2, code3].filter(Boolean);
```

### 2. **Using Wrong Column for Data**
```typescript
// ❌ WRONG - uses base column for stepper
flatOff: parseInt(restaurant.ncn_la || "0")

// ✅ CORRECT - parses from stepper text
const parsed = parseStepperCode(restaurant.ncn_la_step1);
flatOff: parsed.flatOff
```

### 3. **Hardcoding Values**
```typescript
// ❌ WRONG
mov: 249

// ✅ CORRECT
mov: parsed.mov
```

### 4. **Not Handling Null Values**
```typescript
// ❌ WRONG - crashes if null
const value = restaurant.field.toUpperCase();

// ✅ CORRECT - null-safe
const value = restaurant.field?.toUpperCase() || "N/A";
```

### 5. **Forgetting Type Assertions**
```typescript
// ❌ WRONG - TypeScript error
status: "Picked"

// ✅ CORRECT
status: "Picked" as const
```

---

## 🎯 SUCCESS METRICS

### Current Status (1 Restaurant)
- ✅ Database connected
- ✅ Data fetching works
- ✅ Parsing works correctly
- ✅ UI displays correctly
- ✅ No hardcoded values
- ✅ Type-safe implementation

### Target Status (5,500 Restaurants)
- [ ] All restaurants imported
- [ ] RLS re-enabled
- [ ] Multiple KAMs tested
- [ ] Performance acceptable
- [ ] Error handling robust
- [ ] Production-ready

---

## 📞 TROUBLESHOOTING GUIDE

### Issue: "Restaurant not found"
**Cause:** Restaurant not in database or RLS blocking access
**Fix:**
1. Check restaurant exists: `SELECT * FROM drive_sheets_data WHERE res_id = 'XXX'`
2. Check RLS status: `SELECT * FROM pg_tables WHERE tablename = 'drive_sheets_data'`
3. Verify KAM email matches

### Issue: "Data shows as N/A or 0"
**Cause:** Parsing failed or data missing in CSV
**Fix:**
1. Check CSV data for that restaurant
2. Verify parser regex matches format
3. Add console.log to parser to debug

### Issue: "TypeScript errors after changes"
**Cause:** Type mismatch or missing properties
**Fix:**
1. Check interface definitions
2. Use `as const` for literal types
3. Make properties optional if needed

### Issue: "Slow performance with many restaurants"
**Cause:** Too much data loading at once
**Fix:**
1. Implement pagination
2. Add virtual scrolling
3. Optimize database queries
4. Check React Query cache settings

---

## 🎉 READY FOR SCALE-UP!

This guide provides everything needed to scale from 1 restaurant to 5,500 restaurants. Follow the step-by-step process, watch for the common pitfalls, and refer to the critical files as needed.

**Next Steps:**
1. Review this guide thoroughly
2. Prepare CSV files and import script
3. Test with small batch (10-20 restaurants)
4. Scale up gradually
5. Monitor and fix issues
6. Deploy to production

**Good luck! 🚀**



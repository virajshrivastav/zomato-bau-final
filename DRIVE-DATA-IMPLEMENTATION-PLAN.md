# 🚀 Drive Data Implementation Plan

**Date:** 2025-11-14
**Status:** ✅ Sprint 1 Complete - Ready for Sprint 2
**Approach:** Option A - Flat Table (Safe, No Tampering)

**Sprint 1 Result:** ✅ SUCCESS - Test restaurant displaying with 100% data accuracy

---

## 📋 OBJECTIVE

Upload drive data from CSV files to Supabase and display it on the restaurant detail page frontend.

### Primary Goal
Enable KAMs to view complete drive data (NCN, N2R, Items ≤159) for their assigned restaurants on the dashboard.

### Success Criteria
✅ Data from CSV files successfully uploaded to Supabase  
✅ Data visible on restaurant detail page  
✅ Data filtered by KAM email (RLS)  
✅ All three drive sections (NCN, N2R, Items) display correctly

---

## 📊 DATA SOURCES

### CSV Files Location
`drive-data/` folder contains three cleaned CSV files:

1. **NCN-codes.csv**
   - Rows: 5,541 restaurants
   - Columns: 128 fields
   - Drive: No Cooking November (NCN)

2. **N2R-Codes.csv**
   - Rows: 5,668 restaurants
   - Columns: 59 fields
   - Drive: New To Restaurant (N2R)

3. **Items-159LL.csv**
   - Rows: 1,909 restaurants
   - Columns: 49 fields
   - Drive: Items ≤159

### Test Restaurant
**Restaurant ID:** `6503620`  
**Name:** Kanha Veg  
**KAM Email:** gupta.ansh@zomato.com  
**Why chosen:** Has data in all three drives (NCN, N2R, Items)

---

## 🎯 IMPLEMENTATION STRATEGY

### Phase 1: Single Restaurant Test (CURRENT)
1. Create `drive_sheets_data` table schema
2. Import only restaurant `6503620` data
3. Update frontend to fetch and display data
4. Test end-to-end functionality
5. Verify data accuracy

### Phase 2: Full Import (AFTER SUCCESS)
1. Import all restaurants from all three CSVs
2. Verify data integrity
3. Test with multiple KAM logins
4. Performance optimization if needed

---

## 🏗️ ARCHITECTURE DECISION: OPTION A

### Why Option A (Flat Table)?

**✅ PROS:**
- Zero risk to existing tables
- Easy rollback (just drop table)
- Parallel testing possible
- Faster implementation
- Frontend already expects this table

**❌ CONS:**
- Denormalized data structure
- Some data duplication
- Larger table size

### What We're NOT Doing
- ❌ NOT modifying existing `restaurants` table
- ❌ NOT modifying existing `drives` table
- ❌ NOT modifying existing `drive_data` table
- ❌ NOT modifying existing `conversion_tracking` table

### What We're Creating
- ✅ NEW table: `drive_sheets_data`
- ✅ Completely separate from existing schema
- ✅ Can coexist with current system

---

## 📁 FILES TO BE CREATED

### 1. Database Schema
- `supabase/drive_sheets_data_schema.sql`
- Creates the new table with all columns

### 2. Import Script
- `scripts/import_drive_data_single.py`
- Imports only restaurant `6503620` for testing

### 3. Frontend Updates
- Update `src/hooks/useRestaurants.ts` (if needed)
- Update `src/pages/RestaurantDetail.tsx` to use real data

### 4. Documentation
- This file (implementation plan)
- Progress tracking document

---

## 🗂️ DATABASE SCHEMA OVERVIEW

### Table: `drive_sheets_data`

**Primary Key:** `res_id`

**Column Groups:**

1. **Basic Info** (from all CSVs)
   - res_id, res_name, am_email, tl_email, cuisine, locality, etc.

2. **NCN Data** (~100 columns)
   - Priorities (P1-P6)
   - Stepper codes (LA/MM/UM)
   - Base codes
   - Active promos
   - Approached/Converted flags

3. **N2R Data** (~50 columns)
   - Current codes (LA/MM/UM)
   - AOV values
   - Suggested constructs
   - MOV values
   - Required coupons

4. **Items Data** (~40 columns)
   - Priority
   - POS Flag
   - PG 7-10 contribution
   - Dish suggestions (7 tags)
   - Items added (8 fields)

---

## 🔄 IMPLEMENTATION STEPS

### Step 1: Create Database Schema ✅
- [x] Design table structure
- [x] Create SQL file
- [ ] Run in Supabase SQL Editor
- [ ] Verify table creation

### Step 2: Create Import Script ✅
- [x] Write Python script
- [x] Test CSV parsing logic
- [ ] Import single restaurant
- [ ] Verify data in Supabase

### Step 3: Update Frontend
- [ ] Update data fetching hooks
- [ ] Map CSV columns to UI components
- [ ] Test data display

### Step 4: End-to-End Testing
- [ ] Login as test KAM
- [ ] Navigate to restaurant detail page
- [ ] Verify all three drive sections show data
- [ ] Check data accuracy

---

## 📝 PROGRESS LOG

### 2025-11-14 - Initial Planning & Setup
- ✅ Analyzed diagnostic report
- ✅ Examined new CSV files
- ✅ Selected test restaurant (6503620 - Kanha Veg)
- ✅ Decided on Option A approach (flat table, no tampering)
- ✅ Created implementation plan document
- ✅ Created progress tracker document
- ✅ Created quick start guide
- ✅ Created database schema SQL file (200+ columns)
- ✅ Created Python import script for single restaurant
- 🟡 Ready for execution - awaiting user to run SQL and import script

---

## 🚨 RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data type mismatches | Medium | Use TEXT for all fields initially |
| Missing data in CSVs | Low | Handle NULL/empty values gracefully |
| Frontend breaking | Medium | Keep old code as backup |
| Performance issues | Low | Start with single restaurant |

---

## 📞 SUPPORT & REFERENCES

### Key Documents
- `DIAGNOSTIC-REPORT.md` - Previous attempt analysis
- `drive-data/` - Source CSV files
- `supabase-setup.sql` - Existing database schema

### Task Context
See original user requirements in conversation history for detailed column mappings.

---

**Next Action:** Create database schema SQL file


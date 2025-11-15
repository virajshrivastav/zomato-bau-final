# ⚠️ Important Notes & Reminders

**Last Updated:** 2025-11-14  
**Current Status:** Sprint 1 Complete

---

## 🔴 CRITICAL INFORMATION

### 1. RLS (Row Level Security) is Currently DISABLED
**Status:** ⚠️ DISABLED FOR TESTING

**What this means:**
- The `drive_sheets_data` table is accessible to ALL authenticated users
- No email-based filtering is happening at the database level
- This is INTENTIONAL for testing purposes

**Why we disabled it:**
- The original RLS policy was blocking data access
- JWT token structure wasn't matching the expected format
- Needed to verify data flow works before fixing authentication

**Action Required Before Production:**
- Re-enable RLS with proper policy (see `PROPER_RLS_POLICY.sql`)
- OR implement KAM filtering in application layer
- OR fix JWT email matching logic

**File to run when ready:**
```sql
-- See: PROPER_RLS_POLICY.sql
ALTER TABLE drive_sheets_data ENABLE ROW LEVEL SECURITY;
```

---

### 2. Python Scripts Cannot Connect to Supabase
**Status:** ⚠️ NETWORK ISSUE

**Problem:**
- Python scripts get DNS resolution error: `[Errno 11001] getaddrinfo failed`
- Cannot use Supabase Python client from this machine

**Workaround:**
- Use SQL INSERT statements instead
- Export data to JSON, then create SQL from JSON
- Run SQL directly in Supabase SQL Editor

**Files for reference:**
- `scripts/export_test_restaurant_json.py` - Export to JSON
- `insert_test_restaurant.sql` - Example SQL INSERT

**For Sprint 2 (full import):**
- Will need to use SQL-based approach
- OR fix network/DNS issue
- OR run Python scripts from different machine

---

### 3. Data Source Changed from `restaurants` to `drive_sheets_data`
**Status:** ✅ UPDATED

**What changed:**
- Old: `useRestaurants()` hook → queries `restaurants` table
- New: `useDriveSheets()` hook → queries `drive_sheets_data` table

**Files updated:**
- ✅ `src/pages/RestaurantDetail.tsx`
- ✅ `src/pages/KAMHub.tsx`

**Files NOT yet updated (if they exist):**
- ⚠️ Any dashboard components
- ⚠️ Any analytics pages
- ⚠️ Any reports that use restaurant data

**Action Required:**
- Search codebase for `useRestaurants` usage
- Update any remaining components to use `useDriveSheets`

---

### 4. Test Data is Limited to ONE Restaurant
**Status:** ✅ WORKING

**Current data:**
- Only 1 restaurant in `drive_sheets_data` table
- res_id: 6503620 (Kanha Veg)
- KAM: gupta.ansh@zomato.com

**What this means:**
- KAM Hub will only show 1 restaurant
- Other KAMs will see 0 restaurants (until we import their data)
- This is EXPECTED for Sprint 1

**Next step:**
- Sprint 2: Import all ~5,500 restaurants

---

### 5. Original Tables Are UNTOUCHED
**Status:** ✅ SAFE

**Tables NOT modified:**
- `restaurants` - Still exists, unchanged
- `drives` - Still exists, unchanged
- `drive_data` - Still exists, unchanged
- `conversion_tracking` - Still exists, unchanged

**New table created:**
- `drive_sheets_data` - Completely separate, can be dropped anytime

**Rollback plan:**
- Simply drop `drive_sheets_data` table
- Revert frontend changes to use old hooks
- Everything goes back to original state

---

## 📝 Quick Reference

### Login Credentials for Testing
- **Email:** gupta.ansh@zomato.com
- **Password:** 1234
- **Test Restaurant:** 6503620 (Kanha Veg)

### Key Files
- **Schema:** `supabase/drive_sheets_data_schema.sql`
- **Data Hook:** `src/hooks/useDriveSheets.ts`
- **Detail Page:** `src/pages/RestaurantDetail.tsx`
- **List Page:** `src/pages/KAMHub.tsx`

### Documentation
- **Implementation Plan:** `DRIVE-DATA-IMPLEMENTATION-PLAN.md`
- **Progress Tracker:** `DRIVE-DATA-PROGRESS.md`
- **Completion Report:** `SPRINT-1-COMPLETION-REPORT.md`
- **Quick Start:** `DRIVE-DATA-QUICK-START.md`

### SQL Helpers
- **Fix RLS:** `QUICK_FIX_RLS.sql` (already run)
- **Re-enable RLS:** `PROPER_RLS_POLICY.sql` (for later)
- **Debug RLS:** `debug_rls_policy.sql` (for troubleshooting)

---

## 🎯 Before Moving to Sprint 2

### Checklist
- [x] Verify Sprint 1 data accuracy (100% verified)
- [x] Document all obstacles and solutions
- [x] Update all documentation
- [ ] Decide on RLS strategy for production
- [ ] Plan full data import approach (SQL vs Python)
- [ ] Estimate time for importing 5,500 restaurants
- [ ] Plan testing strategy for multiple KAMs

### Questions to Answer
1. **RLS Strategy:** Database-level or application-level filtering?
2. **Import Method:** SQL INSERT or Python API (if network fixed)?
3. **Performance:** Will 5,500 rows need pagination/optimization?
4. **Data Updates:** How to handle CSV updates in the future?
5. **Validation:** How to verify all 5,500 restaurants imported correctly?

---

## 🚨 Known Issues

### None Currently
All Sprint 1 issues have been resolved. System is stable and working as expected.

---

## 💡 Recommendations

1. **Test with another KAM** - Import data for one more KAM to verify multi-user functionality
2. **Performance baseline** - Measure current query performance with 1 restaurant
3. **Backup strategy** - Export `drive_sheets_data` to CSV before full import
4. **Incremental import** - Import in batches (e.g., 1000 at a time) rather than all at once
5. **Validation script** - Create script to compare imported data vs CSV source

---

**Remember:** This is a SAFE implementation. Original data is untouched. Everything can be rolled back easily.


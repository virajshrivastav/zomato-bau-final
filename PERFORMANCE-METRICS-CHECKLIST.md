# Performance Metrics - Implementation Checklist

**Last Updated:** 2025-11-15  
**Purpose:** Track implementation progress  
**Estimated Time:** 4-6 hours  

---

## 📋 PRE-IMPLEMENTATION

### Documentation Review
- [ ] Read `PERFORMANCE-METRICS-SUMMARY.md` (5 min)
- [ ] Read `PERFORMANCE-METRICS-README.md` (10 min)
- [ ] Skim `PERFORMANCE-METRICS-IMPLEMENTATION-PLAN.md` (15 min)
- [ ] Have `PERFORMANCE-METRICS-QUICK-START.md` open

### Environment Setup
- [ ] Verify CSV files exist in `performance-metrics/` folder
  - [ ] `Dashboard Context data Drives - NCN Coverage Summary .csv`
  - [ ] `Dashboard Context data Drives - N2R Summary.csv`
  - [ ] `Dashboard Context data Drives - Input Summary.csv`
- [ ] Confirm Supabase connection working
- [ ] Test Supabase CLI: `supabase --version`
- [ ] Verify Python installed: `python --version`
- [ ] Install pandas: `pip install pandas python-dotenv`
- [ ] React dev server running: `npm run dev`

**Estimated Time:** 30 minutes

---

## 🗄️ PHASE 1: DATABASE SETUP

**Estimated Time:** 1-2 hours

### Step 1.1: Create Schema File
- [ ] Create file: `supabase/performance_metrics_schema.sql`
- [ ] Copy schema from `PERFORMANCE-METRICS-TECHNICAL-SPEC.md` (lines 15-120)
- [ ] Or copy from `PERFORMANCE-METRICS-QUICK-START.md` (lines 60-95)
- [ ] Verify SQL syntax (no typos)

### Step 1.2: Execute Schema
- [ ] Option A: Via Supabase CLI
  ```bash
  supabase db execute --file supabase/performance_metrics_schema.sql --linked
  ```
- [ ] Option B: Via Supabase Dashboard (SQL Editor)
  - [ ] Copy SQL content
  - [ ] Paste in SQL Editor
  - [ ] Click "Run"

### Step 1.3: Verify Tables Created
- [ ] Run verification query:
  ```sql
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_name IN ('ncn_summary', 'n2r_summary', 'items_summary');
  ```
- [ ] Confirm 3 rows returned
- [ ] Check indexes created:
  ```sql
  SELECT indexname FROM pg_indexes 
  WHERE tablename IN ('ncn_summary', 'n2r_summary', 'items_summary');
  ```

**✅ Checkpoint:** 3 tables + 3 indexes created successfully

---

## 🐍 PHASE 2: DATA IMPORT

**Estimated Time:** 2-3 hours

### Step 2.1: Create Import Script
- [ ] Create file: `scripts/import_performance_metrics.py`
- [ ] Copy template from `PERFORMANCE-METRICS-QUICK-START.md` (lines 100-200)
- [ ] Verify imports: `pandas`, `os`, `dotenv`
- [ ] Update CSV file paths if needed

### Step 2.2: Implement CSV Parsers
- [ ] Implement `parse_ncn_csv()` function
  - [ ] Read CSV with `skiprows=2`
  - [ ] Extract columns B-X (indices 1-23)
  - [ ] Handle special characters (▲, ▼)
  - [ ] Return list of dicts
- [ ] Implement `parse_n2r_csv()` function
  - [ ] Read CSV with `skiprows=2`
  - [ ] Extract columns B, C, D, M, S, Y
  - [ ] Return list of dicts
- [ ] Implement `parse_items_csv()` function
  - [ ] Read CSV with `skiprows=2`
  - [ ] Extract columns BZ:CV (OV Coverage)
  - [ ] Extract columns DV:ER (Items Count)
  - [ ] Return list of dicts

### Step 2.3: Implement SQL Generators
- [ ] Implement `generate_ncn_sql(data)` function
  - [ ] Generate INSERT statements
  - [ ] Use UPSERT (ON CONFLICT DO UPDATE)
  - [ ] Handle NULL values
- [ ] Implement `generate_n2r_sql(data)` function
- [ ] Implement `generate_items_sql(data)` function

### Step 2.4: Run Import Script
- [ ] Create output directory: `mkdir -p sql_output`
- [ ] Run script: `python scripts/import_performance_metrics.py`
- [ ] Verify output:
  - [ ] `sql_output/insert_ncn_summary.sql` created
  - [ ] `sql_output/insert_n2r_summary.sql` created
  - [ ] `sql_output/insert_items_summary.sql` created
- [ ] Check statement counts:
  - [ ] NCN: ~129 statements
  - [ ] N2R: ~61 statements
  - [ ] Items: ~62 statements

### Step 2.5: Execute SQL Import
- [ ] Execute NCN SQL:
  ```bash
  supabase db execute --file sql_output/insert_ncn_summary.sql --linked
  ```
- [ ] Execute N2R SQL:
  ```bash
  supabase db execute --file sql_output/insert_n2r_summary.sql --linked
  ```
- [ ] Execute Items SQL:
  ```bash
  supabase db execute --file sql_output/insert_items_summary.sql --linked
  ```

### Step 2.6: Verify Data Import
- [ ] Check row counts:
  ```sql
  SELECT COUNT(*) FROM ncn_summary;     -- Should be ~129
  SELECT COUNT(*) FROM n2r_summary;     -- Should be ~61
  SELECT COUNT(*) FROM items_summary;   -- Should be ~62
  ```
- [ ] Check sample data:
  ```sql
  SELECT * FROM ncn_summary LIMIT 3;
  SELECT * FROM n2r_summary LIMIT 3;
  SELECT * FROM items_summary LIMIT 3;
  ```
- [ ] Verify specific KAM:
  ```sql
  SELECT * FROM ncn_summary 
  WHERE kam_email = 'bhuwneshwari.dhouni@zomato.com';
  ```
- [ ] Check for NULL emails:
  ```sql
  SELECT COUNT(*) FROM ncn_summary WHERE kam_email IS NULL;  -- Should be 0
  ```

**✅ Checkpoint:** All data imported successfully

---

## ⚛️ PHASE 3: FRONTEND INTEGRATION

**Estimated Time:** 2-3 hours

### Step 3.1: Create Type Definitions
- [ ] Create file: `src/types/performanceMetrics.ts`
- [ ] Copy types from `PERFORMANCE-METRICS-TECHNICAL-SPEC.md` (lines 200-280)
- [ ] Or from `PERFORMANCE-METRICS-QUICK-START.md` (lines 260-310)
- [ ] Verify TypeScript compiles: `npm run build`

### Step 3.2: Create React Hooks
- [ ] Create file: `src/hooks/usePerformanceMetrics.ts`
- [ ] Copy hooks from `PERFORMANCE-METRICS-TECHNICAL-SPEC.md` (lines 130-195)
- [ ] Or from `PERFORMANCE-METRICS-QUICK-START.md` (lines 320-380)
- [ ] Import types from `performanceMetrics.ts`
- [ ] Verify no TypeScript errors

### Step 3.3: Update KAMAnalytics Page
- [ ] Open file: `src/pages/KAMAnalytics.tsx`
- [ ] Import hooks: `import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics"`
- [ ] Import types: `import type { NCNSummary, N2RSummary, ItemsSummary } from "@/types/performanceMetrics"`
- [ ] Replace mock data with real hooks
- [ ] Copy implementation from `PERFORMANCE-METRICS-QUICK-START.md` (lines 390-650)

### Step 3.4: Implement UI Sections
- [ ] Implement NCN Drive Section
  - [ ] Stepper/Base Coverage cards (3 cards: LA, MM, UM)
  - [ ] Other metrics cards (4 cards: Flash Sale, BOGO, Overall OV, Overall Res)
  - [ ] Display delta indicators (▲, ▼)
- [ ] Implement N2R Drive Section
  - [ ] 3 conversion cards (LA, MM, UM)
- [ ] Implement Items Drive Section
  - [ ] OV Coverage weekly trend (7 cells: Baseline, W41-44, Delta, WoW)
  - [ ] Items Count weekly trend (7 cells)
- [ ] Add Strategize button (placeholder)
- [ ] Add Charts section (placeholder)

### Step 3.5: Add Loading/Error States
- [ ] Implement loading spinner
- [ ] Implement error message display
- [ ] Handle missing data (show "N/A")
- [ ] Handle KAM not in any drive (show "No data available")

**✅ Checkpoint:** Frontend displays real data

---

## 🧪 PHASE 4: TESTING

**Estimated Time:** 1 hour

### Database Tests
- [ ] Verify table structure:
  ```sql
  \d ncn_summary
  \d n2r_summary
  \d items_summary
  ```
- [ ] Check data types correct
- [ ] Verify indexes exist
- [ ] Test query performance (should be < 50ms)

### Frontend Tests

#### Test 1: KAM with All 3 Drives
- [ ] Login as: `bhuwneshwari.dhouni@zomato.com`
- [ ] Verify NCN section shows data
- [ ] Verify N2R section shows data
- [ ] Verify Items section shows data
- [ ] Compare values with CSV (spot check 3-5 metrics)

#### Test 2: KAM with Only NCN
- [ ] Find KAM in NCN CSV but not in N2R/Items
- [ ] Login as that KAM
- [ ] Verify NCN section shows data
- [ ] Verify N2R section shows "No data available"
- [ ] Verify Items section shows "No data available"

#### Test 3: Loading States
- [ ] Refresh page
- [ ] Verify loading spinner appears
- [ ] Verify data loads after spinner

#### Test 4: Error Handling
- [ ] Temporarily break database connection
- [ ] Verify error message displays
- [ ] Restore connection
- [ ] Verify data loads correctly

#### Test 5: Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Verify all cards stack/grid correctly

### Performance Tests
- [ ] Page load time < 2 seconds
- [ ] No console errors
- [ ] No memory leaks (check DevTools)
- [ ] React Query cache working (check Network tab)

**✅ Checkpoint:** All tests pass

---

## 🎉 POST-IMPLEMENTATION

### Documentation
- [ ] Update `PROJECT-STATUS.md` with completion status
- [ ] Document any issues encountered
- [ ] Note any deviations from plan

### User Feedback
- [ ] Demo to stakeholders
- [ ] Gather initial feedback
- [ ] Document feature requests

### Deferred Features
- [ ] Review `PERFORMANCE-METRICS-PENDING-INPUTS.md`
- [ ] Decide on strategize button functionality
- [ ] Choose chart types to implement
- [ ] Define access control requirements

---

## 📊 SUCCESS CRITERIA

### MVP Complete ✅
- [ ] 3 database tables created
- [ ] 252 rows imported (129 + 61 + 62)
- [ ] React hooks fetch data correctly
- [ ] KAMAnalytics page displays metrics
- [ ] All 3 drives show correctly
- [ ] Data filtered by logged-in KAM
- [ ] Loading/error states work
- [ ] Responsive design verified
- [ ] No critical bugs

---

## 🚨 TROUBLESHOOTING

### Issue: Tables not created
- [ ] Check Supabase connection
- [ ] Verify SQL syntax
- [ ] Check for existing tables with same name

### Issue: Import script fails
- [ ] Verify CSV file paths
- [ ] Check pandas installed: `pip list | grep pandas`
- [ ] Verify CSV format hasn't changed

### Issue: Frontend shows "No data"
- [ ] Verify KAM email exists in database
- [ ] Check React Query cache (hard refresh: Ctrl+Shift+R)
- [ ] Check browser console for errors
- [ ] Verify Supabase connection in frontend

### Issue: Data looks incorrect
- [ ] Compare database values with CSV
- [ ] Check column mapping in import script
- [ ] Verify special character encoding (UTF-8)

---

**Total Estimated Time:** 4-6 hours  
**Status:** Ready to begin ✅  
**Next Step:** Start Phase 1 - Database Setup 🚀

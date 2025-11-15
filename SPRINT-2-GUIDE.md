# 🚀 Sprint 2: Full Data Import - Execution Guide

**Sprint Goal:** Import all ~5,500 restaurants from CSV files and enable full system functionality  
**Estimated Time:** 4-6 hours  
**Prerequisites:** Sprint 1 complete ✅

---

## 📋 Overview

### What We're Doing
Scaling from 1 test restaurant to the full production dataset of 5,500+ restaurants.

### Data Sources
- **NCN-codes.csv:** 5,541 restaurants (128 columns)
- **N2R-Codes.csv:** 5,668 restaurants (59 columns)
- **Items-159LL.csv:** 1,909 restaurants (49 columns)

### Success Criteria
- ✅ All restaurants imported successfully
- ✅ Data integrity verified (100% accuracy)
- ✅ Multiple KAMs can see their restaurants
- ✅ Page load time <2 seconds
- ✅ RLS enabled with proper policies

---

## 🎯 Sprint 2 Tasks

### Task 1: Create Full Import Script
**Goal:** Build script to import all restaurants from all three CSVs

**Steps:**
1. Copy `scripts/import_drive_data_single.py` to `scripts/import_drive_data_full.py`
2. Modify to process all rows (not just restaurant 6503620)
3. Add batch processing (1000 restaurants at a time)
4. Add progress logging
5. Add error handling and retry logic

**Acceptance Criteria:**
- Script processes all three CSV files
- Handles missing/null values gracefully
- Logs progress every 100 restaurants
- Creates SQL INSERT statements as fallback

---

### Task 2: Import All Data
**Goal:** Execute import and populate `drive_sheets_data` table

**Method A: Python Script (if network works)**
```bash
cd scripts
python import_drive_data_full.py
```

**Method B: SQL INSERT (if Python fails)**
1. Run script to generate SQL file
2. Open Supabase SQL Editor
3. Execute generated SQL INSERT statements
4. Verify row count matches CSV totals

**Acceptance Criteria:**
- All restaurants from all CSVs imported
- No duplicate res_id entries
- NULL values handled correctly
- Row count verification passed

---

### Task 3: Verify Data Integrity
**Goal:** Ensure imported data matches source CSVs

**Verification Steps:**
1. **Count Check:**
   ```sql
   SELECT COUNT(*) FROM drive_sheets_data;
   -- Expected: ~5,500-6,000 (some restaurants in multiple drives)
   ```

2. **Sample Verification:**
   - Pick 5 random restaurants
   - Compare database values with CSV values
   - Verify all three drive types (NCN, N2R, Items)

3. **NULL Check:**
   ```sql
   SELECT res_id, res_name 
   FROM drive_sheets_data 
   WHERE res_id IS NULL OR res_name IS NULL;
   -- Expected: 0 rows
   ```

4. **KAM Distribution:**
   ```sql
   SELECT am_email, COUNT(*) as restaurant_count 
   FROM drive_sheets_data 
   GROUP BY am_email 
   ORDER BY restaurant_count DESC;
   -- Should show realistic distribution
   ```

**Acceptance Criteria:**
- Row counts match expectations
- Sample data 100% accurate
- No critical NULL values
- KAM distribution looks correct

---

### Task 4: Test Multi-User Access
**Goal:** Verify multiple KAMs can see their respective restaurants

**Test Users:**
1. gupta.ansh@zomato.com (existing test user)
2. [Pick 2 more KAMs from imported data]

**Test Steps:**
1. Login as KAM 1
2. Navigate to KAM Hub
3. Verify restaurant count matches database query
4. Open 2-3 restaurant detail pages
5. Verify data accuracy
6. Repeat for KAM 2 and KAM 3

**Acceptance Criteria:**
- Each KAM sees only their restaurants
- Restaurant counts are correct
- Detail pages load without errors
- Data displays accurately

---

### Task 5: Re-enable RLS
**Goal:** Enable Row Level Security with proper policies

**Steps:**
1. Review current RLS policy in `PROPER_RLS_POLICY.sql`
2. Test policy with sample data
3. Enable RLS:
   ```sql
   ALTER TABLE drive_sheets_data ENABLE ROW LEVEL SECURITY;
   ```
4. Verify KAMs can still access their data
5. Verify KAMs CANNOT see other KAMs' data

**Acceptance Criteria:**
- RLS enabled successfully
- KAMs see only their restaurants
- No unauthorized data access
- Performance not degraded

---

### Task 6: Performance Optimization
**Goal:** Ensure system performs well with full dataset

**Metrics to Measure:**
- Page load time (target: <2s)
- Database query time (target: <500ms)
- Memory usage
- Bundle size

**Optimization Steps:**
1. Add database indexes if needed
2. Implement pagination for restaurant list
3. Add data caching with React Query
4. Optimize SQL queries

**Acceptance Criteria:**
- KAM Hub loads in <2 seconds
- Restaurant Detail loads in <1 second
- No memory leaks
- Smooth scrolling and interactions

---

## 📊 Progress Tracking

### Checklist
- [ ] Task 1: Full import script created
- [ ] Task 2: All data imported
- [ ] Task 3: Data integrity verified
- [ ] Task 4: Multi-user testing passed
- [ ] Task 5: RLS enabled
- [ ] Task 6: Performance optimized

### Metrics Dashboard
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Restaurants Imported | ~5,500 | - | ⏳ |
| Data Accuracy | 100% | - | ⏳ |
| Page Load Time | <2s | - | ⏳ |
| KAMs Tested | 3+ | - | ⏳ |
| RLS Enabled | Yes | No | ⏳ |

---

## 🚨 Risk Mitigation

### Risk 1: Import Fails Midway
**Mitigation:** 
- Batch processing (1000 at a time)
- Transaction rollback on error
- Resume capability from last successful batch

### Risk 2: Performance Degradation
**Mitigation:**
- Baseline metrics before import
- Incremental testing (1000, 2000, 3000, etc.)
- Database indexes ready

### Risk 3: Data Corruption
**Mitigation:**
- Backup `drive_sheets_data` before import
- Validation script to compare CSV vs DB
- Rollback plan ready

### Risk 4: RLS Blocks Access
**Mitigation:**
- Test RLS on subset of data first
- Keep disable script handy
- Document JWT token structure

---

## 🔄 Rollback Plan

If anything goes wrong:

1. **Disable RLS:**
   ```sql
   ALTER TABLE drive_sheets_data DISABLE ROW LEVEL SECURITY;
   ```

2. **Clear imported data:**
   ```sql
   DELETE FROM drive_sheets_data WHERE res_id != '6503620';
   ```

3. **Restore test data:**
   - Re-run `insert_test_restaurant.sql`

4. **Verify system works:**
   - Login as gupta.ansh@zomato.com
   - Check restaurant 6503620 displays correctly

---

## 📞 Support & Resources

### Key Files
- **Import Script:** `scripts/import_drive_data_full.py` (to be created)
- **RLS Policy:** `PROPER_RLS_POLICY.sql`
- **Schema:** `supabase/drive_sheets_data_schema.sql`

### Documentation
- **PROJECT-STATUS.md** - Current status
- **IMPORTANT-NOTES.md** - Critical warnings
- **SPRINT-1-COMPLETION-REPORT.md** - Sprint 1 learnings

### Test Data
- **Test Restaurant:** 6503620 (Kanha Veg)
- **Test KAM:** gupta.ansh@zomato.com

---

## ✅ Definition of Done

Sprint 2 is complete when:
- ✅ All ~5,500 restaurants imported
- ✅ Data integrity verified at 100%
- ✅ 3+ KAMs tested successfully
- ✅ RLS enabled and working
- ✅ Performance targets met (<2s load time)
- ✅ No console errors
- ✅ Documentation updated

---

**Ready to start?** Begin with Task 1: Create Full Import Script


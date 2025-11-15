# KAM Hub Updates - Testing Guide

## Overview
This guide covers testing the 4 major updates to the KAM Hub page:

1. ✅ Sept OV display (order count instead of currency)
2. ✅ Performance Metrics showing NCN, N2R, Items ≤159, Active Drives
3. ✅ KAM rankings for each drive
4. ✅ Daily rank movement indicators

## Prerequisites

### 1. Database Migration
Execute the SQL migration first:
```bash
# See EXECUTE-KAM-RANKINGS-MIGRATION.md for detailed steps
```

### 2. Performance Metrics Data
Ensure these tables have data:
- `ncn_summary`
- `n2r_summary`
- `items_summary`

### 3. Test KAM Emails
Use these KAM emails for testing:
- `bhuwneshwari.dhouni@zomato.com`
- `rinkel.shah@zomato.com`
- `shiwani.jha@zomato.com`

## Test Cases

### Test 1: Sept OV Display Fix

**What Changed:**
- Before: `₹2K Sept OV` (currency format)
- After: `2.0K Sept OV` (order count format)

**Steps:**
1. Login as any KAM
2. Navigate to KAM Hub (`/kam-hub`)
3. Look at restaurant cards

**Expected Results:**
- Sept OV shows as order count (e.g., `2.0K`, `10.5K`)
- No rupee symbol (₹)
- Format: `{number}K Sept OV`

**Test Data:**
```sql
-- Check actual sept_ov values
SELECT res_name, sept_ov 
FROM drive_sheets_data 
WHERE am_email = 'bhuwneshwari.dhouni@zomato.com'
ORDER BY CAST(sept_ov AS NUMERIC) DESC
LIMIT 10;
```

---

### Test 2: Performance Metrics Section

**What Changed:**
- Before: Hardcoded values (NCN: 25%, N2R: 18%, MRP: ₹45K, Active: 127)
- After: Real data from database (NCN, N2R, Items ≤159, Active Drives)

**Steps:**
1. Login as test KAM
2. Navigate to KAM Hub
3. Check Performance Metrics card (right side)

**Expected Results:**
- Shows 4 metrics: NCN, N2R, Items ≤159, Active
- Each shows rank (e.g., #5, #12, #3)
- Ranks are real data from database
- Active Drives shows count (0-3)

**Verification Queries:**
```sql
-- Check NCN rank
SELECT * FROM ncn_rankings 
WHERE kam_email = 'bhuwneshwari.dhouni@zomato.com';

-- Check N2R rank
SELECT * FROM n2r_rankings 
WHERE kam_email = 'bhuwneshwari.dhouni@zomato.com';

-- Check Items rank
SELECT * FROM items_rankings 
WHERE kam_email = 'bhuwneshwari.dhouni@zomato.com';

-- Check active drives
SELECT get_kam_active_drives('bhuwneshwari.dhouni@zomato.com');
```

---

### Test 3: KAM Rankings Display

**What Changed:**
- Now shows actual rank for each drive
- Rank displayed as #1, #2, #3, etc.
- Gold (#1), Silver (#2), Bronze (#3) styling

**Steps:**
1. Login as different KAMs
2. Compare their ranks
3. Verify rank numbers match database

**Expected Results:**
- Rank #1 shows in gold/yellow color
- Rank #2 shows in silver/gray color
- Rank #3 shows in bronze/orange color
- Ranks 4-10 show in blue
- Other ranks show in default color
- N/A shown if KAM not in that drive

**Test Multiple KAMs:**
```sql
-- Get top 10 NCN rankings
SELECT kam_email, rank, metric_value 
FROM ncn_rankings 
ORDER BY rank 
LIMIT 10;

-- Get top 10 N2R rankings
SELECT kam_email, rank, metric_value 
FROM n2r_rankings 
ORDER BY rank 
LIMIT 10;

-- Get top 10 Items rankings
SELECT kam_email, rank, metric_value 
FROM items_rankings 
ORDER BY rank 
LIMIT 10;
```

---

### Test 4: Rank Movement Indicators

**What Changed:**
- Shows daily rank change (e.g., ↑ 3 ranks, ↓ 2 ranks)
- Green badge for improvement (moved up)
- Red badge for decline (moved down)
- No badge if no change

**Steps:**
1. Populate initial rank history (see migration guide)
2. Wait 1 day OR manually insert yesterday's data
3. Update today's rankings
4. Check movement indicators

**Expected Results:**
- Green badge with up arrow for improved ranks
- Red badge with down arrow for declined ranks
- No badge if rank unchanged
- Badge shows number of ranks moved

**Manual Test Data:**
```sql
-- Insert yesterday's data (for testing)
INSERT INTO kam_rank_history (kam_email, date, ncn_rank, n2r_rank, items_rank, active_drives_count)
VALUES 
  ('bhuwneshwari.dhouni@zomato.com', CURRENT_DATE - INTERVAL '1 day', 10, 15, 8, 3),
  ('rinkel.shah@zomato.com', CURRENT_DATE - INTERVAL '1 day', 5, 8, 12, 3);

-- Now check performance summary
SELECT * FROM get_kam_performance_summary('bhuwneshwari.dhouni@zomato.com');
```

**Rank Change Calculation:**
- `rank_change = previous_rank - current_rank`
- Positive = improved (e.g., from rank 10 to rank 7 = +3)
- Negative = declined (e.g., from rank 5 to rank 8 = -3)

---

### Test 5: Active Drives Count

**What Changed:**
- Shows actual count of drives KAM participates in
- Count ranges from 0 to 3 (NCN, N2R, Items)

**Steps:**
1. Login as different KAMs
2. Check Active Drives number
3. Verify against database

**Expected Results:**
- Shows 0-3 based on drive participation
- Matches database query results

**Verification:**
```sql
-- Check drive participation
SELECT 
  am_email,
  COUNT(DISTINCT CASE WHEN ncn_p1 IS NOT NULL THEN 'NCN' END) as has_ncn,
  COUNT(DISTINCT CASE WHEN n2r_la_current_code IS NOT NULL THEN 'N2R' END) as has_n2r,
  COUNT(DISTINCT CASE WHEN items_priority IS NOT NULL THEN 'Items' END) as has_items,
  (
    COUNT(DISTINCT CASE WHEN ncn_p1 IS NOT NULL THEN 'NCN' END) +
    COUNT(DISTINCT CASE WHEN n2r_la_current_code IS NOT NULL THEN 'N2R' END) +
    COUNT(DISTINCT CASE WHEN items_priority IS NOT NULL THEN 'Items' END)
  ) as total_drives
FROM drive_sheets_data
WHERE am_email = 'bhuwneshwari.dhouni@zomato.com'
GROUP BY am_email;
```

---

## Edge Cases to Test

### 1. KAM Not in Any Drive
- Should show N/A for all drive ranks
- Active Drives should show 0

### 2. KAM in Only One Drive
- Should show rank for that drive
- N/A for other drives
- Active Drives should show 1

### 3. New KAM (No Historical Data)
- Rank changes should show 0 or no badge
- Ranks should display correctly

### 4. Tied Ranks
- Multiple KAMs with same metric value
- Should show same rank number

---

## Visual Verification Checklist

- [ ] Sept OV shows without ₹ symbol
- [ ] Sept OV shows as order count (e.g., 2.0K)
- [ ] Performance Metrics shows 4 cards
- [ ] NCN rank displays correctly
- [ ] N2R rank displays correctly
- [ ] Items ≤159 rank displays correctly
- [ ] Active Drives count is correct
- [ ] Rank #1 shows in gold color
- [ ] Rank #2 shows in silver color
- [ ] Rank #3 shows in bronze color
- [ ] Movement badges show for changed ranks
- [ ] Green badge for improvements
- [ ] Red badge for declines
- [ ] No badge for unchanged ranks
- [ ] Loading state shows while fetching data
- [ ] N/A shows for drives KAM doesn't participate in

---

## Troubleshooting

### Issue: All ranks show N/A
**Solution:** Check if performance metrics tables have data

### Issue: Rank changes always 0
**Solution:** Populate kam_rank_history table with baseline data

### Issue: Sept OV still shows ₹
**Solution:** Clear browser cache and reload

### Issue: Loading spinner never stops
**Solution:** Check browser console for errors, verify Supabase connection

---

## Success Criteria

✅ All 4 test cases pass
✅ Visual verification checklist complete
✅ No console errors
✅ Data matches database queries
✅ Rank movements calculate correctly


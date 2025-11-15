# KAM Hub Updates - Execution Checklist

## 🎯 Quick Start Guide

Follow these steps in order to deploy the KAM Hub updates:

---

## Step 1: Execute Database Migration ⚡

### Option A: Manual Execution (Recommended)

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Copy and Execute SQL**
   - Open file: `supabase/migrations/add_kam_rankings.sql`
   - Copy the entire content (232 lines)
   - Paste into SQL Editor
   - Click **Run** or press `Ctrl+Enter`

3. **Verify Success**
   - Check for success messages
   - No errors should appear (ignore "already exists" warnings if re-running)

### Option B: Using Python Script

```bash
# Set environment variables
export VITE_SUPABASE_URL="your-supabase-url"
export VITE_SUPABASE_ANON_KEY="your-anon-key"

# Run migration
python scripts/execute_kam_rankings_migration.py
```

---

## Step 2: Verify Database Objects ✅

Run these queries in Supabase SQL Editor:

```sql
-- Check table created
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'kam_rank_history';

-- Check views created
SELECT table_name FROM information_schema.views 
WHERE table_name IN ('ncn_rankings', 'n2r_rankings', 'items_rankings');

-- Check functions created
SELECT routine_name FROM information_schema.routines 
WHERE routine_name IN ('get_kam_active_drives', 'get_kam_performance_summary');

-- Test rankings (should return data)
SELECT * FROM ncn_rankings ORDER BY rank LIMIT 5;
SELECT * FROM n2r_rankings ORDER BY rank LIMIT 5;
SELECT * FROM items_rankings ORDER BY rank LIMIT 5;
```

**Expected:** All queries return results with no errors

---

## Step 3: Populate Initial Rank History 📊

This enables rank movement tracking. Run in Supabase SQL Editor:

```sql
INSERT INTO kam_rank_history (
  kam_email, date, 
  ncn_rank, ncn_metric_value,
  n2r_rank, n2r_metric_value,
  items_rank, items_metric_value,
  active_drives_count
)
SELECT 
  COALESCE(ncn.kam_email, n2r.kam_email, items.kam_email) as kam_email,
  CURRENT_DATE as date,
  ncn.rank as ncn_rank,
  ncn.metric_value as ncn_metric_value,
  n2r.rank as n2r_rank,
  n2r.metric_value as n2r_metric_value,
  items.rank as items_rank,
  items.metric_value as items_metric_value,
  get_kam_active_drives(COALESCE(ncn.kam_email, n2r.kam_email, items.kam_email)) as active_drives_count
FROM ncn_rankings ncn
FULL OUTER JOIN n2r_rankings n2r ON ncn.kam_email = n2r.kam_email
FULL OUTER JOIN items_rankings items ON COALESCE(ncn.kam_email, n2r.kam_email) = items.kam_email
ON CONFLICT (kam_email, date) DO UPDATE SET
  ncn_rank = EXCLUDED.ncn_rank,
  ncn_metric_value = EXCLUDED.ncn_metric_value,
  n2r_rank = EXCLUDED.n2r_rank,
  n2r_metric_value = EXCLUDED.n2r_metric_value,
  items_rank = EXCLUDED.items_rank,
  items_metric_value = EXCLUDED.items_metric_value,
  active_drives_count = EXCLUDED.active_drives_count;
```

**Verify:**
```sql
SELECT COUNT(*) FROM kam_rank_history WHERE date = CURRENT_DATE;
```
Should return number of unique KAMs

---

## Step 4: Test Frontend Changes 🧪

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Sept OV Display

1. Login as any KAM
2. Navigate to KAM Hub (`/kam-hub`)
3. Check restaurant cards

**Expected:**
- Sept OV shows as `2.0K Sept OV` (no ₹ symbol)
- Format is order count, not currency

### 4.3 Test Performance Metrics

1. Check Performance Metrics card (right side)
2. Verify 4 metrics display:
   - NCN (with rank)
   - N2R (with rank)
   - Items ≤159 (with rank)
   - Active Drives (with count)

**Expected:**
- Each shows rank number (e.g., #5, #12, #3)
- Ranks match database queries
- Active Drives shows 0-3

### 4.4 Test Rank Display

**Expected:**
- Rank #1 in gold/yellow color
- Rank #2 in silver/gray color
- Rank #3 in bronze/orange color
- Ranks 4-10 in blue
- N/A for drives KAM doesn't participate in

### 4.5 Test Rank Movements

**Note:** Movements will show 0 initially. To test:

```sql
-- Insert yesterday's data (for testing)
INSERT INTO kam_rank_history (kam_email, date, ncn_rank, n2r_rank, items_rank, active_drives_count)
VALUES 
  ('bhuwneshwari.dhouni@zomato.com', CURRENT_DATE - INTERVAL '1 day', 10, 15, 8, 3);

-- Refresh page
```

**Expected:**
- Green badge with up arrow for improved ranks
- Red badge with down arrow for declined ranks
- Badge shows number of ranks moved

---

## Step 5: Verify No Errors 🔍

### Check Browser Console
- Open DevTools (F12)
- Check Console tab
- Should have no errors

### Check Network Tab
- Verify API calls succeed
- Check Supabase RPC calls return data

---

## Step 6: Test with Multiple KAMs 👥

Test with these KAM emails:
- `bhuwneshwari.dhouni@zomato.com`
- `rinkel.shah@zomato.com`
- `shiwani.jha@zomato.com`

**Verify:**
- Different ranks for different KAMs
- Active drives count varies
- Data is KAM-specific

---

## Completion Checklist ✅

- [ ] Database migration executed
- [ ] All tables/views/functions created
- [ ] Initial rank history populated
- [ ] Sept OV displays correctly (no ₹)
- [ ] Performance Metrics shows 4 cards
- [ ] Ranks display correctly
- [ ] Rank colors work (gold/silver/bronze)
- [ ] Active drives count is accurate
- [ ] No console errors
- [ ] Tested with multiple KAMs
- [ ] Code formatted with Prettier ✅

---

## Daily Maintenance (Optional) 🔄

To track rank movements over time, run this daily:

```sql
-- Add to cron job or run manually each day
INSERT INTO kam_rank_history (...)
SELECT ... FROM ncn_rankings ...
ON CONFLICT (kam_email, date) DO UPDATE ...
```

---

## Troubleshooting 🔧

### Issue: Ranks show N/A
**Solution:** Ensure performance metrics tables have data

### Issue: Movements always 0
**Solution:** Populate kam_rank_history with baseline data

### Issue: Sept OV still shows ₹
**Solution:** Clear browser cache, hard reload (Ctrl+Shift+R)

### Issue: Loading spinner never stops
**Solution:** Check console for errors, verify Supabase connection

---

## Documentation 📚

- **Migration Guide:** `EXECUTE-KAM-RANKINGS-MIGRATION.md`
- **Testing Guide:** `KAM-HUB-UPDATES-TESTING-GUIDE.md`
- **Summary:** `KAM-HUB-UPDATES-SUMMARY.md`
- **This Checklist:** `EXECUTION-CHECKLIST.md`

---

## Support 💬

If you encounter issues:
1. Check browser console for errors
2. Verify database migration completed
3. Check Supabase logs
4. Review testing guide for specific test cases

---

**Ready to deploy!** 🚀


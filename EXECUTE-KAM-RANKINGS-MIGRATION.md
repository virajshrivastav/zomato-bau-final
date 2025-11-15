# Execute KAM Rankings Migration

## Overview
This guide explains how to execute the SQL migration to add KAM rankings functionality.

## What This Migration Does

1. **Creates `kam_rank_history` table** - Stores daily rank snapshots for tracking movements
2. **Creates ranking views**:
   - `ncn_rankings` - NCN drive rankings based on overall_ov_coverage
   - `n2r_rankings` - N2R drive rankings based on average conversions
   - `items_rankings` - Items drive rankings based on ov_delta
3. **Creates functions**:
   - `get_kam_active_drives(email)` - Counts active drives for a KAM
   - `get_kam_performance_summary(email)` - Gets complete performance data with ranks and movements

## Execution Steps

### Option 1: Manual Execution (Recommended)

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Copy SQL Content**
   - Open file: `supabase/migrations/add_kam_rankings.sql`
   - Copy the entire content

3. **Execute SQL**
   - Paste the SQL into the SQL Editor
   - Click **Run** or press `Ctrl+Enter`

4. **Verify Execution**
   - Check for success messages
   - Verify tables/views/functions were created

### Option 2: Using Python Script

```bash
# Set environment variables (if not already set)
export VITE_SUPABASE_URL="your-supabase-url"
export VITE_SUPABASE_ANON_KEY="your-anon-key"

# Run the migration script
python scripts/execute_kam_rankings_migration.py
```

## Verification Queries

After executing the migration, run these queries to verify:

```sql
-- Check table created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'kam_rank_history';

-- Check views created
SELECT table_name 
FROM information_schema.views 
WHERE table_name IN ('ncn_rankings', 'n2r_rankings', 'items_rankings');

-- Check functions created
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_kam_active_drives', 'get_kam_performance_summary')
  AND routine_type = 'FUNCTION';

-- Test NCN rankings
SELECT * FROM ncn_rankings ORDER BY rank LIMIT 10;

-- Test N2R rankings
SELECT * FROM n2r_rankings ORDER BY rank LIMIT 10;

-- Test Items rankings
SELECT * FROM items_rankings ORDER BY rank LIMIT 10;

-- Test active drives function
SELECT get_kam_active_drives('bhuwneshwari.dhouni@zomato.com');

-- Test performance summary function
SELECT * FROM get_kam_performance_summary('bhuwneshwari.dhouni@zomato.com');
```

## Expected Results

### NCN Rankings
- Should show all KAMs from `ncn_summary` table
- Ranked by `overall_ov_coverage` (descending)
- Higher percentage = better rank

### N2R Rankings
- Should show all KAMs from `n2r_summary` table
- Ranked by average of LA, MM, UM conversions
- Higher average = better rank

### Items Rankings
- Should show all KAMs from `items_summary` table
- Ranked by `ov_delta`
- Higher delta = better rank

### Active Drives Count
- Should return 0-3 (number of drives KAM participates in)
- NCN, N2R, and/or Items

### Performance Summary
- Returns one row with all metrics for the KAM
- Includes ranks, metric values, and rank changes
- Rank changes will be 0 initially (no historical data yet)

## Populating Initial Rank History

To enable rank movement tracking, you need to populate the `kam_rank_history` table:

```sql
-- Insert today's rankings as baseline
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

## Troubleshooting

### Error: "relation already exists"
- This is normal if you're re-running the migration
- The migration uses `IF NOT EXISTS` clauses
- You can safely ignore these errors

### Error: "function already exists"
- Use `CREATE OR REPLACE FUNCTION` (already in migration)
- This will update the function definition

### No data in rankings views
- Ensure `ncn_summary`, `n2r_summary`, `items_summary` tables have data
- Run the performance metrics import first

### Rank changes always 0
- This is expected initially
- Populate `kam_rank_history` with baseline data
- Wait until next day for actual changes to appear

## Next Steps

1. ✅ Execute migration
2. ✅ Verify tables/views/functions created
3. ✅ Test queries
4. ✅ Populate initial rank history
5. ✅ Test frontend changes
6. ✅ Set up daily rank history updates (cron job or manual)


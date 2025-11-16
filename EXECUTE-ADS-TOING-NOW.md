# Execute ADs and Toing Data Import - Quick Start

## ⚡ Quick Execution Steps

### 1️⃣ Add Database Columns (1 minute)

Open Supabase SQL Editor and execute:
```bash
supabase/add_ads_toing_columns.sql
```

**Expected Output:**
```
ALTER TABLE
ALTER TABLE
column_name          | data_type
---------------------|----------
ads_avg_achievement  | text
toing_flag          | text
```

---

### 2️⃣ Generate SQL Files (30 seconds)

Run in terminal:
```bash
python scripts/import_ads_toing_data.py
```

**Expected Output:**
```
✅ ADs Data: 46 KAMs
✅ Toing Data: 6610 restaurants

📄 Generated SQL Files:
  1. update_ads_data.sql
  2. update_toing_data.sql
```

---

### 3️⃣ Import ADs Data (1 minute)

Open Supabase SQL Editor and execute:
```bash
update_ads_data.sql
```

**Expected:** 46 UPDATE statements executed

---

### 4️⃣ Import Toing Data (2-3 minutes)

Open Supabase SQL Editor and execute:
```bash
update_toing_data.sql
```

**Expected:** 6,610 UPDATE statements executed

⚠️ **Note:** This file is large (26,440 lines). It may take 2-3 minutes to execute.

---

### 5️⃣ Verify Data (30 seconds)

Run in Supabase SQL Editor:

```sql
-- Check ADs data coverage
SELECT 
  COUNT(DISTINCT am_email) as kams_with_ads,
  COUNT(*) as restaurants_with_ads
FROM drive_sheets_data
WHERE ads_avg_achievement IS NOT NULL;

-- Expected: 46 KAMs, ~6625 restaurants

-- Check Toing data coverage
SELECT 
  toing_flag,
  COUNT(*) as count
FROM drive_sheets_data
WHERE toing_flag IS NOT NULL
GROUP BY toing_flag;

-- Expected: "Live" and "Not Live" counts

-- Sample data
SELECT res_id, res_name, am_email, ads_avg_achievement, toing_flag
FROM drive_sheets_data
WHERE ads_avg_achievement IS NOT NULL 
  AND toing_flag IS NOT NULL
LIMIT 5;
```

---

### 6️⃣ Test Frontend (1 minute)

1. Start the dev server (if not running):
   ```bash
   npm run dev
   ```

2. Navigate to any restaurant detail page

3. Verify:
   - **TOING Flag** metric card shows "Live" or "Not Live" (not hardcoded "Not Live")
   - **ADS Budget** card description shows "Avg Achievement: X%" if KAM has ADs data

---

## ✅ Success Criteria

- [ ] Database columns added successfully
- [ ] SQL files generated (46 + 6,610 statements)
- [ ] ADs data imported (46 KAMs)
- [ ] Toing data imported (6,610 restaurants)
- [ ] Verification queries return expected results
- [ ] Frontend displays real data (not hardcoded)

---

## 🔧 Troubleshooting

### Issue: SQL file too large for Supabase editor

**Solution:** Split the file or use Supabase CLI:
```bash
# Install Supabase CLI if needed
npm install -g supabase

# Execute SQL file
supabase db execute -f update_toing_data.sql
```

### Issue: Some restaurants don't have Toing data

**Expected:** Only 6,610 out of 6,625 restaurants have Toing data. The remaining 15 will have NULL values, which is fine.

### Issue: Frontend still shows hardcoded values

**Solution:** 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify data exists in database

---

## 📊 Expected Results

| Metric | Value |
|--------|-------|
| KAMs with ADs data | 46 |
| Restaurants with Toing data | 6,610 |
| Restaurants without Toing data | 15 |
| Total execution time | ~5 minutes |

---

## 📁 Files Reference

- **Schema:** `supabase/add_ads_toing_columns.sql`
- **Import Script:** `scripts/import_ads_toing_data.py`
- **Generated SQL:** `update_ads_data.sql`, `update_toing_data.sql`
- **Full Guide:** `ADS-TOING-IMPLEMENTATION-GUIDE.md`


# ⚡ Quick Start - Sprint 2

**Goal:** Import all ~5,500 restaurants  
**Time:** 4-6 hours  
**Prerequisites:** Sprint 1 complete ✅

---

## 🎯 What You Need

### Files
- ✅ `drive-data/NCN-codes.csv` (5,541 restaurants)
- ✅ `drive-data/N2R-Codes.csv` (5,668 restaurants)
- ✅ `drive-data/Items-159LL.csv` (1,909 restaurants)
- ✅ `supabase/drive_sheets_data_schema.sql` (table exists)

### Access
- ✅ Supabase project access
- ✅ SQL Editor access
- ✅ Python environment (optional)

---

## 🚀 Quick Steps

### Step 1: Create Import Script (1 hour)
```bash
cd scripts
# Copy single import script
cp import_drive_data_single.py import_drive_data_full.py
# Edit to process all rows (not just 6503620)
```

**Key changes:**
- Remove `if res_id == '6503620'` filter
- Add batch processing (1000 rows at a time)
- Add progress logging

---

### Step 2: Run Import (2-3 hours)

**Option A: Python (if network works)**
```bash
python import_drive_data_full.py
```

**Option B: SQL (if Python fails)**
```bash
# Generate SQL file
python import_drive_data_full.py --generate-sql

# Open Supabase SQL Editor
# Paste and execute generated SQL
```

---

### Step 3: Verify Data (30 min)

**Count check:**
```sql
SELECT COUNT(*) FROM drive_sheets_data;
-- Expected: ~5,500-6,000
```

**Sample check:**
```sql
SELECT * FROM drive_sheets_data 
WHERE res_id IN ('6503620', 'PICK_RANDOM_1', 'PICK_RANDOM_2')
LIMIT 3;
```

**KAM distribution:**
```sql
SELECT am_email, COUNT(*) as count 
FROM drive_sheets_data 
GROUP BY am_email 
ORDER BY count DESC 
LIMIT 10;
```

---

### Step 4: Test Multi-User (30 min)

1. Login as `gupta.ansh@zomato.com`
2. Check restaurant count in KAM Hub
3. Open 2-3 restaurant details
4. Repeat with 2 more KAMs

---

### Step 5: Enable RLS (30 min)

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE drive_sheets_data ENABLE ROW LEVEL SECURITY;

-- Test: Login as KAM and verify access
```

---

### Step 6: Performance Check (30 min)

- KAM Hub load time: Target <2s
- Restaurant Detail load time: Target <1s
- Check browser console for errors

---

## ✅ Success Checklist

- [ ] All restaurants imported (~5,500)
- [ ] Data accuracy verified (sample check)
- [ ] 3+ KAMs tested successfully
- [ ] RLS enabled and working
- [ ] Page load times <2s
- [ ] No console errors

---

## 🚨 If Something Goes Wrong

### Import fails midway
```sql
-- Check how many imported
SELECT COUNT(*) FROM drive_sheets_data;

-- Delete partial import
DELETE FROM drive_sheets_data WHERE res_id != '6503620';

-- Start over
```

### RLS blocks access
```sql
-- Disable RLS temporarily
ALTER TABLE drive_sheets_data DISABLE ROW LEVEL SECURITY;

-- Debug and fix policy
-- Re-enable when ready
```

### Performance issues
```sql
-- Add indexes
CREATE INDEX idx_am_email ON drive_sheets_data(am_email);
CREATE INDEX idx_res_id ON drive_sheets_data(res_id);
```

---

## 📞 Quick Reference

### Test Users
- gupta.ansh@zomato.com (password: 1234)
- [Add 2 more from imported data]

### Key Commands
```bash
# Start dev server
npm run dev

# Test Supabase connection
python scripts/test_supabase_connection.py

# Check logs
# (Check terminal output during import)
```

### Important Files
- **Import script:** `scripts/import_drive_data_full.py`
- **RLS policy:** `PROPER_RLS_POLICY.sql`
- **Rollback:** `QUICK_FIX_RLS.sql`

---

## 📊 Expected Results

### Before Sprint 2
- Restaurants in DB: 1
- KAMs with data: 1
- RLS: Disabled

### After Sprint 2
- Restaurants in DB: ~5,500
- KAMs with data: ~50+
- RLS: Enabled
- Page load: <2s

---

**Detailed guide:** See [SPRINT-2-GUIDE.md](SPRINT-2-GUIDE.md)  
**Current status:** See [PROJECT-STATUS.md](PROJECT-STATUS.md)


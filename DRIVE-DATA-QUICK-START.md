# 🚀 Drive Data Implementation - Quick Start Guide

**Goal:** Display drive data for restaurant `6503620` (Kanha Veg) on the frontend.

---

## ⚡ STEP 1: Create Database Table (5 minutes)

### 1.1 Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### 1.2 Run Schema SQL
1. Open file: `supabase/drive_sheets_data_schema.sql`
2. Copy ALL contents
3. Paste into Supabase SQL Editor
4. Click **Run** button

### 1.3 Verify Table Created
Run this query to verify:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'drive_sheets_data';
```

**Expected:** Should return 1 row with `drive_sheets_data`

---

## ⚡ STEP 2: Import Test Restaurant Data (2 minutes)

### 2.1 Install Python Dependencies
```bash
pip install pandas supabase python-dotenv
```

### 2.2 Verify Environment Variables
Check your `.env` file has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2.3 Run Import Script
```bash
python scripts/import_drive_data_single.py
```

**Expected Output:**
```
============================================================
🚀 Drive Data Import - Single Restaurant Test
============================================================
Test Restaurant ID: 6503620
Test Restaurant: Kanha Veg
KAM Email: gupta.ansh@zomato.com
============================================================

📂 Loading NCN data for restaurant 6503620...
   ✅ NCN data loaded: Kanha Veg (gupta.ansh@zomato.com)
📂 Loading N2R data for restaurant 6503620...
   ✅ N2R data loaded: LA AOV=270, MM AOV=275
📂 Loading Items data for restaurant 6503620...
   ✅ Items data loaded: Priority=P0, POS=Z Dashboard
🔄 Merging data from all sources...
   ✅ Merged data: 150+ fields
📤 Uploading to Supabase...
   ✅ Upload successful!
   📊 Restaurant: Kanha Veg (6503620)
   👤 KAM: gupta.ansh@zomato.com

============================================================
✅ IMPORT COMPLETE!
============================================================
```

---

## ⚡ STEP 3: Verify Data in Supabase (1 minute)

### 3.1 Check Data
Run this query in Supabase SQL Editor:
```sql
SELECT 
  res_id,
  res_name,
  am_email,
  ncn_p1,
  ncn_p2,
  n2r_la_current_aov,
  items_priority
FROM drive_sheets_data
WHERE res_id = '6503620';
```

**Expected:** Should return 1 row with:
- `res_name`: Kanha Veg
- `am_email`: gupta.ansh@zomato.com
- `ncn_p1`: Salt 20-40%
- `n2r_la_current_aov`: 270
- `items_priority`: P0

---

## ⚡ STEP 4: Update Frontend (Next Phase)

### Files to Update:
1. `src/hooks/useRestaurants.ts` - Already queries `drive_sheets_data`
2. `src/pages/RestaurantDetail.tsx` - Map real data to UI components

### What to Check:
- [ ] NCN priorities display correctly
- [ ] N2R AOV values show real data (not mock)
- [ ] Items dish suggestions appear
- [ ] No console errors

---

## 🐛 TROUBLESHOOTING

### Error: "Missing Supabase credentials"
**Fix:** Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Error: "relation 'drive_sheets_data' does not exist"
**Fix:** Run Step 1 again - create the table in Supabase

### Error: "Restaurant not found in CSV"
**Fix:** Verify CSV files are in `drive-data/` folder

### Import succeeds but no data shows on frontend
**Fix:** 
1. Check RLS policies are enabled
2. Login as `gupta.ansh@zomato.com` (the KAM for this restaurant)
3. Clear browser cache and reload

---

## ✅ SUCCESS CRITERIA

You'll know it's working when:
- ✅ Import script completes without errors
- ✅ Data visible in Supabase dashboard
- ✅ Restaurant detail page shows real data (not mock)
- ✅ NCN section shows priorities: "Salt 20-40%", "DOTD", "Stepper", etc.
- ✅ N2R section shows AOV: ₹270 (LA), ₹275 (MM), ₹332 (UM)
- ✅ Items section shows Priority: P0, POS: Z Dashboard

---

## 📞 NEXT STEPS AFTER SUCCESS

Once the test restaurant works:
1. Create full import script for all restaurants
2. Import all ~5,500 restaurants
3. Test with multiple KAM logins
4. Performance optimization if needed
5. Deploy to production

---

## 📋 FILES CREATED

- ✅ `DRIVE-DATA-IMPLEMENTATION-PLAN.md` - Overall strategy
- ✅ `DRIVE-DATA-PROGRESS.md` - Detailed progress tracker
- ✅ `DRIVE-DATA-QUICK-START.md` - This file
- ✅ `supabase/drive_sheets_data_schema.sql` - Database schema
- ✅ `scripts/import_drive_data_single.py` - Import script

---

**Ready to start? Begin with STEP 1! 🚀**


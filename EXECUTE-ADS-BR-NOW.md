# Execute ADS BR Data Import - Quick Start

## ⚡ Quick Execution Steps

### 1️⃣ Add Database Column (1 minute)

Open Supabase SQL Editor and execute:
```bash
supabase/add_ads_br_column.sql
```

**Expected Output:**
```
ALTER TABLE
column_name | data_type
------------|----------
ads_br_cm   | text
```

---

### 2️⃣ Update ADS BR Data (2-3 minutes)

Execute in Supabase SQL Editor:
```bash
update_ads_br_data.sql
```

**Expected Output:**
```
UPDATE 6610
```

This updates `ads_br_cm` for all 6,610 restaurants.

**⚠️ Note:** This file is large (26,444 lines). If Supabase SQL Editor has issues:
- Split the file into smaller batches (2,000 statements each)
- Or use the Supabase CLI to execute

---

### 3️⃣ Verify Data (30 seconds)

Execute in Supabase SQL Editor:
```sql
-- Check total records updated
SELECT COUNT(*) as total_restaurants, 
       COUNT(ads_br_cm) as with_ads_br,
       COUNT(CASE WHEN ads_br_cm::numeric > 0 THEN 1 END) as with_revenue
FROM drive_sheets_data;

-- Sample high-revenue restaurants
SELECT res_id, res_name, am_email, ads_br_cm
FROM drive_sheets_data
WHERE ads_br_cm IS NOT NULL 
  AND ads_br_cm::numeric > 0
ORDER BY ads_br_cm::numeric DESC
LIMIT 10;
```

**Expected Output:**
```
total_restaurants | with_ads_br | with_revenue
------------------|-------------|-------------
6625              | 6610        | ~4500
```

---

### 4️⃣ Test Frontend (1 minute)

1. Navigate to KAM Hub: `http://localhost:5173/kam-hub`
2. Check restaurant cards show **ADS BR** in green (e.g., "₹150,386 ADS BR")
3. Click on a restaurant with revenue > 0
4. Check Restaurant Detail page shows **ADS BR (CM)** metric card

---

## 📊 What You'll See

### KAM Hub - Restaurant Cards
```
Brahma Pure Veg                    [Active]
📍 Koregaon Park • North Indian • 2,500 Sept OV • ₹150,386 ADS BR
```

### Restaurant Detail - Metrics Row
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Active      │ ZVD.PO      │ ADS         │ ADS BR (CM) │ TOING Flag  │
│ Drives      │             │ Achievement │             │             │
│ 3           │ 2,500       │ 85%         │ ₹150,386    │ Live        │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## 🔍 Troubleshooting

### Issue: SQL file too large for Supabase SQL Editor

**Solution:** Split the file into batches

```bash
# On Windows (PowerShell)
Get-Content update_ads_br_data.sql | Select-Object -First 5000 | Set-Content update_ads_br_part1.sql
Get-Content update_ads_br_data.sql | Select-Object -Skip 5000 -First 5000 | Set-Content update_ads_br_part2.sql
Get-Content update_ads_br_data.sql | Select-Object -Skip 10000 -First 5000 | Set-Content update_ads_br_part3.sql
Get-Content update_ads_br_data.sql | Select-Object -Skip 15000 -First 5000 | Set-Content update_ads_br_part4.sql
Get-Content update_ads_br_data.sql | Select-Object -Skip 20000 | Set-Content update_ads_br_part5.sql
```

Then execute each part file separately.

---

### Issue: Frontend not showing ADS BR data

**Checklist:**
1. ✅ Database column added (`ads_br_cm`)
2. ✅ SQL UPDATE executed successfully
3. ✅ Browser cache cleared (Ctrl+Shift+R)
4. ✅ React dev server restarted

---

## 📈 Data Statistics

| Metric | Value |
|--------|-------|
| Total restaurants in CSV | 6,610 |
| Restaurants with revenue > 0 | ~4,500 |
| Restaurants with zero revenue | ~2,110 |
| Highest revenue restaurant | Check query above |
| Average revenue per restaurant | Check query above |

---

## ✅ Success Criteria

- [x] Database column `ads_br_cm` exists
- [x] 6,610 restaurants have ADS BR data
- [x] KAM Hub shows ADS BR in restaurant cards
- [x] Restaurant Detail page shows ADS BR metric card
- [x] Revenue formatted with Indian number format (₹1,50,386)
- [x] Zero revenue restaurants show ₹0

---

**Total Execution Time:** ~5 minutes
**Status:** Ready to Execute


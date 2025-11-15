# 🚀 Automatic Batch Execution Guide

**Execute all 80 batch files automatically** using direct PostgreSQL connection!

No more manual copy-paste! ⚡

---

## 🎯 What This Does

Instead of manually copying and pasting 80 SQL files in Supabase SQL Editor, this script:
- ✅ Connects directly to your Supabase PostgreSQL database
- ✅ Executes all 80 batch files automatically in correct order
- ✅ Shows progress and timing for each batch
- ✅ Handles errors gracefully
- ✅ Completes in ~15-20 minutes (vs 40-50 minutes manual)

---

## 📋 Prerequisites

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `psycopg2-binary` - PostgreSQL database adapter
- `python-dotenv` - Environment variable loader
- `pandas` - Data processing (already installed)
- `supabase` - Supabase client (already installed)

### 2. Get Your Database Password

**Where to find it:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/lqtjghnremwiybqzmprn
2. Click **Settings** (left sidebar)
3. Click **Database**
4. Scroll to **Connection string** section
5. Click **"Reset database password"** if you don't have it
6. Copy the password (you'll need it when running the script)

**Important:** This is your **database password**, NOT the API keys!

---

## 🚀 Quick Start

### Step 1: Run the Script

```bash
python scripts/execute_all_batches.py
```

### Step 2: Enter Database Password

When prompted, paste your database password:
```
🔐 Database Password Required
Get it from: Supabase Dashboard → Settings → Database → Database Password

Enter your Supabase database password: [paste here]
```

### Step 3: Confirm Execution

The script will show:
- Number of batch files found (should be 80)
- Current restaurant count in database
- Confirmation prompt

Type `yes` to proceed:
```
⚠️  WARNING: This will execute 80 SQL files!
Ready to proceed? (yes/no): yes
```

### Step 4: Watch Progress

The script will automatically:
1. Execute NCN batches (40 files)
2. Execute N2R batches (30 files)
3. Execute Items batches (10 files)

You'll see progress like:
```
[1/80] Executing: update_ncn_fields_part1_batch01.sql
📊 Statements to execute: ~150
✅ Successfully executed update_ncn_fields_part1_batch01.sql
📊 Duration: 12.34s
📊 Rows affected: 150
```

### Step 5: Verify Results

After completion, you'll see:
```
📊 EXECUTION SUMMARY
✅ Successful: 80
❌ Failed: 0
📊 Total time: 18.45 minutes

🎉 ALL BATCHES EXECUTED SUCCESSFULLY!
```

---

## 🔧 How It Works

### Direct PostgreSQL Connection

The script uses **direct PostgreSQL connection** (not Supabase API):

```python
# Connection configuration
conn_config = {
    'host': 'aws-0-ap-south-1.pooler.supabase.com',
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres.lqtjghnremwiybqzmprn',
    'password': your_db_password,
    'sslmode': 'require'
}
```

**Benefits:**
- ✅ Faster execution (no file size limits)
- ✅ Direct database access (bypasses API)
- ✅ Better error handling
- ✅ Progress tracking
- ✅ Automatic retry on connection issues

---

## 📊 Execution Order

The script executes files in this order:

### 1. NCN Batches (40 files)
```
update_ncn_fields_part1_batch01.sql
update_ncn_fields_part1_batch02.sql
...
update_ncn_fields_part5_batch08.sql
```

### 2. N2R Batches (30 files)
```
update_n2r_fields_part1_batch01.sql
update_n2r_fields_part1_batch02.sql
...
update_n2r_fields_part5_batch06.sql
```

### 3. Items Batches (10 files)
```
update_items_fields_part1_batch01.sql
update_items_fields_part1_batch02.sql
...
update_items_fields_part5_batch02.sql
```

---

## ⏱️ Time Comparison

| Method | Time | Effort |
|--------|------|--------|
| **Manual (Supabase SQL Editor)** | 40-50 min | High (copy-paste 80 times) |
| **Automatic (This Script)** | 15-20 min | Low (run once, wait) |

**Time saved:** ~25-30 minutes! ⚡

---

## 🚨 Troubleshooting

### Error: "Failed to connect to database"

**Solution:**
1. Check your database password is correct
2. Reset password in Supabase Dashboard → Settings → Database
3. Make sure your IP is allowed (Supabase allows all IPs by default)

### Error: "No batch files found"

**Solution:**
1. Make sure you're in the project root directory
2. Check that batch files exist (run `ls update_*_batch*.sql`)
3. If missing, run `python scripts/split_all_large_files.py`

### Error: "Module not found: psycopg2"

**Solution:**
```bash
pip install psycopg2-binary
```

### Script stops mid-execution

**Solution:**
1. Note which file failed
2. Re-run the script
3. It will skip already-updated restaurants (ON CONFLICT DO UPDATE)
4. Or manually execute remaining files in Supabase SQL Editor

---

## ✅ Verification After Execution

Run this query in Supabase SQL Editor:

```sql
-- Final verification
SELECT 
    COUNT(*) as total_restaurants,
    COUNT(ncn_la_base_code) as with_ncn,
    COUNT(n2r_la_ov) as with_n2r,
    COUNT(items_p1_item_name) as with_items,
    COUNT(CASE WHEN ncn_la_base_code IS NOT NULL 
               AND n2r_la_ov IS NOT NULL 
               AND items_p1_item_name IS NOT NULL THEN 1 END) as with_all_3_drives
FROM drive_sheets_data;
```

**Expected Results:**
- Total restaurants: 6,610
- With NCN: ~5,539
- With N2R: ~5,663
- With Items: ~1,909
- With all 3 drives: ~1,500-2,000

---

## 🎉 Next Steps After Success

1. **Test Frontend:**
   ```bash
   npm run dev
   ```

2. **Login and Verify:**
   - Email: any @zomato.com email
   - Password: 1234
   - Check KAM Hub shows restaurants
   - Click a restaurant to see drive data

3. **Celebrate!** 🎊
   - You've successfully imported 6,610 restaurants
   - With full NCN, N2R, and Items data
   - Ready for production use

---

## 🔒 Security Notes

**Database Password:**
- ✅ Only used locally on your machine
- ✅ Not stored anywhere (you enter it each time)
- ✅ Transmitted over SSL/TLS encrypted connection
- ✅ Never committed to git

**Connection:**
- ✅ Uses SSL/TLS encryption
- ✅ Direct to Supabase PostgreSQL
- ✅ Same security as Supabase SQL Editor

---

**Ready to go?** Run `python scripts/execute_all_batches.py` and let it do the work! 🚀


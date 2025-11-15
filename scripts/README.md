# Supabase User Management Scripts

This directory contains scripts to manage Supabase authentication users from the `kam-data.txt` file.

## 📋 Overview

The scripts help you:
1. Extract unique email addresses from `kam-data.txt`
2. Create Supabase authentication users with a default password
3. Bulk import users into your Supabase project

## 🚀 Quick Start

### Prerequisites

- Node.js installed (v14 or higher)
- Supabase project with Service Role Key
- `kam-data.txt` file in the project root

### Step 1: Extract Unique Emails

First, extract and view all unique emails:

```bash
node scripts/extract-unique-emails.js
```

This will:
- Display all unique emails from `kam-data.txt`
- Save them to `scripts/unique-emails.txt`
- Show you how many users will be created

### Step 2: Add Users to Supabase

#### Option A: Using the Script (Recommended)

1. **Get your Supabase Service Role Key:**
   - Go to your Supabase Dashboard
   - Navigate to Settings → API
   - Copy the `service_role` key (⚠️ Keep this secret!)

2. **Update the script:**
   - Open `scripts/add-users-to-supabase.js`
   - Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual service role key

3. **Run the script:**
   ```bash
   node scripts/add-users-to-supabase.js
   ```

The script will:
- Create users with email and password "1234"
- Auto-confirm their emails
- Skip users that already exist
- Show progress and summary

#### Option B: Manual Import via Supabase Dashboard

1. Open `scripts/unique-emails.txt`
2. Go to Supabase Dashboard → Authentication → Users
3. Click "Add User" for each email
4. Set password to `1234`
5. Enable "Auto Confirm User"

## 📁 Files

### `extract-unique-emails.js`
Extracts unique email addresses from `kam-data.txt` and saves them to a file.

**Usage:**
```bash
node scripts/extract-unique-emails.js
```

**Output:**
- Console: List of all unique emails
- File: `scripts/unique-emails.txt`

### `add-users-to-supabase.js`
Bulk creates users in Supabase Authentication using the Service Role Key.

**Usage:**
```bash
node scripts/add-users-to-supabase.js
```

**Features:**
- ✅ Creates users with auto-confirmed emails
- ⚠️ Skips existing users
- ❌ Reports failed creations
- 📊 Shows detailed summary

**Configuration:**
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (⚠️ Keep secret!)
- `PASSWORD`: Default password for all users (currently "1234")

## 🔐 Security Notes

⚠️ **IMPORTANT:**
- Never commit your Service Role Key to version control
- The Service Role Key bypasses Row Level Security
- Only use it in secure server environments
- Consider using environment variables for sensitive data

## 📊 Expected Results

Based on `kam-data.txt`, you should see approximately **60-80 unique emails** extracted.

All users will have:
- ✉️ Email: Their @zomato.com email address
- 🔑 Password: `1234`
- ✅ Email confirmed: Yes
- 📝 Metadata: `created_by: 'bulk_import_script'`

## 🐛 Troubleshooting

### "Module not found" error
Make sure you're running Node.js v14+ and the scripts are using ES modules.

### "Invalid API key" error
Check that you're using the `service_role` key, not the `anon` key.

### "User already exists" warning
This is normal - the script skips existing users automatically.

### Rate limiting
The script includes a 100ms delay between requests to avoid rate limiting.

## 📝 Example Output

```
🚀 Starting Supabase user creation process...

📧 Extracting unique emails from kam-data.txt...
✅ Found 75 unique emails

📋 Preview of emails to be added:
   1. aditya.d@zomato.com
   2. anirudha.gupta@zomato.com
   3. anudeep.pawar@zomato.com
   ... and 72 more

👤 Creating users in Supabase...

   Processing 1/75: aditya.d@zomato.com... ✅ Created
   Processing 2/75: anirudha.gupta@zomato.com... ✅ Created
   ...

============================================================
📊 SUMMARY
============================================================
✅ Successfully created: 75
⚠️  Already existed: 0
❌ Failed: 0
📧 Total emails processed: 75
============================================================

✨ Process completed!
🔑 All users have password: 1234
```

## 🔄 Next Steps

After creating users:
1. Test login with any email and password "1234"
2. Users can change their password after first login
3. Consider implementing password reset functionality
4. Update RLS policies if needed

## 📞 Support

If you encounter issues:
1. Check the Supabase Dashboard → Authentication → Users
2. Review the Supabase logs
3. Verify your Service Role Key is correct
4. Ensure your Supabase project allows email/password authentication


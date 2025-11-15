# 🔑 How to Get Your Supabase Service Role Key

## Step-by-Step Guide

### Step 1: Open Supabase Dashboard

Go to: **https://supabase.com/dashboard**

### Step 2: Select Your Project

Click on your project: **lqtjghnremwiybqzmprn**

### Step 3: Navigate to API Settings

1. Click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu

### Step 4: Find the Service Role Key

You'll see two keys on this page:

#### ❌ DON'T USE THIS:
- **anon / public** - This is the public key (already in your .env.local)

#### ✅ USE THIS:
- **service_role** - This is the secret key you need
- It will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)

### Step 5: Copy the Service Role Key

1. Click the **Copy** button next to the service_role key
2. The key is now in your clipboard

---

## 🚀 Now Run the Script

With the key copied, run:

```bash
npm run add-users-cli
```

When prompted, paste the key and press Enter.

---

## ⚠️ Security Warning

**IMPORTANT:**
- The service_role key has **full access** to your database
- It bypasses all Row Level Security (RLS) policies
- **Never** commit it to version control
- **Never** expose it in client-side code
- Only use it in secure server environments or scripts

The CLI script is safe because:
- ✅ You enter the key at runtime
- ✅ It's not saved anywhere
- ✅ It's only used temporarily to create users

---

## 📍 Quick Reference

**Your Supabase Project:**
- URL: `https://lqtjghnremwiybqzmprn.supabase.co`
- Project ID: `lqtjghnremwiybqzmprn`

**Where to find keys:**
```
Dashboard → Settings → API

anon key (public):     Already in .env.local ✅
service_role key:      Copy this for the script 🔑
```

---

## 🎯 Ready to Go!

Once you have the service_role key:

```bash
npm run add-users-cli
```

The script will:
1. Show you the 48 emails to be added
2. Ask for your service_role key
3. Ask for confirmation
4. Create all users with password "1234"
5. Show you a summary

**Total time:** ~2-3 minutes

---

## Alternative: Visual Guide

If you prefer screenshots, here's the path:

```
1. https://supabase.com/dashboard
   ↓
2. Click your project (lqtjghnremwiybqzmprn)
   ↓
3. Settings (⚙️) → API
   ↓
4. Scroll to "Project API keys"
   ↓
5. Find "service_role" section
   ↓
6. Click "Copy" button
   ↓
7. Run: npm run add-users-cli
   ↓
8. Paste key when prompted
```

---

## Need Help?

If you can't find the service_role key:
1. Make sure you're logged into Supabase
2. Make sure you have access to the project
3. Try refreshing the page
4. Check you're in the right project

The key should be visible in: **Settings → API → Project API keys → service_role**


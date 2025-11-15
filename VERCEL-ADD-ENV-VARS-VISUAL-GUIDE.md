# 🎯 Add Environment Variables to Vercel - Visual Guide

**This is the #1 fix for blank screen on Vercel!**

---

## 📍 Step-by-Step with Visual Instructions

### Step 1: Go to Your Vercel Project

```
1. Open: https://vercel.com/dashboard
2. You should see your project: "zomato-bau-final" (or similar name)
3. Click on the project name
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│  Vercel Dashboard                       │
├─────────────────────────────────────────┤
│  Your Projects:                         │
│                                         │
│  📦 zomato-bau-final                   │
│     ↑ Click here                       │
│     Production: your-url.vercel.app    │
│                                         │
└─────────────────────────────────────────┘
```

---

### Step 2: Go to Settings

```
1. You're now on the project page
2. Look for tabs at the top: Overview | Deployments | Analytics | Settings
3. Click "Settings"
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│  zomato-bau-final                       │
├─────────────────────────────────────────┤
│  [Overview] [Deployments] [Settings]    │
│              ↑ Click here               │
└─────────────────────────────────────────┘
```

---

### Step 3: Go to Environment Variables

```
1. You're now in Settings
2. Look for left sidebar menu
3. Click "Environment Variables"
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│  Settings                               │
├──────────────┬──────────────────────────┤
│  General     │                          │
│  Domains     │  Environment Variables   │
│  Env Vars    │                          │
│  ↑ Click     │  Add your first variable │
│              │                          │
└──────────────┴──────────────────────────┘
```

---

### Step 4: Add First Variable (VITE_SUPABASE_URL)

```
1. Click "Add New" button
2. You'll see a form with 3 fields
```

**Fill in:**
```
┌─────────────────────────────────────────┐
│  Add Environment Variable               │
├─────────────────────────────────────────┤
│  Name (Key):                            │
│  VITE_SUPABASE_URL                      │
│  ↑ Type exactly as shown                │
├─────────────────────────────────────────┤
│  Value:                                 │
│  https://lqtjghnremwiybqzmprn.supabase.co
│  ↑ Copy and paste this                  │
├─────────────────────────────────────────┤
│  Environment:                           │
│  ☑ Production                           │
│  ☑ Preview                              │
│  ☑ Development                          │
│  ↑ Check ALL THREE boxes                │
├─────────────────────────────────────────┤
│  [Cancel]  [Save]                       │
│              ↑ Click Save               │
└─────────────────────────────────────────┘
```

**Click "Save"**

---

### Step 5: Add Second Variable (VITE_SUPABASE_ANON_KEY)

```
1. Click "Add New" again
2. Fill in the form
```

**Fill in:**
```
┌─────────────────────────────────────────┐
│  Add Environment Variable               │
├─────────────────────────────────────────┤
│  Name (Key):                            │
│  VITE_SUPABASE_ANON_KEY                 │
├─────────────────────────────────────────┤
│  Value:                                 │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...│
│  (Full key - see below)                 │
├─────────────────────────────────────────┤
│  Environment:                           │
│  ☑ Production ☑ Preview ☑ Development  │
└─────────────────────────────────────────┘
```

**Full Value (copy this):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTUzMTAsImV4cCI6MjA3ODY5MTMxMH0.ZKghrbJF3iaONhgYsuJ21AY4gKckxqGHRz7WN0_VXFE
```

**Click "Save"**

---

### Step 6: Add Third Variable (VITE_GOOGLE_CLIENT_ID)

```
1. Click "Add New" again
2. Fill in the form
```

**Fill in:**
```
┌─────────────────────────────────────────┐
│  Add Environment Variable               │
├─────────────────────────────────────────┤
│  Name (Key):                            │
│  VITE_GOOGLE_CLIENT_ID                  │
├─────────────────────────────────────────┤
│  Value:                                 │
│  201674623022-c1qkua2u896525g5b115at... │
│  (Full ID - see below)                  │
├─────────────────────────────────────────┤
│  Environment:                           │
│  ☑ Production ☑ Preview ☑ Development  │
└─────────────────────────────────────────┘
```

**Full Value (copy this):**
```
201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com
```

**Click "Save"**

---

### Step 7: Add Fourth Variable (VITE_RESTRICT_DOMAIN)

```
1. Click "Add New" again
2. Fill in the form
```

**Fill in:**
```
┌─────────────────────────────────────────┐
│  Add Environment Variable               │
├─────────────────────────────────────────┤
│  Name (Key):                            │
│  VITE_RESTRICT_DOMAIN                   │
├─────────────────────────────────────────┤
│  Value:                                 │
│  false                                  │
│  ↑ Just type: false                     │
├─────────────────────────────────────────┤
│  Environment:                           │
│  ☑ Production ☑ Preview ☑ Development  │
└─────────────────────────────────────────┘
```

**Click "Save"**

---

### Step 8: Verify All Variables Are Added

**You should now see 4 variables:**
```
┌─────────────────────────────────────────┐
│  Environment Variables                  │
├─────────────────────────────────────────┤
│  ✅ VITE_SUPABASE_URL                   │
│     Production, Preview, Development    │
│                                         │
│  ✅ VITE_SUPABASE_ANON_KEY              │
│     Production, Preview, Development    │
│                                         │
│  ✅ VITE_GOOGLE_CLIENT_ID               │
│     Production, Preview, Development    │
│                                         │
│  ✅ VITE_RESTRICT_DOMAIN                │
│     Production, Preview, Development    │
└─────────────────────────────────────────┘
```

**If you see all 4, you're good! ✅**

---

### Step 9: Redeploy (CRITICAL!)

**Environment variables only take effect after redeployment!**

```
1. Click "Deployments" tab at the top
2. Find the latest deployment (top of the list)
3. Click the "..." (three dots) button on the right
4. Click "Redeploy"
5. Confirm by clicking "Redeploy" again
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│  Deployments                            │
├─────────────────────────────────────────┤
│  Production                             │
│  ┌─────────────────────────────────┐   │
│  │ main - 20b606f  2 min ago   ... │   │
│  │                              ↑  │   │
│  │                         Click   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  When you click "...":                  │
│  ┌─────────────────┐                   │
│  │ View Deployment │                   │
│  │ Redeploy        │ ← Click this      │
│  │ Promote to Prod │                   │
│  └─────────────────┘                   │
└─────────────────────────────────────────┘
```

---

### Step 10: Wait for Build to Complete

```
1. After clicking "Redeploy", you'll see a building status
2. Wait 2-3 minutes
3. Status will change from "Building" → "Ready"
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│  Building...                            │
│  ████████░░░░░░░░░░░░░░░░░░░░  35%     │
│                                         │
│  Installing dependencies...             │
│  Running build command...               │
│                                         │
│  Wait for this to complete...           │
└─────────────────────────────────────────┘

Then:

┌─────────────────────────────────────────┐
│  ✅ Ready                                │
│  Your deployment is live!               │
│                                         │
│  Visit: https://your-url.vercel.app     │
└─────────────────────────────────────────┘
```

---

### Step 11: Test Your Deployment

```
1. Click "Visit" or open your Vercel URL
2. You should see the login page (NOT a blank screen!)
3. Try logging in with: gupta.ansh@zomato.com / 1234
```

**Success looks like:**
```
┌─────────────────────────────────────────┐
│  🔐 Zomato BAU KAM Dashboard           │
│                                         │
│  Email: [________________]             │
│  Password: [________________]          │
│                                         │
│  [Sign In]                             │
│                                         │
│  Or sign in with Google                │
└─────────────────────────────────────────┘
```

**NOT a blank white screen!**

---

## ✅ Checklist

- [ ] Added VITE_SUPABASE_URL
- [ ] Added VITE_SUPABASE_ANON_KEY
- [ ] Added VITE_GOOGLE_CLIENT_ID
- [ ] Added VITE_RESTRICT_DOMAIN
- [ ] All variables have all 3 environments checked
- [ ] Redeployed the project
- [ ] Waited for build to complete
- [ ] Tested the URL - login page appears!

---

## 🎉 Success!

If you see the login page, you've successfully fixed the blank screen!

**Next steps:**
1. Test login functionality
2. Update Google OAuth URLs (see VERCEL-DEPLOYMENT-COMPLETE-GUIDE.md)
3. Update Supabase URLs
4. Test all features

---

**This should fix your blank screen! 🚀**


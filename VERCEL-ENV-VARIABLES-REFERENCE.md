# 🔐 Vercel Environment Variables - Quick Reference

**Copy these EXACTLY into Vercel Dashboard**

---

## 📋 Environment Variables to Add

### 1. VITE_SUPABASE_URL
```
https://lqtjghnremwiybqzmprn.supabase.co
```
- **Environment:** Production, Preview, Development (all)
- **Description:** Supabase project URL

---

### 2. VITE_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTUzMTAsImV4cCI6MjA3ODY5MTMxMH0.ZKghrbJF3iaONhgYsuJ21AY4gKckxqGHRz7WN0_VXFE
```
- **Environment:** Production, Preview, Development (all)
- **Description:** Supabase anonymous key (public, RLS protected)

---

### 3. VITE_GOOGLE_CLIENT_ID
```
201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com
```
- **Environment:** Production, Preview, Development (all)
- **Description:** Google OAuth Client ID

---

### 4. VITE_RESTRICT_DOMAIN
```
false
```
- **Environment:** Production, Preview, Development (all)
- **Description:** Domain restriction for authentication

---

## ⚠️ DO NOT ADD TO VERCEL

### SUPABASE_SERVICE_ROLE_KEY
```
❌ DO NOT ADD THIS TO VERCEL
This is for backend scripts only!
Keep it in .env.local for local development only.
```

---

## 📸 How to Add in Vercel Dashboard

### Step-by-Step:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **"Settings"** → **"Environment Variables"**
4. For each variable:
   - Click **"Add New"**
   - Name: `VITE_SUPABASE_URL`
   - Value: Copy from above
   - Environment: Check all 3 boxes (Production, Preview, Development)
   - Click **"Save"**
5. Repeat for all 4 variables
6. Redeploy your project

---

## ✅ Verification

After adding all variables, you should see:
```
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
✅ VITE_GOOGLE_CLIENT_ID
✅ VITE_RESTRICT_DOMAIN

Total: 4 variables
```

---

## 🔄 After Adding Variables

**Important:** Redeploy your project for changes to take effect!

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete

---

## 🧪 Test After Deployment

1. Open your Vercel URL
2. Open browser console (F12)
3. Check if Supabase connects:
   ```javascript
   // Should NOT see "undefined"
   console.log(import.meta.env.VITE_SUPABASE_URL)
   ```
4. Try logging in
5. Verify data loads

---

## 🐛 Common Issues

### Issue: "Cannot read property of undefined"
**Cause:** Environment variables not loaded  
**Solution:** 
- Check variable names are EXACT (case-sensitive)
- Ensure all start with `VITE_`
- Redeploy after adding variables

### Issue: "Failed to fetch"
**Cause:** Wrong Supabase URL  
**Solution:**
- Verify URL is correct (no trailing slash)
- Check for typos

### Issue: Google OAuth fails
**Cause:** Client ID not set  
**Solution:**
- Verify `VITE_GOOGLE_CLIENT_ID` is added
- Check value is complete (ends with `.apps.googleusercontent.com`)

---

## 📝 Copy-Paste Format for Vercel

```
Name: VITE_SUPABASE_URL
Value: https://lqtjghnremwiybqzmprn.supabase.co
Environment: Production, Preview, Development

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTUzMTAsImV4cCI6MjA3ODY5MTMxMH0.ZKghrbJF3iaONhgYsuJ21AY4gKckxqGHRz7WN0_VXFE
Environment: Production, Preview, Development

Name: VITE_GOOGLE_CLIENT_ID
Value: 201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com
Environment: Production, Preview, Development

Name: VITE_RESTRICT_DOMAIN
Value: false
Environment: Production, Preview, Development
```

---

**All set! Add these 4 variables to Vercel and redeploy! 🚀**


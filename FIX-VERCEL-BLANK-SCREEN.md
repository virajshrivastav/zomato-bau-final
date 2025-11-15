# 🔧 Fix Vercel Blank Screen - Step by Step

**Issue:** Vercel deployment shows blank screen  
**Common Causes:** Missing environment variables, build errors, or routing issues

---

## 🚨 MOST LIKELY CAUSE: Missing Environment Variables

### ✅ Step 1: Add Environment Variables to Vercel

**This is the #1 reason for blank screens!**

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add these 4 variables:

#### Variable 1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://lqtjghnremwiybqzmprn.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTUzMTAsImV4cCI6MjA3ODY5MTMxMH0.ZKghrbJF3iaONhgYsuJ21AY4gKckxqGHRz7WN0_VXFE
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3: VITE_GOOGLE_CLIENT_ID
```
Name: VITE_GOOGLE_CLIENT_ID
Value: 201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 4: VITE_RESTRICT_DOMAIN
```
Name: VITE_RESTRICT_DOMAIN
Value: false
Environment: ✅ Production ✅ Preview ✅ Development
```

### ⚠️ CRITICAL: Redeploy After Adding Variables

After adding all 4 variables:
1. Go to **"Deployments"** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for build to complete
5. Check your site again

---

## 🔍 Step 2: Check Browser Console for Errors

1. Open your Vercel URL
2. Press **F12** to open DevTools
3. Go to **"Console"** tab
4. Look for errors (red text)

### Common Errors and Fixes:

#### Error: "Cannot read property 'VITE_SUPABASE_URL' of undefined"
**Fix:** Environment variables not added. Go to Step 1.

#### Error: "Failed to fetch" or "Network error"
**Fix:** Check Supabase URL is correct and Supabase project is active.

#### Error: "Unexpected token '<'"
**Fix:** Routing issue. Check vercel.json has rewrites (already configured).

---

## 🔍 Step 3: Check Vercel Build Logs

1. Go to Vercel dashboard
2. Click on your project
3. Click on the latest deployment
4. Click **"Building"** tab
5. Look for errors in the build log

### Common Build Errors:

#### Error: "Module not found"
```bash
# Fix: Check package.json dependencies
# Redeploy should fix this
```

#### Error: "Build failed"
```bash
# Fix: Check build logs for specific error
# Usually missing dependencies or TypeScript errors
```

---

## 🔧 Step 4: Verify Vercel Configuration

### Check Build Settings
Go to **Settings** → **General**:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x (or latest)
```

### Check vercel.json
Should have rewrites for SPA routing (already configured):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🌐 Step 5: Update Google OAuth URLs (If Using Google Login)

### Add Vercel URL to Google Console

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized JavaScript origins**, add:
   ```
   https://your-vercel-url.vercel.app
   ```
6. Under **Authorized redirect URIs**, add:
   ```
   https://your-vercel-url.vercel.app
   https://lqtjghnremwiybqzmprn.supabase.co/auth/v1/callback
   ```
7. Click **Save**

**Note:** This won't cause a blank screen, but Google login won't work without it.

---

## 🗄️ Step 6: Update Supabase URLs (If Using Supabase Auth)

### Add Vercel URL to Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Under **Site URL**, set:
   ```
   https://your-vercel-url.vercel.app
   ```
5. Under **Redirect URLs**, add:
   ```
   https://your-vercel-url.vercel.app/**
   ```
6. Click **Save**

**Note:** This won't cause a blank screen, but authentication might not work properly without it.

---

## 🧪 Step 7: Test Locally First

Before debugging Vercel, make sure it works locally:

```bash
# Build locally
npm run build

# Preview the build
npm run preview
```

If the build preview works locally but not on Vercel, it's definitely an environment variable issue.

---

## 📋 Quick Checklist

- [ ] Added all 4 environment variables to Vercel
- [ ] Redeployed after adding variables
- [ ] Checked browser console for errors
- [ ] Checked Vercel build logs for errors
- [ ] Verified build settings are correct
- [ ] Tested local build with `npm run build`
- [ ] Updated Google OAuth URLs (optional)
- [ ] Updated Supabase URLs (optional)

---

## 🎯 Most Common Solution (90% of cases)

**The blank screen is almost always caused by missing environment variables.**

### Quick Fix:
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add all 4 variables (see Step 1)
3. Go to Deployments → Click "..." → Redeploy
4. Wait 2-3 minutes
5. Refresh your Vercel URL

**This should fix it!**

---

## 🐛 Still Not Working? Advanced Debugging

### Check Network Tab
1. Open DevTools (F12)
2. Go to **"Network"** tab
3. Refresh the page
4. Look for failed requests (red)
5. Click on failed requests to see error details

### Check if index.html is Loading
1. In Network tab, look for `index.html`
2. If it's not loading, there's a routing issue
3. If it loads but page is blank, check Console for JavaScript errors

### Check if Assets are Loading
1. Look for CSS files (should be 200 status)
2. Look for JS files (should be 200 status)
3. If assets are 404, check Output Directory setting

---

## 📞 Need More Help?

### Share These Details:
1. **Vercel URL:** Your deployment URL
2. **Console Errors:** Screenshot of browser console
3. **Build Logs:** Screenshot of Vercel build logs
4. **Environment Variables:** Confirm all 4 are added (don't share values)

---

## ✅ Success Criteria

Your deployment is working when:
- ✅ Page loads (not blank)
- ✅ No errors in browser console
- ✅ Login page appears
- ✅ Can navigate to different pages
- ✅ Data loads from Supabase

---

**90% of the time, adding environment variables and redeploying fixes the blank screen!**

**Start with Step 1 and redeploy!**


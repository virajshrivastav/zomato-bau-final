# 🚀 Vercel Deployment - Complete Guide

**Project:** Zomato BAU KAM Dashboard  
**Framework:** React + Vite + TypeScript  
**Database:** Supabase  
**Date:** 2025-11-15

---

## 📋 Prerequisites

- [x] GitHub account
- [x] Vercel account (sign up at https://vercel.com)
- [x] Code pushed to GitHub repository
- [x] Supabase project set up
- [x] Environment variables ready

---

## 🔐 Environment Variables for Vercel

### Required Variables (Add in Vercel Dashboard)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://lqtjghnremwiybqzmprn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTUzMTAsImV4cCI6MjA3ODY5MTMxMH0.ZKghrbJF3iaONhgYsuJ21AY4gKckxqGHRz7WN0_VXFE

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com

# Authentication Settings
VITE_RESTRICT_DOMAIN=false
```

### ⚠️ DO NOT ADD (Backend Only)
```bash
# This is for backend scripts only - DO NOT add to Vercel
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 📦 Step 1: Push to GitHub

### 1.1 Check Git Status
```bash
git status
```

### 1.2 Add All Files
```bash
git add .
```

### 1.3 Commit Changes
```bash
git commit -m "Sprint 3: Frontend testing ready + Vercel deployment config"
```

### 1.4 Push to GitHub
```bash
git push origin master
```

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Import Project
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository: `zomato-new`
5. Click **"Import"**

### 2.2 Configure Project
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Add Environment Variables
1. Click **"Environment Variables"**
2. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://lqtjghnremwiybqzmprn.supabase.co`
   - Environment: Production, Preview, Development (all checked)

3. Repeat for:
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_RESTRICT_DOMAIN`

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

---

## 🔧 Step 3: Configure Google OAuth

### 3.1 Add Vercel URL to Google Console
1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized JavaScript origins**, add:
   ```
   https://your-project-name.vercel.app
   ```
6. Under **Authorized redirect URIs**, add:
   ```
   https://your-project-name.vercel.app
   https://lqtjghnremwiybqzmprn.supabase.co/auth/v1/callback
   ```
7. Click **Save**

### 3.2 Add Vercel URL to Supabase
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Under **Site URL**, add:
   ```
   https://your-project-name.vercel.app
   ```
5. Under **Redirect URLs**, add:
   ```
   https://your-project-name.vercel.app/**
   ```
6. Click **Save**

---

## ✅ Step 4: Verify Deployment

### 4.1 Check Build Logs
1. In Vercel dashboard, click on your deployment
2. Check **"Building"** tab for any errors
3. Ensure build completed successfully

### 4.2 Test the App
1. Open your Vercel URL: `https://your-project-name.vercel.app`
2. Test login with: `gupta.ansh@zomato.com` / `1234`
3. Verify dashboard loads
4. Test restaurant detail page (ID: 6503620)
5. Check browser console for errors

### 4.3 Test Google OAuth
1. Click "Sign in with Google"
2. Select a @zomato.com account
3. Verify redirect works
4. Check authentication state

---

## 🐛 Troubleshooting

### Build Fails
**Error:** `Module not found` or `Cannot find module`
**Solution:**
```bash
# Locally, ensure all dependencies are installed
npm install
npm run build

# If build works locally, check Vercel build logs
```

### Environment Variables Not Working
**Error:** `undefined` for Supabase URL
**Solution:**
1. Check variable names start with `VITE_`
2. Redeploy after adding variables
3. Clear Vercel cache and redeploy

### Google OAuth Fails
**Error:** `redirect_uri_mismatch`
**Solution:**
1. Add Vercel URL to Google Console (see Step 3.1)
2. Add Vercel URL to Supabase (see Step 3.2)
3. Wait 5 minutes for changes to propagate

### 404 on Routes
**Error:** Direct navigation to `/restaurant/123` returns 404
**Solution:**
- Ensure `vercel.json` has rewrites configuration (already included)
- Redeploy if needed

---

## 📊 Post-Deployment Checklist

- [ ] Build completed successfully
- [ ] App loads at Vercel URL
- [ ] Login works (email/password)
- [ ] Google OAuth works
- [ ] Dashboard displays data
- [ ] Restaurant list loads (6,610 restaurants)
- [ ] Restaurant detail page works
- [ ] All 3 drive cards display correctly
- [ ] No console errors
- [ ] Performance is acceptable (< 5 seconds)

---

## 🔒 Security Notes

### What's Safe to Commit
✅ `vercel.json` - Deployment configuration
✅ `.gitignore` - Excludes sensitive files
✅ `package.json` - Dependencies
✅ Source code files

### What's NOT Safe to Commit
❌ `.env.local` - Contains secrets (already in .gitignore)
❌ `SUPABASE_SERVICE_ROLE_KEY` - Backend only, never expose
❌ Any files with passwords or API keys

### Environment Variables Security
- ✅ `VITE_SUPABASE_URL` - Safe (public)
- ✅ `VITE_SUPABASE_ANON_KEY` - Safe (public, RLS protected)
- ✅ `VITE_GOOGLE_CLIENT_ID` - Safe (public)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - NEVER add to Vercel (backend only)

---

## 🚀 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin master

# Vercel automatically builds and deploys
# Check deployment status at vercel.com/dashboard
```

---

## 📝 Custom Domain (Optional)

### Add Custom Domain
1. Go to Vercel dashboard → Your project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `kam-dashboard.zomato.com`)
4. Follow DNS configuration instructions
5. Update Google OAuth and Supabase URLs

---

## 🎯 Next Steps After Deployment

1. ✅ Test all functionality on production
2. ✅ Enable Row Level Security (RLS) in Supabase
3. ✅ Monitor performance and errors
4. ✅ Set up error tracking (Sentry, LogRocket, etc.)
5. ✅ Configure custom domain (if needed)
6. ✅ User acceptance testing (UAT)

---

**Deployment Guide Complete! 🎉**


# 🚀 Deploy to Vercel - Quick Checklist

**Status:** ✅ Code pushed to GitHub  
**Repository:** https://github.com/virajshrivastav/zomato-bau-final  
**Ready to Deploy:** YES

---

## ✅ Step 1: Code Pushed to GitHub (DONE)

```
✅ All files committed
✅ Pushed to master branch
✅ Repository: virajshrivastav/zomato-bau-final
```

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Go to Vercel
1. Open: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**

### 2.2 Select Repository
1. Find: `virajshrivastav/zomato-bau-final`
2. Click **"Import"**

### 2.3 Configure Build Settings
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```
**Note:** These should be auto-detected. Just verify they're correct.

### 2.4 Add Environment Variables
Click **"Environment Variables"** and add these 4 variables:

#### Variable 1:
```
Name: VITE_SUPABASE_URL
Value: https://lqtjghnremwiybqzmprn.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2:
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTUzMTAsImV4cCI6MjA3ODY5MTMxMH0.ZKghrbJF3iaONhgYsuJ21AY4gKckxqGHRz7WN0_VXFE
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3:
```
Name: VITE_GOOGLE_CLIENT_ID
Value: 201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com
Environment: ✅ Production ✅ Preview ✅ Development
```

#### Variable 4:
```
Name: VITE_RESTRICT_DOMAIN
Value: false
Environment: ✅ Production ✅ Preview ✅ Development
```

### 2.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app will be live! 🎉

---

## 🔧 Step 3: Configure OAuth (After First Deploy)

### 3.1 Get Your Vercel URL
After deployment, you'll get a URL like:
```
https://zomato-bau-final.vercel.app
```
Copy this URL.

### 3.2 Update Google OAuth
1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized JavaScript origins**, add:
   ```
   https://zomato-bau-final.vercel.app
   ```
6. Under **Authorized redirect URIs**, add:
   ```
   https://zomato-bau-final.vercel.app
   https://lqtjghnremwiybqzmprn.supabase.co/auth/v1/callback
   ```
7. Click **Save**

### 3.3 Update Supabase
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Under **Site URL**, set:
   ```
   https://zomato-bau-final.vercel.app
   ```
5. Under **Redirect URLs**, add:
   ```
   https://zomato-bau-final.vercel.app/**
   ```
6. Click **Save**

---

## ✅ Step 4: Test Deployment

### 4.1 Open Your App
```
https://your-project-name.vercel.app
```

### 4.2 Test Login
```
Email: gupta.ansh@zomato.com
Password: 1234
```

### 4.3 Test Features
- [ ] Dashboard loads
- [ ] KAM Hub shows restaurants
- [ ] Restaurant detail page works (ID: 6503620)
- [ ] All 3 drive cards display
- [ ] No console errors
- [ ] Google OAuth works

---

## 📋 Quick Checklist

### Before Deployment
- [x] Code pushed to GitHub
- [x] `.env.local` in `.gitignore` (not committed)
- [x] `vercel.json` configured
- [x] Environment variables ready

### During Deployment
- [ ] Vercel project created
- [ ] Repository imported
- [ ] Build settings verified
- [ ] 4 environment variables added
- [ ] Deployment started

### After Deployment
- [ ] Build completed successfully
- [ ] App loads at Vercel URL
- [ ] Google OAuth URLs updated
- [ ] Supabase URLs updated
- [ ] Login tested
- [ ] Features tested
- [ ] No errors in console

---

## 🐛 If Build Fails

### Check Build Logs
1. In Vercel dashboard, click on your deployment
2. Click **"Building"** tab
3. Look for error messages

### Common Issues

**Error: "Module not found"**
```bash
# Solution: Check package.json dependencies
npm install
npm run build
```

**Error: "Environment variable undefined"**
```
# Solution: Verify all 4 variables are added
# Redeploy after adding variables
```

**Error: "Build timeout"**
```
# Solution: Check for infinite loops or large files
# Optimize build process
```

---

## 📚 Full Documentation

For detailed instructions, see:
- **VERCEL-DEPLOYMENT-COMPLETE-GUIDE.md** - Complete deployment guide
- **VERCEL-ENV-VARIABLES-REFERENCE.md** - Environment variables reference

---

## 🎯 Success Criteria

Deployment is successful when:
- ✅ Build completes without errors
- ✅ App loads at Vercel URL
- ✅ Login works (email/password)
- ✅ Google OAuth works
- ✅ Data loads from Supabase
- ✅ All features work as expected

---

## 🚀 Next Steps

After successful deployment:
1. Share Vercel URL with team
2. Conduct user acceptance testing (UAT)
3. Enable Row Level Security (RLS)
4. Monitor performance and errors
5. Set up custom domain (optional)

---

**Ready to deploy! Follow the steps above! 🎉**

**Repository:** https://github.com/virajshrivastav/zomato-bau-final  
**Vercel:** https://vercel.com/dashboard


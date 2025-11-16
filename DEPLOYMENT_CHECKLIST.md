# Vercel Deployment Checklist - Google Sheets Sync

## ✅ Pre-Deployment Checklist

### 1. Environment Variables in Vercel
Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Verify ALL of these are set:

- [ ] `GOOGLE_PRIVATE_KEY` (the full private key with BEGIN/END lines)
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `zomato-sheets-service@zomato-drive-dashboard.iam.gserviceaccount.com`
- [ ] `GOOGLE_SHEET_ID` = `1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ`
- [ ] `VITE_SUPABASE_URL` = `https://lqtjghnremwiybqzmprn.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = (your service role key from .env.local)
- [ ] `VITE_SUPABASE_ANON_KEY` = (your anon key from .env.local)
- [ ] `VITE_GOOGLE_CLIENT_ID` = (your Google OAuth client ID)
- [ ] `VITE_RESTRICT_DOMAIN` = `true` (for production)

**Important Notes:**
- All variables should be set for: **Production**, **Preview**, and **Development**
- The `GOOGLE_PRIVATE_KEY` must include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- Make sure there are no extra spaces or line breaks when copying the private key

### 2. Google Service Account Permissions
- [ ] Service account has **Editor** access to the Google Sheet
- [ ] Google Sheet ID matches the one in environment variables
- [ ] Sheet has the correct tabs: `NCN`, `N2R`, `Items >=159`, `Comments and Notes`

### 3. Code Verification
- [ ] All changes committed to git
- [ ] No TypeScript errors: `npm run build`
- [ ] No linting errors: `npm run lint`
- [ ] Code formatted: `npm run format`

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Fix: Add Google Sheets sync configuration"
git push origin master
```

### Step 2: Verify Vercel Auto-Deploy
- Vercel should automatically deploy when you push to master
- Go to: **Vercel Dashboard** → **Deployments**
- Wait for deployment to complete (usually 1-2 minutes)

### Step 3: Check Deployment Status
- [ ] Build completed successfully
- [ ] No build errors
- [ ] Deployment is live

## 🧪 Post-Deployment Testing

### Test 1: Diagnostic Endpoint
Visit: `https://your-app.vercel.app/api/test-sync`

Expected response:
```json
{
  "overall": {
    "status": "PASS",
    "totalChecks": 4,
    "failedChecks": 0
  },
  "checks": {
    "envVars": { ... all true ... },
    "googleCredentials": { "success": true },
    "googleSheetsAPI": { "success": true },
    "supabase": { "success": true }
  }
}
```

- [ ] All checks pass
- [ ] No errors in response

### Test 2: NCN Drive Sync
1. [ ] Login to the app
2. [ ] Navigate to a restaurant page
3. [ ] Open browser DevTools (F12) → Console tab
4. [ ] Change NCN "Approached by KAM" to "Yes"
5. [ ] Check console for: `[Sheets Sync] ✅ Success`
6. [ ] Open Google Sheet → NCN tab
7. [ ] Verify the restaurant row is updated

### Test 3: N2R Drive Sync
1. [ ] Change N2R "Approached by KAM" to "Yes"
2. [ ] Check console for success message
3. [ ] Verify Google Sheet → N2R tab is updated

### Test 4: Items Drive Sync
1. [ ] Add items and submit
2. [ ] Check console for success message
3. [ ] Verify Google Sheet → Items >=159 tab is updated

### Test 5: Comments Sync
1. [ ] Add a comment to a restaurant
2. [ ] Check console for success message
3. [ ] Verify Google Sheet → Comments and Notes tab is updated

## 🔍 Troubleshooting

### If Diagnostic Endpoint Fails

**Check 1: Environment Variables**
```bash
# In Vercel Dashboard, verify each variable is set correctly
# Common issues:
# - Missing GOOGLE_PRIVATE_KEY
# - Private key missing BEGIN/END lines
# - Extra spaces in variable values
```

**Check 2: Google Credentials**
- Verify service account email matches
- Check if private key is valid (not expired)
- Ensure service account has access to the sheet

**Check 3: Vercel Function Logs**
1. Go to: **Vercel Dashboard** → **Deployments**
2. Click on latest deployment
3. Click **Functions** tab
4. Click `/api/test-sync` or `/api/sync-sheets`
5. Review logs for errors

### If Sync Fails But Diagnostic Passes

**Check Browser Console:**
- Look for `[Sheets Sync]` logs
- Check for network errors
- Verify the API endpoint is being called

**Check Vercel Function Logs:**
- Go to Functions → `/api/sync-sheets`
- Look for the specific restaurant ID in logs
- Check for any error messages

**Common Issues:**
- Restaurant not found in database
- Invalid drive type
- Network timeout (function timeout is 10 seconds)

## 📊 Monitoring

### Daily Checks
- [ ] Check Vercel function logs for errors
- [ ] Verify Google Sheets are being updated
- [ ] Monitor Supabase for any sync issues

### Weekly Checks
- [ ] Review error logs
- [ ] Check for any failed syncs
- [ ] Verify all KAMs can access the system

## 🆘 Emergency Rollback

If deployment breaks production:

1. **Immediate Rollback:**
   - Go to: **Vercel Dashboard** → **Deployments**
   - Find the last working deployment
   - Click **"..."** → **"Promote to Production"**

2. **Fix and Redeploy:**
   - Fix the issue locally
   - Test thoroughly
   - Push to a feature branch first
   - Test on Vercel preview deployment
   - Merge to master when confirmed working

## 📝 Notes
- Google Sheets sync is **non-blocking** - it won't prevent users from working if it fails
- All sync operations are logged to browser console for debugging
- Vercel function timeout is 10 seconds - sync should complete within this time
- If sync fails, data is still saved to Supabase (source of truth)


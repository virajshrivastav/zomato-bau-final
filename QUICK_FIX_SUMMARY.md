# Google Sheets Sync - Quick Fix Summary

## 🔴 Problem
Google Sheets sync shows success toast but doesn't update the sheet on Vercel deployment.

## ✅ Solution
Add `GOOGLE_PRIVATE_KEY` environment variable to Vercel.

## 📋 Steps to Fix

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project
- Go to: **Settings** → **Environment Variables**

### 2. Add This Environment Variable

**Variable Name:**
```
GOOGLE_PRIVATE_KEY
```

**Variable Value:** (Copy the entire block below, including BEGIN and END lines)
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQC809RQQjsocr
Au77hQcWdTnQsdpSYB4+/uuxTOC3W+zO6gPNYOEBOogCaE98RG6VSt/IvnTa/ILO
wKaVpdkQN+D+oKec6JyI8JVtOiLvtYjglJ1KzeuUQLIs3uIX8z3IuC9FeIIY6bDB
H6kaQ2DUBzX/F6GnlYPf2ab/60OQYzM8DMg81DwxRFc5m/ZpeJqTqhIyy+7z85qe
Z7WAGytzNghy1shKy1+pt91xo9S3i1xxvySgrr4upH/K1+8ocxEl8GQS429YR4SB
BelAmP4pdgAnrJVEBIa7NfxgPcDAA0EMJ7LOW+4Tr6OI30tGD9229jAAIjThd9xa
E7LToLUtAgMBAAECggEAQ+vWca5aj5z1bCFlDFB94+MZoPyvnj0rIr3vDM9gffxQ
76yO2TpLuy70wHR1nshooezz6oHjfKr7uaxDto+SsizME9U3Y469rCd/YU2dokzO
ByP9xjI8OwZ0JRoPDmqnPSSEqlWRg7insCU5/A0LS62e/00jxaaWizpvvxV71WM2
4mjlbVoXqQXdAQiwI0xmb6NCCR5SndG68RP/Mz++2jXibmq7xynkdVfMD5IXZVfI
f6EzHAqrFpfJRWCpjSv+kD5lM34iLvS0Oe6uBdqXwQMTEEmyVc7SpEA+ew90SXBp
W1feMMkB5HI0L2tEkrwAmgmUeq6QxTdsCrLQY6LrsQKBgQDm4Hz1t+TEunrJ6fiK
L8JE/RFWfRsXKIX9XoGNosd34AHspVGogcL6tp0lpwxR7nm9wvczfVcUhjbyUAIH
7LbUVqXI0UaJhYQQT07VsYwALAPbWlxtNPce1VdWaaaaXO5qQy7aQV07FesrJBFP
FKD5EvP/wiGsAuFK42U67v9eiwKBgQDmr1GC5vUN2U/F/WVJhwvvHu2FJT8uFV3o
QnLDaqsdj2nxWRBqqZ31o0WVStROANW5xzeEbznnkqpV8vCGoY/HgOLgub965G/a
cC9MvpFaH8ZsXAVSIhYoo4zGqNf1m4wSOrgfIrVxNw3Uynbtz7KGw5HVER8TVFHs
Oj+vSPOqJwKBgQCrfgRT4IylNH8QjCJ5QpBi/jdqrvL4eLlOQmyo8EiJ2nKTfRjy
ubBC2nJQDY0xLppvQeqs7GVKcYdO5e8cQ9BqWRI74Hcsn2hBVSeRw5fiaM9UmAIf
fEAzPvTo0wFVl8HgXJbot7Swts8/9EKHIyOO320uhNzOEDWYkuAWroAxkQKBgQDl
3kNyFmSQVUBZwWPhvdFViNMT/waTDDWUUEp9kdhLT3I5Tg++yaAeeoDHAFbIF6rh
QbN/oznnGM3lcXzeGzXjjfoGBvHYKrOOzoVDiw3Z6ZnWtmeS7WZ5Pmf0OaFhG4ub
SqnYVMTKuRpuNQYHeRSjl1PFJhd6Mmaj53M4XpB3twKBgAMpPadyRxLjbGE/XbZ9
j0pEp9IRk90SPgKG7v/79E+9PDfMrH5eTEZfuWK+OnHIjqBqlp0J61HASGfiL2+F
ilrlTVQL12yAGBPqTNMH3QXXqwyGTWKCvC0X8+SSoxAE5+COQEYqD3mwdZYLwgxu
RVcUVxahlV43hc4eXlZpHgiy
-----END PRIVATE KEY-----
```

**Select Environments:** Production, Preview, Development (all three)

### 3. Verify Other Variables Are Set
Make sure these are also configured in Vercel:
- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- ✅ `GOOGLE_SHEET_ID`
- ✅ `VITE_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### 4. Redeploy
- Go to **Deployments** tab
- Click on latest deployment
- Click **"Redeploy"** button

### 5. Test
After redeployment:
1. Visit: `https://your-app.vercel.app/api/test-sync`
   - Should show `"status": "PASS"`
2. Try submitting a drive form on the restaurant page
3. Check browser console for `[Sheets Sync] ✅ Success` message
4. Verify Google Sheet is updated

## 🧪 Local Testing (Optional)
Before deploying, test locally:
```bash
npm run test:sync-api <resId> <drive>
```

Example:
```bash
npm run test:sync-api 12345 ncn
```

## 📊 Monitoring
After deployment, check:
- **Browser Console**: Look for `[Sheets Sync]` logs
- **Vercel Function Logs**: Dashboard → Deployments → Functions → `/api/sync-sheets`

## 🆘 Troubleshooting
If still not working:
1. Check Vercel function logs for errors
2. Verify the private key was copied correctly (including BEGIN/END lines)
3. Make sure all line breaks are preserved in the private key
4. Check that the service account has edit access to the Google Sheet

## 📝 Why This Happens
- **Local**: Works because API reads from `service-account-credentials.json`
- **Vercel**: Needs environment variable because file system is read-only
- **Success Toast**: Shows because sync is non-blocking (doesn't wait for API)

## ✨ Files Created
- `api/test-sync.js` - Diagnostic endpoint to test configuration
- `scripts/test_vercel_api_locally.js` - Local testing script
- `GOOGLE_SHEETS_SYNC_FIX.md` - Detailed fix guide
- `QUICK_FIX_SUMMARY.md` - This file


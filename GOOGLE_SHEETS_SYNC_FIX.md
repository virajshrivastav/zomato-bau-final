# Google Sheets Sync Fix Guide

## Problem
The Google Sheets sync functionality shows success toast on the page but doesn't update Google Sheets. This is because the Vercel serverless function is missing the required `GOOGLE_PRIVATE_KEY` environment variable.

## Root Cause
- **Local Development**: Works fine because the API reads credentials from `service-account-credentials.json`
- **Vercel Production**: Fails because it needs `GOOGLE_PRIVATE_KEY` environment variable, which is not set

## Solution

### Step 1: Extract the Private Key
The private key is already in your `service-account-credentials.json` file. You need to copy it to Vercel.

**Private Key (from service-account-credentials.json):**
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

### Step 2: Add Environment Variable to Vercel

1. **Go to your Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (zomato-bau-final or similar)
3. **Go to Settings** → **Environment Variables**
4. **Add the following environment variable:**

   **Name:** `GOOGLE_PRIVATE_KEY`
   
   **Value:** Copy the entire private key INCLUDING the BEGIN and END lines:
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

   **Environment:** Select all environments (Production, Preview, Development)

5. **Verify other environment variables are also set:**
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `zomato-sheets-service@zomato-drive-dashboard.iam.gserviceaccount.com`
   - `GOOGLE_SHEET_ID` = `1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ`
   - `VITE_SUPABASE_URL` = `https://lqtjghnremwiybqzmprn.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)

### Step 3: Redeploy
After adding the environment variable, you need to trigger a new deployment:
- Either push a new commit to your repository
- Or go to Deployments → Click on the latest deployment → Click "Redeploy"

### Step 4: Test the Fix

1. **Test the diagnostic endpoint first:**
   Visit: `https://your-vercel-domain.vercel.app/api/test-sync`
   
   This should return a JSON response with all checks passing:
   ```json
   {
     "overall": {
       "status": "PASS",
       "totalChecks": 4,
       "failedChecks": 0
     }
   }
   ```

2. **Test the actual sync:**
   - Go to a restaurant page
   - Make a change in one of the drive cards (NCN, N2R, or Items)
   - Submit the form
   - Check the browser console for `[Sheets Sync]` logs
   - Verify the Google Sheet is updated

## Debugging

### Check Browser Console
Open browser DevTools (F12) → Console tab. Look for:
- `[Sheets Sync] Starting sync for...` - Sync initiated
- `[Sheets Sync] Response status: 200 OK` - API responded successfully
- `[Sheets Sync] ✅ Success for...` - Sync completed

### Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Click on "Functions" tab
4. Click on `/api/sync-sheets` function
5. View the logs for any errors

### Common Issues
- **401 Unauthorized**: Google credentials are invalid or not set
- **404 Not Found**: Restaurant not found in database
- **500 Internal Server Error**: Check Vercel function logs for details

## Notes
- The sync is **non-blocking** - it won't prevent the UI from showing success
- Check console logs to see if the sync actually succeeded
- The diagnostic endpoint `/api/test-sync` helps verify configuration


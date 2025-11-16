# Vercel Environment Variables Setup Guide

## Step-by-Step Instructions

### 1. Access Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Login with your account
3. Find and click on your project (e.g., "zomato-bau-final")

### 2. Navigate to Environment Variables
1. Click on **"Settings"** tab (top navigation)
2. Click on **"Environment Variables"** in the left sidebar

### 3. Add GOOGLE_PRIVATE_KEY

#### Click "Add New" Button
You'll see a form with three fields:
- **Name (Key)**
- **Value**
- **Environment**

#### Fill in the Details:

**Name (Key):**
```
GOOGLE_PRIVATE_KEY
```

**Value:** (Copy this EXACTLY as shown, including the BEGIN and END lines)
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

**Environment:** 
- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**

#### Click "Save" Button

### 4. Verify Other Required Variables

Make sure these variables are also present (add them if missing):

#### GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Name:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value:** `zomato-sheets-service@zomato-drive-dashboard.iam.gserviceaccount.com`
- **Environment:** All three

#### GOOGLE_SHEET_ID
- **Name:** `GOOGLE_SHEET_ID`
- **Value:** `1BPV4gNG7bub4RFZgIrk-Yn65YEOkDA-WWTQplMbzWvQ`
- **Environment:** All three

#### VITE_SUPABASE_URL
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://lqtjghnremwiybqzmprn.supabase.co`
- **Environment:** All three

#### SUPABASE_SERVICE_ROLE_KEY
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzExNTMxMCwiZXhwIjoyMDc4NjkxMzEwfQ.r7SZ4kAKH-9GlzdmHw730dfjoBvtfgVrY8IPcgMxSbI`
- **Environment:** All three

#### VITE_SUPABASE_ANON_KEY
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdGpnaG5yZW13aXlicXptcHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTUzMTAsImV4cCI6MjA3ODY5MTMxMH0.ZKghrbJF3iaONhgYsuJ21AY4gKckxqGHRz7WN0_VXFE`
- **Environment:** All three

#### VITE_GOOGLE_CLIENT_ID
- **Name:** `VITE_GOOGLE_CLIENT_ID`
- **Value:** `201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com`
- **Environment:** All three

#### VITE_RESTRICT_DOMAIN
- **Name:** `VITE_RESTRICT_DOMAIN`
- **Value:** `true`
- **Environment:** Production only

### 5. Redeploy

After adding all environment variables:

1. Go to **"Deployments"** tab
2. Click on the most recent deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Confirm the redeployment

Wait for the deployment to complete (usually 1-2 minutes).

### 6. Test the Deployment

Once deployed, test the diagnostic endpoint:

**URL:** `https://your-app-name.vercel.app/api/test-sync`

**Expected Response:**
```json
{
  "timestamp": "2025-01-16T...",
  "environment": "production",
  "checks": {
    "envVars": {
      "GOOGLE_SERVICE_ACCOUNT_EMAIL": true,
      "GOOGLE_PRIVATE_KEY": true,
      "GOOGLE_SHEET_ID": true,
      "VITE_SUPABASE_URL": true,
      "SUPABASE_SERVICE_ROLE_KEY": true
    },
    "googleCredentials": {
      "success": true,
      "email": "zomato-sheets-service@zomato-drive-dashboard.iam.gserviceaccount.com",
      "source": "environment"
    },
    "googleSheetsAPI": {
      "success": true,
      "sheetTitle": "Your Sheet Name"
    },
    "supabase": {
      "success": true
    }
  },
  "overall": {
    "status": "PASS",
    "totalChecks": 4,
    "failedChecks": 0
  }
}
```

If you see `"status": "PASS"`, the setup is complete! ✅

## Common Issues

### Issue 1: Private Key Format Error
**Symptom:** `googleCredentials.success: false`

**Solution:** 
- Make sure you copied the ENTIRE private key including:
  - `-----BEGIN PRIVATE KEY-----` (first line)
  - All the middle lines
  - `-----END PRIVATE KEY-----` (last line)
- No extra spaces before or after
- All line breaks preserved

### Issue 2: Variable Not Found
**Symptom:** Environment variable shows `false` in diagnostic

**Solution:**
- Double-check the variable name (case-sensitive)
- Make sure it's set for the correct environment
- Redeploy after adding variables

### Issue 3: Google Sheets API Error
**Symptom:** `googleSheetsAPI.success: false`

**Solution:**
- Verify the service account has access to the sheet
- Check if the sheet ID is correct
- Ensure the service account email is correct

## Need Help?
- Check Vercel function logs: Dashboard → Deployments → Functions
- Check browser console for `[Sheets Sync]` logs
- Review `DEPLOYMENT_CHECKLIST.md` for detailed troubleshooting


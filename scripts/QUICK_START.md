# 🚀 Quick Start - Add 48 Users to Supabase

## ⚡ Fastest Method (2 minutes)

### Step 1: Get Service Role Key
```
Supabase Dashboard → Settings → API → Copy "service_role" key
```

### Step 2: Update Script
```javascript
// File: scripts/add-users-to-supabase.js
// Line 22: Paste your service_role key

const SUPABASE_SERVICE_ROLE_KEY = 'your-key-here';
```

### Step 3: Run
```bash
npm run add-users
```

**Done!** All 48 users created with password `1234`

---

## 📋 Manual Method (15 minutes)

### Step 1: Get Email List
```bash
npm run extract-emails
```

### Step 2: Add Users
```
Supabase Dashboard → Authentication → Users → Add User

For each email:
- Email: (from list)
- Password: 1234
- ✅ Auto Confirm User
```

**Repeat 48 times**

---

## ✅ Verify

```
Dashboard → Authentication → Users
Should show: 48 users
```

**Test Login:**
- Email: `aditya.d@zomato.com`
- Password: `1234`

---

## 📚 Full Documentation

- `AUTHENTICATION_SETUP_COMPLETE.md` - Complete guide
- `SUPABASE_USER_SETUP.md` - Detailed setup
- `scripts/README.md` - Script docs


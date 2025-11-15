# Supabase User Setup Guide

This guide will help you add authentication for all 48 unique emails from `kam-data.txt` to your Supabase project.

## 📊 Summary

- **Total unique emails found:** 48
- **Default password:** `1234`
- **Email domain:** @zomato.com

## 🎯 Quick Start (3 Options)

### Option 1: Automated Script (Fastest) ⚡

1. **Get your Supabase Service Role Key:**
   ```
   1. Go to https://supabase.com/dashboard
   2. Select your project
   3. Go to Settings → API
   4. Copy the "service_role" key (⚠️ Keep this secret!)
   ```

2. **Update the script:**
   - Open `scripts/add-users-to-supabase.js`
   - Line 19: Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual key

3. **Run the script:**
   ```bash
   npm run add-users
   ```

   This will create all 48 users automatically!

### Option 2: Manual via Supabase Dashboard (Most Control) 🎛️

1. **View the email list:**
   ```bash
   npm run extract-emails
   ```
   Or open `scripts/unique-emails.txt`

2. **Add users manually:**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User" button
   - For each email:
     - Email: (copy from list)
     - Password: `1234`
     - ✅ Enable "Auto Confirm User"
     - Click "Create User"

3. **Repeat for all 48 emails**

### Option 3: SQL Batch Insert (Advanced) 🔧

Use Supabase SQL Editor to run batch inserts. See the "Advanced SQL Method" section below.

## 📋 Complete Email List

Here are all 48 unique emails that need to be added:

```
1. aditya.d@zomato.com
2. anirudha.gupta@zomato.com
3. anudeep.pawar@zomato.com
4. bhuwneshwari.dhouni@zomato.com
5. bicky.rai@zomato.com
6. deepika.chittella@zomato.com
7. desale.tejaswini@zomato.com
8. dimple.sadrani@zomato.com
9. gupta.ansh@zomato.com
10. harshit.chhabra@zomato.com
11. juili.satao@zomato.com
12. kevin.kotak@zomato.com
13. khushi.kariya@zomato.com
14. kunal.surulkar@zomato.com
15. pacharne.hemraj@zomato.com
16. paliwal.grasim@zomato.com
17. pandey.adarsh@zomato.com
18. paridhi.shrivastava@zomato.com
19. parish.rathod@zomato.com
20. pranav.salvi@zomato.com
21. pranavi.parab@zomato.com
22. prerna.kadam@zomato.com
23. priya.joseph@zomato.com
24. puneet.bablani@zomato.com
25. rakesh.chachada@zomato.com
26. rakesh.hati@zomato.com
27. rashika.dokania@zomato.com
28. rinkel.shah@zomato.com
29. rohit.shelar@zomato.com
30. rutuja.jangam@zomato.com
31. saksham.bassi@zomato.com
32. sakshi.pare@zomato.com
33. sanket.kadam@zomato.com
34. shakshy.meel@zomato.com
35. shefali.deshmukh@zomato.com
36. shirdi.narayan@zomato.com
37. shiv.udasi@zomato.com
38. shiwani.jha@zomato.com
39. shounak.prabhukeluskar@zomato.com
40. shrawani.wankhade@zomato.com
41. shriniwas.bewoor@zomato.com
42. siddesh.jagtap@zomato.com
43. tanush.pasari@zomato.com
44. uddesh.pillay@zomato.com
45. upadhyay.satyam@zomato.com
46. utkarsh.narnaware@zomato.com
47. vaishnavi.wani@zomato.com
48. veda.bhatt@zomato.com
```

## 🔐 Security & Access

### Default Credentials
- **Password:** `1234` (for all users)
- **Email Confirmation:** Auto-confirmed
- **Access Level:** Based on RLS policies

### Important Notes
⚠️ **Security Considerations:**
- All users share the same default password
- Users should change their password after first login
- Consider implementing password reset functionality
- The Service Role Key bypasses all security - keep it secret!

## ✅ Verification

After adding users, verify the setup:

1. **Check User Count:**
   - Go to Supabase Dashboard → Authentication → Users
   - You should see 48 users

2. **Test Login:**
   - Try logging in with any email from the list
   - Password: `1234`
   - Should successfully authenticate

3. **Check RLS Policies:**
   - Verify users can only see their own data
   - Test with different user emails

## 🛠️ Troubleshooting

### Script Issues

**"Module not found" error:**
```bash
# Make sure you're in the project root
cd d:\Projects\zom\zomato-new
npm run extract-emails
```

**"Invalid API key" error:**
- Ensure you're using the `service_role` key, not `anon` key
- Check for extra spaces when copying the key

### Manual Addition Issues

**"Email already exists":**
- User was already created
- Skip to next email

**"Invalid email format":**
- Ensure email is exactly as shown in the list
- Check for typos

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- Project Scripts: `scripts/README.md`

## 🎉 Next Steps

After adding all users:

1. ✅ Test login with multiple emails
2. ✅ Verify RLS policies work correctly
3. ✅ Consider implementing password reset
4. ✅ Add user profile management
5. ✅ Set up email notifications (optional)

---

**Need Help?** Check the `scripts/README.md` for detailed script documentation.


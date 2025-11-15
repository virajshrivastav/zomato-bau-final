# 🚀 CLI Setup Guide - Add Users to Supabase

## ⚡ Quick Start (Interactive CLI Method)

This is the **easiest and most secure** method - the script will prompt you for your Service Role Key.

### Step 1: Get Your Service Role Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `lqtjghnremwiybqzmprn`
3. Navigate to: **Settings → API**
4. Find and copy the **`service_role`** key (not the `anon` key!)

⚠️ **Important:** The service_role key is secret - never commit it to version control!

### Step 2: Run the CLI Script

```bash
npm run add-users-cli
```

### Step 3: Follow the Prompts

The script will:
1. ✅ Show you how many emails will be added (48 emails)
2. ✅ Preview the first 5 emails
3. 🔐 Ask for your Service Role Key (paste it when prompted)
4. ⚠️ Ask for confirmation before proceeding
5. 👤 Create all users with progress updates
6. 📊 Show a summary of results

### Example Session:

```
╔════════════════════════════════════════════════════════════╗
║   Supabase User Creation - CLI Tool                       ║
╚════════════════════════════════════════════════════════════╝

📧 Extracting unique emails from kam-data.txt...
✅ Found 48 unique emails

📋 Preview of emails to be added:
   1. aditya.d@zomato.com
   2. anirudha.gupta@zomato.com
   3. anudeep.pawar@zomato.com
   4. bhuwneshwari.dhouni@zomato.com
   5. bicky.rai@zomato.com
   ... and 43 more

🔐 To proceed, you need your Supabase Service Role Key
   Get it from: Supabase Dashboard → Settings → API → service_role

Enter your Service Role Key: [paste your key here]

⚠️  About to create 48 users with password: 1234
Continue? (yes/no): yes

👤 Creating users in Supabase...

   [1/48] aditya.d@zomato.com... ✅ Created
   [2/48] anirudha.gupta@zomato.com... ✅ Created
   [3/48] anudeep.pawar@zomato.com... ✅ Created
   ...
   [48/48] veda.bhatt@zomato.com... ✅ Created

═══════════════════════════════════════════════════════════
📊 SUMMARY
═══════════════════════════════════════════════════════════
✅ Successfully created: 48
⚠️  Already existed: 0
❌ Failed: 0
📧 Total emails processed: 48
═══════════════════════════════════════════════════════════

✨ Process completed!
🔑 All users have password: 1234

💡 Next steps:
   1. Test login with any email and password "1234"
   2. Verify users in Supabase Dashboard → Authentication → Users
   3. Users should change their password after first login
```

---

## 🔐 Security Features

The CLI script is more secure because:
- ✅ Service Role Key is entered at runtime (not stored in code)
- ✅ Key is not saved anywhere
- ✅ Confirmation prompt before creating users
- ✅ Clear progress updates
- ✅ Detailed error reporting

---

## ✅ Verification

After the script completes:

1. **Check Supabase Dashboard:**
   - Go to: Authentication → Users
   - You should see 48 users

2. **Test Login:**
   - Email: Any from the list (e.g., `aditya.d@zomato.com`)
   - Password: `1234`
   - Should successfully authenticate

3. **Verify RLS Policies:**
   - Each user should only see their own restaurants
   - Test with different user emails

---

## 🐛 Troubleshooting

### "Invalid API key" error
- Make sure you copied the **service_role** key, not the anon key
- Check for extra spaces when pasting

### "User already exists" warnings
- This is normal if you run the script multiple times
- The script will skip existing users

### "Rate limit" errors
- The script includes a 100ms delay between requests
- If you still hit limits, the script will report which users failed

### Script won't run
```bash
# Make sure you're in the project root
cd d:\Projects\zom\zomato-new

# Try running directly
node scripts/add-users-cli.js
```

---

## 📋 All 48 Emails That Will Be Added

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

**Password for all:** `1234`

---

## 🎉 That's It!

The CLI method is the easiest way to add all users. Just run:

```bash
npm run add-users-cli
```

And follow the prompts!


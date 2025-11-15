# 🚀 START TESTING NOW - Quick Guide

**Status:** ✅ Ready to Test  
**Data:** 6,610 restaurants imported  
**Frontend:** http://localhost:5173

---

## ⚡ 3-Step Quick Start

### Step 1: Open Frontend
The frontend should already be running at:
```
http://localhost:5173
```

If not, run:
```bash
npm run dev
```

### Step 2: Login
```
Email: gupta.ansh@zomato.com
Password: 1234
```

### Step 3: Test Restaurant 6503620
1. Navigate to KAM Hub
2. Click on restaurant "Kanha Veg" (ID: 6503620)
3. Verify you see:
   - ✅ Active Drives: 3
   - ✅ NCN Priority 1: "Salt 20-40%"
   - ✅ NCN LA Base Code: "40% upto 80rs" (with % and rs)
   - ✅ N2R LA AOV: 270
   - ✅ N2R LA Code: "FLAVOUR-75 @ 159"
   - ✅ Items Priority: "P0"
   - ✅ Items POS Flag: "Z Dashboard"

---

## 📋 5 Key Restaurants to Test

| # | ID | Name | Login | Drives | What to Check |
|---|----|----|-------|--------|---------------|
| 1 | **6503620** | Kanha Veg | gupta.ansh@zomato.com | 3 | All cards populated |
| 2 | **22265671** | Gatti Chutney | rakesh.hati@zomato.com | 0 | All cards show "N/A" |
| 3 | **22050613** | Anna Dosa | khushi.kariya@zomato.com | 1 | Only NCN populated |
| 4 | **21219329** | Kiosk Kaffee | paliwal.grasim@zomato.com | 2 | NCN + N2R populated |
| 5 | **12388** | Khushboo Pure Veg | gupta.ansh@zomato.com | 3 | All cards populated |

---

## ✅ Critical Checks (Must Pass)

### 1. Base Code Formatting ⚠️ CRITICAL
```
❌ WRONG: "40 upto 80"
✅ RIGHT: "40% upto 80rs"
```
Check NCN card → Base Codes section

### 2. NULL Values ⚠️ CRITICAL
```
❌ WRONG: "null", "undefined", blank
✅ RIGHT: "N/A" or empty state
```
Check restaurant with 0 drives (ID: 22265671)

### 3. Active Drives Count ⚠️ CRITICAL
```
Restaurant 6503620: Should show "3"
Restaurant 22265671: Should show "0"
Restaurant 22050613: Should show "1"
```

### 4. Performance ⚠️ CRITICAL
```
Dashboard load: < 2 seconds
KAM Hub load: < 3 seconds
Restaurant detail: < 1 second
```

### 5. No Errors ⚠️ CRITICAL
```
Open browser console (F12)
Should see NO red errors
```

---

## 📚 Full Documentation

### Quick Reference (30 min test)
- **QUICK-TEST-REFERENCE.md** - 5 key restaurants with expected values

### Visual Guide
- **VISUAL-TEST-GUIDE.md** - Screenshots and visual examples

### Complete Testing (2-3 hours)
- **FRONTEND-TEST-PLAN.md** - 67 test cases across 10 categories

### Detailed Values
- **RESTAURANT-6503620-EXPECTED-VALUES.md** - Every field for main test restaurant

### Summary
- **TESTING-SUMMARY.md** - Overview of all testing docs

---

## 🐛 Common Issues to Watch

1. **Base codes missing % and rs**
   - Location: NCN card → Base Codes
   - Expected: "40% upto 80rs"
   - Common bug: "40 upto 80"

2. **NULL values showing as text**
   - Location: Restaurants with 0 drives
   - Expected: "N/A" or empty state
   - Common bug: "null" or "undefined"

3. **Wrong active drives count**
   - Location: Restaurant header
   - Expected: 0-3 (accurate count)
   - Common bug: Wrong number or -1

4. **Slow loading**
   - Expected: < 3 seconds
   - Common bug: > 5 seconds with 6,610 restaurants

5. **Console errors**
   - Expected: No errors
   - Common bug: API errors, undefined errors

---

## 🎯 30-Minute Quick Test

```
[ ] 1. Open http://localhost:5173
[ ] 2. Login with gupta.ansh@zomato.com / 1234
[ ] 3. Dashboard loads without errors
[ ] 4. Navigate to KAM Hub
[ ] 5. See list of restaurants
[ ] 6. Click on restaurant 6503620 (Kanha Veg)
[ ] 7. Verify Active Drives: 3
[ ] 8. Verify NCN card shows data
[ ] 9. Verify base codes: "40% upto 80rs" (with % and rs)
[ ] 10. Verify N2R card shows data
[ ] 11. Verify Items card shows data
[ ] 12. No "undefined" or "null" in UI
[ ] 13. Logout and login as rakesh.hati@zomato.com
[ ] 14. Navigate to restaurant 22265671 (Gatti Chutney)
[ ] 15. Verify Active Drives: 0
[ ] 16. Verify all cards show "N/A" (not "null")
[ ] 17. Check browser console - no errors
[ ] 18. Test search functionality
[ ] 19. Test filter functionality
[ ] 20. Check performance (< 3 seconds)
```

---

## 📊 Expected Results

### Database Stats
```
Total Restaurants: 6,610 ✅
With NCN: 5,537 ✅
With N2R: 5,663 ✅
With Items: 1,909 ✅
With All 3: 1,880 ✅
With 0 Drives: 458 ✅
```

### Performance Targets
```
Dashboard: < 2 seconds
KAM Hub: < 3 seconds
Restaurant Detail: < 1 second
Search/Filter: < 200ms
```

---

## 🚨 If Something Breaks

1. **Check browser console** (F12 → Console tab)
2. **Check network tab** (F12 → Network tab)
3. **Verify data import:**
   ```bash
   python scripts/verify_import.py
   ```
4. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

## ✅ Success Criteria

Test is successful if:
- ✅ All 6,610 restaurants load
- ✅ Restaurant 6503620 shows all 3 drives correctly
- ✅ Restaurant 22265671 shows 0 drives with "N/A"
- ✅ Base codes formatted as "40% upto 80rs"
- ✅ No "undefined" or "null" in UI
- ✅ No console errors
- ✅ Performance < 3 seconds

---

## 🎉 After Testing

1. Document any issues found
2. Report critical bugs
3. Suggest improvements
4. Move to Sprint 4 (RLS + Production)

---

**Frontend is ready! Start testing now! 🚀**

**URL:** http://localhost:5173  
**Login:** gupta.ansh@zomato.com / 1234  
**Test Restaurant:** 6503620 (Kanha Veg)


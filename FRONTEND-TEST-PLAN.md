# 🧪 Frontend Testing Plan - Sprint 3

**Date:** 2025-11-15  
**Status:** Ready for Testing  
**Data:** 6,610 restaurants imported ✅

---

## 🎯 Test Objectives

1. Verify frontend handles full dataset (6,610 restaurants)
2. Confirm all drive data displays correctly
3. Test performance and load times
4. Validate different drive combinations
5. Test multi-user access (different KAMs)

---

## 🔐 Test Login Credentials

**Email:** Any @zomato.com email  
**Password:** `1234`

**Sample KAM Emails:**
- `gupta.ansh@zomato.com` (5+ restaurants)
- `khushi.kariya@zomato.com`
- `rakesh.hati@zomato.com`
- `paliwal.grasim@zomato.com`

---

## 📊 Test Data - Specific Restaurants

### 1️⃣ Restaurant with ALL 3 Drives
**Restaurant ID:** `6503620`  
**Name:** Kanha Veg  
**KAM:** gupta.ansh@zomato.com

**Expected NCN Data:**
- Priority 1: `Salt 20-40%`
- LA Base Code: `40% upto 80rs`
- Approached: Should show (check database)

**Expected N2R Data:**
- LA Current AOV: `270`
- LA Current Code: `FLAVOUR-75 @ 159`
- Approached: Should show (check database)

**Expected Items Data:**
- Priority: `P0`
- POS Flag: `Z Dashboard`
- Approached: `Yes`

---

### 2️⃣ Restaurant with ONLY NCN
**Restaurant ID:** `22050613`  
**Name:** Anna Dosa  
**KAM:** khushi.kariya@zomato.com

**Expected:**
- NCN Priority 1: `Stepper`
- N2R Section: Should show "N/A" or empty state
- Items Section: Should show "N/A" or empty state
- Active Drives: `1`

---

### 3️⃣ Restaurant with 0 Drives
**Restaurant ID:** `22265671`  
**Name:** Gatti Chutney  
**KAM:** rakesh.hati@zomato.com

**Expected:**
- NCN Section: Should show "N/A" or empty state
- N2R Section: Should show "N/A" or empty state
- Items Section: Should show "N/A" or empty state
- Active Drives: `0`

---

### 4️⃣ Restaurant with NCN + N2R (No Items)
**Restaurant ID:** `21219329`  
**Name:** Kiosk Kaffee  
**KAM:** paliwal.grasim@zomato.com

**Expected:**
- NCN Priority 1: `DOTD`
- N2R LA AOV: `254`
- Items Section: Should show "N/A" or empty state
- Active Drives: `2`

---

### 5️⃣ Sample KAM Portfolio
**KAM:** gupta.ansh@zomato.com

**Expected Restaurants (at least 5):**
1. `12388` - Khushboo Pure Veg (NCN + N2R + Items)
2. `19149489` - We Idliwale Mini (NCN + N2R)
3. `19394342` - Crazy Cheesy (NCN + N2R + Items)
4. `19580506` - Relax Veg (NCN + N2R + Items)
5. `22180345` - Choice Only Veg (NCN only)

---

## ✅ Comprehensive Test Checklist

### A. Authentication Tests
- [ ] Login with @zomato.com email works
- [ ] Login with non-@zomato.com email is rejected
- [ ] Password authentication works (password: `1234`)
- [ ] Logout works correctly
- [ ] Session persists on page refresh

### B. Dashboard Tests
- [ ] Dashboard loads within 2 seconds
- [ ] All metrics display correctly
- [ ] Charts render properly
- [ ] No console errors

### C. KAM Hub Tests (Restaurant List)
- [ ] All restaurants load (6,610 total)
- [ ] Pagination works correctly
- [ ] Search functionality works
- [ ] Filter by drive type works (NCN/N2R/Items)
- [ ] Filter by active drives count works (0, 1, 2, 3)
- [ ] Restaurant cards show correct drive badges
- [ ] Load time < 3 seconds for initial load

### D. Restaurant Detail Page Tests

#### Test Case 1: All 3 Drives (ID: 6503620)
- [ ] Restaurant name displays: "Kanha Veg"
- [ ] Active Drives shows: `3`
- [ ] NCN card is visible and populated
  - [ ] Priority 1 shows: "Salt 20-40%"
  - [ ] LA Base Code shows: "40% upto 80rs"
  - [ ] All NCN fields populated (no "undefined" or "null")
- [ ] N2R card is visible and populated
  - [ ] LA Current AOV shows: "270"
  - [ ] LA Current Code shows: "FLAVOUR-75 @ 159"
  - [ ] All N2R fields populated
- [ ] Items card is visible and populated
  - [ ] Priority shows: "P0"
  - [ ] POS Flag shows: "Z Dashboard"
  - [ ] Approached shows: "Yes"

#### Test Case 2: Only NCN (ID: 22050613)
- [ ] Restaurant name displays: "Anna Dosa"
- [ ] Active Drives shows: `1`
- [ ] NCN card is visible and populated
  - [ ] Priority 1 shows: "Stepper"
- [ ] N2R card shows "N/A" or empty state (not error)
- [ ] Items card shows "N/A" or empty state (not error)

#### Test Case 3: 0 Drives (ID: 22265671)
- [ ] Restaurant name displays: "Gatti Chutney"
- [ ] Active Drives shows: `0`
- [ ] NCN card shows "N/A" or empty state
- [ ] N2R card shows "N/A" or empty state
- [ ] Items card shows "N/A" or empty state
- [ ] No errors in console

#### Test Case 4: NCN + N2R (ID: 21219329)
- [ ] Restaurant name displays: "Kiosk Kaffee"
- [ ] Active Drives shows: `2`
- [ ] NCN card is visible and populated
  - [ ] Priority 1 shows: "DOTD"
- [ ] N2R card is visible and populated
  - [ ] LA AOV shows: "254"
- [ ] Items card shows "N/A" or empty state

### E. Performance Tests
- [ ] Dashboard loads in < 2 seconds
- [ ] KAM Hub (restaurant list) loads in < 3 seconds
- [ ] Restaurant detail page loads in < 1 second
- [ ] Switching between restaurants is smooth (< 500ms)
- [ ] No memory leaks (check browser DevTools)
- [ ] Scrolling is smooth with 6,610 restaurants
- [ ] Search/filter responds instantly (< 200ms)

### F. Data Integrity Tests
- [ ] All 6,610 restaurants are accessible
- [ ] No "undefined" or "null" displayed in UI
- [ ] Base codes formatted correctly ("40% upto 80rs" not "40 upto 80")
- [ ] Numbers display correctly (no NaN)
- [ ] Dates display correctly (if any)
- [ ] Empty fields show "N/A" not blank/error

### G. Multi-User Tests
- [ ] Login as gupta.ansh@zomato.com - see 5+ restaurants
- [ ] Login as khushi.kariya@zomato.com - see different restaurants
- [ ] Each KAM sees only their restaurants (when RLS enabled)
- [ ] Switching users shows correct data

### H. Navigation Tests
- [ ] All menu items work
- [ ] Back button works correctly
- [ ] Direct URL navigation works (e.g., /restaurant/6503620)
- [ ] 404 page shows for invalid restaurant IDs
- [ ] Breadcrumbs work correctly

### I. Responsive Design Tests
- [ ] Desktop view (1920x1080) works
- [ ] Laptop view (1366x768) works
- [ ] Tablet view (768x1024) works
- [ ] Mobile view (375x667) works
- [ ] All cards are responsive
- [ ] No horizontal scrolling issues

### J. Error Handling Tests
- [ ] Invalid restaurant ID shows error message
- [ ] Network error shows user-friendly message
- [ ] Database connection error handled gracefully
- [ ] Missing data doesn't crash the app

---

## 🎯 Critical Success Criteria

### Must Pass (P0)
1. ✅ All 6,610 restaurants load correctly
2. ✅ Restaurant detail pages show correct drive data
3. ✅ No "undefined" or "null" in UI
4. ✅ Base codes formatted correctly ("40% upto 80rs")
5. ✅ Active drives count is accurate
6. ✅ Page load times < 3 seconds

### Should Pass (P1)
1. Search and filter work correctly
2. All drive combinations display properly
3. Performance is smooth with full dataset
4. No console errors or warnings
5. Responsive design works on all devices

### Nice to Have (P2)
1. Animations are smooth
2. Loading states are elegant
3. Error messages are helpful
4. UI is polished and professional

---

## 🐛 Known Issues to Watch For

1. **Base Code Formatting:** Should be "40% upto 80rs" NOT "40 upto 80"
2. **NULL Values:** Should show "N/A" NOT "null" or blank
3. **Active Drives:** Should count correctly (0-3)
4. **Performance:** Watch for slow loading with 6,610 restaurants
5. **Memory Leaks:** Monitor browser memory usage

---

## 📝 Test Execution Steps

### Step 1: Start Frontend
```bash
npm run dev
```
Expected: Server starts on http://localhost:5173

### Step 2: Login
- Navigate to http://localhost:5173
- Login with: gupta.ansh@zomato.com / 1234
- Expected: Redirect to dashboard

### Step 3: Test Dashboard
- Check all metrics load
- Check charts render
- Check no console errors

### Step 4: Test KAM Hub
- Navigate to KAM Hub
- Check all restaurants load
- Test search and filters
- Check performance

### Step 5: Test Restaurant Details
- Click on restaurant ID: 6503620
- Verify all 3 drive cards show
- Check all data matches expected values
- Repeat for other test restaurants

### Step 6: Performance Testing
- Open Chrome DevTools > Performance
- Record page load
- Check load time < 3 seconds
- Check memory usage is stable

### Step 7: Multi-User Testing
- Logout
- Login as different KAM
- Verify different restaurants show
- Check data is correct

---

## 📊 Test Results Template

```
Test Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

PASS/FAIL Summary:
- Authentication: ___/5
- Dashboard: ___/4
- KAM Hub: ___/7
- Restaurant Detail: ___/20
- Performance: ___/7
- Data Integrity: ___/6
- Multi-User: ___/4
- Navigation: ___/5
- Responsive: ___/5
- Error Handling: ___/4

Total: ___/67

Critical Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## 🚀 Next Steps After Testing

1. Fix any critical issues found
2. Optimize performance if needed
3. Enable Row Level Security (RLS)
4. Production deployment preparation
5. User acceptance testing (UAT)

---

**Frontend URL:** http://localhost:5173
**Test Duration:** ~2-3 hours for complete testing
**Priority:** High - Sprint 3 Goal


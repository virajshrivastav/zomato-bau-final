# 🚀 Quick Test Reference Guide

**Frontend URL:** http://localhost:5173  
**Login Password:** `1234`

---

## 🎯 5 Key Test Restaurants

### 1. **6503620** - Kanha Veg (ALL 3 DRIVES) ⭐
**Login:** gupta.ansh@zomato.com  
**Expected Values:**
```
NCN:
  - Priority 1: "Salt 20-40%"
  - LA Base Code: "40% upto 80rs"
  
N2R:
  - LA Current AOV: 270
  - LA Current Code: "FLAVOUR-75 @ 159"
  
Items:
  - Priority: "P0"
  - POS Flag: "Z Dashboard"
  - Approached: "Yes"

Active Drives: 3
```

---

### 2. **22050613** - Anna Dosa (ONLY NCN)
**Login:** khushi.kariya@zomato.com  
**Expected Values:**
```
NCN:
  - Priority 1: "Stepper"
  
N2R: N/A (should show empty state)
Items: N/A (should show empty state)

Active Drives: 1
```

---

### 3. **22265671** - Gatti Chutney (0 DRIVES)
**Login:** rakesh.hati@zomato.com  
**Expected Values:**
```
NCN: N/A
N2R: N/A
Items: N/A

Active Drives: 0
```

---

### 4. **21219329** - Kiosk Kaffee (NCN + N2R)
**Login:** paliwal.grasim@zomato.com  
**Expected Values:**
```
NCN:
  - Priority 1: "DOTD"
  
N2R:
  - LA Current AOV: 254
  
Items: N/A

Active Drives: 2
```

---

### 5. **12388** - Khushboo Pure Veg (ALL 3 DRIVES)
**Login:** gupta.ansh@zomato.com  
**Expected Values:**
```
All 3 drive cards should be populated
Active Drives: 3
```

---

## ✅ Quick Checklist

### Critical Tests (Must Pass)
- [ ] Login works (any @zomato.com email + password: 1234)
- [ ] Dashboard loads without errors
- [ ] KAM Hub shows restaurants
- [ ] Restaurant 6503620 shows all 3 drive cards
- [ ] Restaurant 22265671 shows "Active Drives: 0"
- [ ] Base codes show as "40% upto 80rs" (NOT "40 upto 80")
- [ ] No "undefined" or "null" in UI
- [ ] Page loads in < 3 seconds

### Performance Tests
- [ ] All 6,610 restaurants load
- [ ] Search/filter works smoothly
- [ ] No console errors
- [ ] Memory usage is stable

---

## 🐛 What to Look For

### ✅ Good Signs
- Base codes: "40% upto 80rs" ✅
- Empty drives: "N/A" or empty state ✅
- Active drives: Correct count (0-3) ✅
- Fast loading (< 3 seconds) ✅

### ❌ Bad Signs
- Base codes: "40 upto 80" ❌
- Empty drives: "null" or "undefined" ❌
- Active drives: Wrong count ❌
- Slow loading (> 5 seconds) ❌
- Console errors ❌

---

## 📊 Database Stats

```
Total Restaurants: 6,610
With NCN: 5,537
With N2R: 5,663
With Items: 1,909
With All 3: 1,880
With 0 Drives: 458
```

---

## 🔗 Quick Links

- **Frontend:** http://localhost:5173
- **Full Test Plan:** FRONTEND-TEST-PLAN.md
- **Sample Data Script:** scripts/get_sample_restaurants.py

---

## 🚨 If Something Breaks

1. Check browser console for errors
2. Check network tab for failed requests
3. Verify database connection
4. Check RLS policies (currently disabled)
5. Restart dev server: `npm run dev`

---

**Test Duration:** ~30 minutes for quick test  
**Full Test:** ~2-3 hours (see FRONTEND-TEST-PLAN.md)


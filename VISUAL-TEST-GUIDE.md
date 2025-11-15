# 👁️ Visual Test Guide - What You Should See

**Frontend URL:** http://localhost:5173

---

## 🔐 Login Page

### What You Should See:
```
┌─────────────────────────────────────┐
│   Zomato BAU KAM Dashboard         │
│                                     │
│   Email: [________________]         │
│   Password: [________________]      │
│                                     │
│   [Login Button]                    │
│   [Sign in with Google]             │
└─────────────────────────────────────┘
```

### Test:
- Enter: `gupta.ansh@zomato.com`
- Password: `1234`
- Click Login
- Should redirect to Dashboard

---

## 📊 Dashboard Page

### What You Should See:
```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                    [Profile] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Total    │  │ Active   │  │ Pending  │             │
│  │ Restau.  │  │ Drives   │  │ Tasks    │             │
│  │  6,610   │  │    3     │  │   XX     │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  [Charts and Metrics]                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Test:
- Check all metrics load
- No console errors
- Charts render properly

---

## 🏪 KAM Hub (Restaurant List)

### What You Should See:
```
┌─────────────────────────────────────────────────────────┐
│  My Restaurants                           [Search: ___] │
├─────────────────────────────────────────────────────────┤
│  Filters: [All] [NCN] [N2R] [Items] [0 Drives]         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │ 6503620 - Kanha Veg              [NCN N2R I]│       │
│  │ Kondhwa | North Indian                      │       │
│  │ Active Drives: 3                            │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │ 12388 - Khushboo Pure Veg        [NCN N2R I]│       │
│  │ Active Drives: 3                            │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │ 22180345 - Choice Only Veg           [NCN]  │       │
│  │ Active Drives: 1                            │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  [Pagination: 1 2 3 ... 132]                           │
└─────────────────────────────────────────────────────────┘
```

### Test:
- Should see at least 5 restaurants for gupta.ansh@zomato.com
- Drive badges show correctly (NCN, N2R, I)
- Active drives count is accurate
- Search and filter work

---

## 🍽️ Restaurant Detail - All 3 Drives (ID: 6503620)

### What You Should See:
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Restaurants                                          │
├─────────────────────────────────────────────────────────────────┤
│  Kanha Veg (#6503620)                    Active Drives: [3]     │
│  KAM: Ansh Gupta | Kondhwa | North Indian                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎨 NCN (No Cooking November)                    [▼]     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Priorities:                                             │   │
│  │  1. Salt 20-40%                                         │   │
│  │  2. DOTD                                                │   │
│  │  3. Stepper                                             │   │
│  │  4. Flash Sale                                          │   │
│  │  5. Salt 0-20                                           │   │
│  │  6. BOGO                                                │   │
│  │                                                         │   │
│  │ Base Codes:                                             │   │
│  │  LA: 40% upto 80rs  ✅                                  │   │
│  │  MM: 40% upto 80rs  ✅                                  │   │
│  │  UM: 40% upto 80rs  ✅                                  │   │
│  │                                                         │   │
│  │ Stepper Codes:                                          │   │
│  │  LA: 100 off at mov 249                                 │   │
│  │  MM: 100 off at mov 299                                 │   │
│  │  UM: 100 off at mov 349                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔄 N2R (New to Restaurant)                      [▼]     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Current Codes:                                          │   │
│  │  LA: AOV 270 | FLAVOUR-75 @ 159  ✅                     │   │
│  │  MM: AOV XXX | [Current Code]                           │   │
│  │  UM: AOV XXX | [Current Code]                           │   │
│  │                                                         │   │
│  │ Suggested Codes:                                        │   │
│  │  LA: [Suggested construct]                              │   │
│  │  MM: [Suggested construct]                              │   │
│  │  UM: [Suggested construct]                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🍽️ Items (159 Items)                            [▼]     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Priority: P0  ✅                                         │   │
│  │ POS Flag: Z Dashboard  ✅                                │   │
│  │ Approached: Yes  ✅                                      │   │
│  │                                                         │   │
│  │ Dish Suggestions:                                       │   │
│  │  • [Dish 1]                                             │   │
│  │  • [Dish 2]                                             │   │
│  │  • [Dish 3]                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Critical Checks:
- ✅ Restaurant name: "Kanha Veg"
- ✅ Active Drives: 3
- ✅ NCN card visible and populated
- ✅ Base codes: "40% upto 80rs" (NOT "40 upto 80")
- ✅ N2R card visible and populated
- ✅ LA AOV: 270
- ✅ LA Code: "FLAVOUR-75 @ 159"
- ✅ Items card visible and populated
- ✅ Priority: "P0"
- ✅ POS Flag: "Z Dashboard"
- ✅ Approached: "Yes"

---

## 🏪 Restaurant Detail - 0 Drives (ID: 22265671)

### What You Should See:
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Restaurants                                          │
├─────────────────────────────────────────────────────────────────┤
│  Gatti Chutney (#22265671)               Active Drives: [0]     │
│  KAM: [Name] | [Locality] | [Cuisine]                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎨 NCN (No Cooking November)                            │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ No NCN data available                                   │   │
│  │ N/A                                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔄 N2R (New to Restaurant)                              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ No N2R data available                                   │   │
│  │ N/A                                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🍽️ Items (159 Items)                                    │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ No Items data available                                 │   │
│  │ N/A                                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Critical Checks:
- ✅ Restaurant name: "Gatti Chutney"
- ✅ Active Drives: 0
- ✅ All cards show "N/A" or empty state
- ✅ NO "null" or "undefined" displayed
- ✅ NO errors in console

---

## ❌ What You Should NOT See

### Bad Examples:
```
❌ Base Code: "40 upto 80" (missing % and rs)
❌ Field Value: "null"
❌ Field Value: "undefined"
❌ Field Value: "NaN"
❌ Empty field: [blank space]
❌ Active Drives: -1 or wrong count
❌ Console errors
❌ Slow loading (> 5 seconds)
```

### Good Examples:
```
✅ Base Code: "40% upto 80rs"
✅ Empty Field: "N/A"
✅ Active Drives: 0, 1, 2, or 3
✅ No console errors
✅ Fast loading (< 3 seconds)
```

---

## 🎯 Quick Visual Checklist

When viewing Restaurant 6503620:
- [ ] Header shows "Kanha Veg" and "Active Drives: 3"
- [ ] NCN card is visible and expanded
- [ ] See "Salt 20-40%" as Priority 1
- [ ] See "40% upto 80rs" for base codes (with % and rs)
- [ ] N2R card is visible and expanded
- [ ] See "270" for LA AOV
- [ ] See "FLAVOUR-75 @ 159" for LA code
- [ ] Items card is visible and expanded
- [ ] See "P0" for priority
- [ ] See "Z Dashboard" for POS flag
- [ ] See "Yes" for approached
- [ ] No "undefined", "null", or "NaN" anywhere
- [ ] Page loads quickly (< 2 seconds)

---

**Use this guide to visually verify the frontend is working correctly!**


# 🎯 Restaurant 6503620 - Complete Expected Values

**Restaurant ID:** 6503620  
**Name:** Kanha Veg  
**KAM:** Ansh Gupta (gupta.ansh@zomato.com)  
**Test Type:** All 3 Drives Active

---

## 📋 Basic Information

```
Restaurant Name: Kanha Veg
Restaurant ID: 6503620
KAM Name: Ansh Gupta
KAM Email: gupta.ansh@zomato.com
Team Lead Email: samrudhh.bhave@zomato.com
Cuisine: North Indian
Locality: Kondhwa
Account Type: CA
Active Drives: 3 (NCN + N2R + Items)
```

---

## 🎨 NCN (No Cooking November) Data

### Priorities
```
Priority 1: Salt 20-40%
Priority 2: DOTD
Priority 3: Stepper
Priority 4: Flash Sale
Priority 5: Salt 0-20
Priority 6: BOGO
```

### LA (Low AOV) Metrics
```
LA Orders: 843
LA Restaurant ASV: 355.0
LA ASV 50th Percentile: 277.01068
LA ASV 70th Percentile: 379.69336
LA ASV 90th Percentile: 569.65607
LA Active Promos: 0
LA Remove: 0
LA Base Code Suggested: "40% upto 80rs" ⚠️ (stored as "40 upto 80", should be formatted)
LA Step 1: 100 off at mov 249
LA Step 2: 125 off at mov 349
LA Step 3: 150 off at mov 549
```

### MM (Medium AOV) Metrics
```
MM Orders: 922
MM Restaurant ASV: 405.0
MM ASV 50th Percentile: 327.01068
MM ASV 70th Percentile: 429.69336
MM ASV 90th Percentile: 570.59717
MM Active Promos: 0
MM Remove: 0
MM Base Code Suggested: "40% upto 80rs" ⚠️ (stored as "40 upto 80", should be formatted)
MM Step 1: 100 off at mov 299
MM Step 2: 125 off at mov 399
MM Step 3: 150 off at mov 549
```

### UM (Upper Medium AOV) Metrics
```
UM Orders: 769
UM Restaurant ASV: 407.0
UM ASV 50th Percentile: 332.53094
UM ASV 70th Percentile: 487.30066
UM ASV 90th Percentile: 702.5952
UM Active Promos: 0
UM Remove: 0
UM Base Code Suggested: "40% upto 80rs" ⚠️ (stored as "40 upto 80", should be formatted)
UM Step 1: 100 off at mov 349
UM Step 2: 125 off at mov 449
UM Step 3: 150 off at mov 649
```

### NCN Additional Fields
```
Dish Tags: (Check database for dish tag priorities 1-7)
Locality X Cuisine: KondhwaNorth Indian
Approached: (Check database)
Converted for Stepper: (Check database)
```

---

## 🔄 N2R (New to Restaurant) Data

### LA (Low AOV)
```
LA OV: (Check database)
LA Current AOV: 270
LA Current Code: "FLAVOUR-75 @ 159"
LA Suggested Construct: (Check database)
LA Suggested Max Amount: (Check database)
LA Suggested MOV: (Check database)
LA Minimum Daily Coupons: (Check database)
```

### MM (Medium AOV)
```
MM OV: (Check database)
MM Current AOV: (Check database)
MM Current Code: (Check database)
MM Suggested Construct: (Check database)
MM Suggested Max Amount: (Check database)
MM Suggested MOV: (Check database)
MM Minimum Daily Coupons: (Check database)
```

### UM (Upper Medium AOV)
```
UM OV: (Check database)
UM Current AOV: (Check database)
UM Current Code: (Check database)
UM Suggested Construct: (Check database)
UM Suggested Max Amount: (Check database)
UM Suggested MOV: (Check database)
UM Minimum Daily Coupons: (Check database)
```

### N2R Additional Fields
```
Approached: (Check database)
```

---

## 🍽️ Items (159 Items) Data

```
Priority: P0
POS Flag: Z Dashboard
PG 7-10 OV Contribution: (Check database)
Locality PG 7-10 %: (Check database)
PG 7-10 Higher Flag: (Check database)
Restaurant Cuisine: North Indian
Dish Tags: (Check database for dish tag priorities 1-7)
Locality X Cuisine: KondhwaNorth Indian
Approached: Yes
Converted: (Check database)
Dish Added <159: (Check database)
No of Items Added: (Check database)
```

---

## ✅ What to Verify in UI

### Restaurant Detail Page Header
- [ ] Restaurant name shows: "Kanha Veg"
- [ ] Restaurant ID shows: "6503620"
- [ ] KAM name shows: "Ansh Gupta"
- [ ] Active Drives badge shows: "3"

### NCN Card
- [ ] Card is visible and expanded
- [ ] Priority 1 shows: "Salt 20-40%"
- [ ] All 6 priorities are listed
- [ ] LA Base Code shows: "40% upto 80rs" (NOT "40 upto 80")
- [ ] MM Base Code shows: "40% upto 80rs"
- [ ] UM Base Code shows: "40% upto 80rs"
- [ ] Stepper codes are displayed correctly
- [ ] No "undefined" or "null" values

### N2R Card
- [ ] Card is visible and expanded
- [ ] LA Current AOV shows: "270"
- [ ] LA Current Code shows: "FLAVOUR-75 @ 159"
- [ ] All three tiers (LA/MM/UM) have data
- [ ] No "undefined" or "null" values

### Items Card
- [ ] Card is visible and expanded
- [ ] Priority shows: "P0"
- [ ] POS Flag shows: "Z Dashboard"
- [ ] Approached shows: "Yes"
- [ ] Dish suggestions are displayed
- [ ] No "undefined" or "null" values

---

## 🚨 Critical Formatting Issues

### Base Code Formatting
**Database Value:** `"40 upto 80"`  
**Expected Display:** `"40% upto 80rs"`

The frontend should format base codes by:
1. Adding "%" after the first number
2. Adding "rs" after the second number

**Example Transformations:**
- `"40 upto 80"` → `"40% upto 80rs"` ✅
- `"50 upto 100"` → `"50% upto 100rs"` ✅
- `"60 upto 120"` → `"60% upto 120rs"` ✅

---

## 📊 Performance Expectations

```
Page Load Time: < 1 second
Data Fetch Time: < 500ms
Render Time: < 200ms
Total Time to Interactive: < 2 seconds
```

---

**Use this document to verify every field on the restaurant detail page!**


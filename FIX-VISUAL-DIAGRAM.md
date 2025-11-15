# 🎨 Visual Diagram: The Hardcoded Values Problem

---

## 📊 CURRENT FLOW (WRONG)

```
┌─────────────────────────────────────────────────────────────┐
│ CSV FILE (NCN-codes.csv)                                    │
├─────────────────────────────────────────────────────────────┤
│ Restaurant 6503620:                                         │
│   ncn_la_step1: "100 off at mov 249"                       │
│   ncn_la_step2: "125 off at mov 349"                       │
│   ncn_la_step3: "150 off at mov 549"                       │
│   ncn_la: "843"                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ SUPABASE DATABASE (drive_sheets_data table)                │
├─────────────────────────────────────────────────────────────┤
│ res_id: "6503620"                                           │
│ ncn_la_step1: "100 off at mov 249"  ← Stored as text       │
│ ncn_la_step2: "125 off at mov 349"  ← Stored as text       │
│ ncn_la_step3: "150 off at mov 549"  ← Stored as text       │
│ ncn_la: "843"                        ← Separate column      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (RestaurantDetail.tsx) - CURRENT CODE              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ restaurant.ncn_la_step1 && {                                │
│   flatOff: parseInt(restaurant.ncn_la || "0"),  ← Uses 843 │
│   mov: 249,  ← HARDCODED! Ignores "100 off at mov 249"     │
│ }                                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ DISPLAY (What User Sees) ❌ WRONG                           │
├─────────────────────────────────────────────────────────────┤
│ LA Step 1: 843 off at mov 249  ← Wrong flat off!           │
│ LA Step 2: 843 off at mov 349  ← Wrong flat off!           │
│ LA Step 3: 843 off at mov 549  ← Wrong flat off!           │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ CORRECT FLOW (NEEDED)

```
┌─────────────────────────────────────────────────────────────┐
│ CSV FILE (NCN-codes.csv)                                    │
├─────────────────────────────────────────────────────────────┤
│ Restaurant 6503620:                                         │
│   ncn_la_step1: "100 off at mov 249"                       │
│   ncn_la_step2: "125 off at mov 349"                       │
│   ncn_la_step3: "150 off at mov 549"                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ SUPABASE DATABASE (drive_sheets_data table)                │
├─────────────────────────────────────────────────────────────┤
│ res_id: "6503620"                                           │
│ ncn_la_step1: "100 off at mov 249"  ← Text to be parsed    │
│ ncn_la_step2: "125 off at mov 349"  ← Text to be parsed    │
│ ncn_la_step3: "150 off at mov 549"  ← Text to be parsed    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ PARSER UTILITY (parseStepperCode.ts) - NEW                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ parseStepperCode("100 off at mov 249")                     │
│   ↓ Regex: /(\d+)\s*off\s*at\s*mov\s*(\d+)/i              │
│   ↓ Extract: match[1] = "100", match[2] = "249"            │
│   ↓ Return: { flatOff: 100, mov: 249 }                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (RestaurantDetail.tsx) - FIXED CODE               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ const parsed = parseStepperCode(restaurant.ncn_la_step1);  │
│ return parsed && {                                          │
│   flatOff: parsed.flatOff,  ← Uses 100 from parsing        │
│   mov: parsed.mov,          ← Uses 249 from parsing        │
│ }                                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ DISPLAY (What User Sees) ✅ CORRECT                         │
├─────────────────────────────────────────────────────────────┤
│ LA Step 1: 100 off at mov 249  ← Correct!                  │
│ LA Step 2: 125 off at mov 349  ← Correct!                  │
│ LA Step 3: 150 off at mov 549  ← Correct!                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 COMPARISON: Different Restaurants

### Restaurant A (6503620 - Current Test)

```
CSV: "100 off at mov 249"
├─ BEFORE FIX: 843 off at mov 249  ❌
└─ AFTER FIX:  100 off at mov 249  ✅
```

### Restaurant B (Hypothetical - Budget Restaurant)

```
CSV: "80 off at mov 199"
├─ BEFORE FIX: 650 off at mov 249  ❌ COMPLETELY WRONG
└─ AFTER FIX:  80 off at mov 199   ✅ CORRECT
```

### Restaurant C (Hypothetical - Premium Restaurant)

```
CSV: "200 off at mov 499"
├─ BEFORE FIX: 1200 off at mov 249  ❌ DISASTER
└─ AFTER FIX:  200 off at mov 499   ✅ CORRECT
```

---

## 🎯 THE FIX IN 3 STEPS

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: Create Parser                                       │
├──────────────────────────────────────────────────────────────┤
│ File: src/utils/parseStepperCode.ts                         │
│                                                              │
│ export function parseStepperCode(text: string | null) {     │
│   if (!text) return null;                                   │
│   const match = text.match(/(\d+)\s*off\s*at\s*mov\s*(\d+)/i);│
│   if (!match) return null;                                  │
│   return {                                                   │
│     flatOff: parseInt(match[1], 10),                        │
│     mov: parseInt(match[2], 10),                            │
│   };                                                         │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: Import in RestaurantDetail.tsx                      │
├──────────────────────────────────────────────────────────────┤
│ import { parseStepperCode } from "@/utils/parseStepperCode";│
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 3: Replace Hardcoded Logic (9 times)                   │
├──────────────────────────────────────────────────────────────┤
│ BEFORE:                                                      │
│   restaurant.ncn_la_step1 && {                              │
│     flatOff: parseInt(restaurant.ncn_la || "0"),            │
│     mov: 249,                                               │
│   }                                                          │
│                                                              │
│ AFTER:                                                       │
│   (() => {                                                   │
│     const parsed = parseStepperCode(restaurant.ncn_la_step1);│
│     return parsed && {                                       │
│       flatOff: parsed.flatOff,                              │
│       mov: parsed.mov,                                       │
│     };                                                       │
│   })()                                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 IMPACT VISUALIZATION

### Before Fix (Sprint 1 - 1 Restaurant)
```
┌─────────────────────────────────────┐
│ Restaurant 6503620                  │
│ ❌ Shows: 843 off at mov 249        │
│ ✅ Should: 100 off at mov 249       │
│ Impact: WRONG but not critical yet  │
└─────────────────────────────────────┘
```

### After Sprint 2 (5,500 Restaurants) - If Not Fixed
```
┌─────────────────────────────────────┐
│ Restaurant 1                        │
│ ❌ Shows: 843 off at mov 249        │
├─────────────────────────────────────┤
│ Restaurant 2                        │
│ ❌ Shows: 650 off at mov 249        │
├─────────────────────────────────────┤
│ Restaurant 3                        │
│ ❌ Shows: 1200 off at mov 249       │
├─────────────────────────────────────┤
│ ... 5,497 more restaurants          │
│ ❌ ALL SHOWING WRONG DATA           │
├─────────────────────────────────────┤
│ Impact: SYSTEM UNUSABLE 🚨          │
└─────────────────────────────────────┘
```

### After Sprint 2 (5,500 Restaurants) - If Fixed
```
┌─────────────────────────────────────┐
│ Restaurant 1                        │
│ ✅ Shows: 100 off at mov 249        │
├─────────────────────────────────────┤
│ Restaurant 2                        │
│ ✅ Shows: 80 off at mov 199         │
├─────────────────────────────────────┤
│ Restaurant 3                        │
│ ✅ Shows: 200 off at mov 499        │
├─────────────────────────────────────┤
│ ... 5,497 more restaurants          │
│ ✅ ALL SHOWING CORRECT DATA         │
├─────────────────────────────────────┤
│ Impact: SYSTEM WORKS PERFECTLY ✅   │
└─────────────────────────────────────┘
```

---

## 🎯 BOTTOM LINE

**Without Fix:**
- 1 restaurant = Wrong data
- 5,500 restaurants = Disaster

**With Fix:**
- 1 restaurant = Correct data
- 5,500 restaurants = Success

**Time to Fix:** 1-2 hours  
**Time Saved:** Prevents complete system failure  
**Priority:** 🔴 CRITICAL

---

**See `FIX-HARDCODED-VALUES-CONTEXT.md` for complete implementation details!**


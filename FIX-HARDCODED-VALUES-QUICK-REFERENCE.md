# 🚨 Quick Reference: Fix Hardcoded NCN Stepper Codes

**Priority:** 🔴 CRITICAL  
**Estimated Time:** 1-2 hours  
**Blocker For:** Sprint 2 (importing all 5,500 restaurants)

---

## 🎯 THE PROBLEM IN ONE SENTENCE

NCN stepper codes have hardcoded MOV values and use the wrong column for flat off amounts, making the system unusable for all 5,500 restaurants.

---

## 📋 WHAT TO DO

### **Step 1: Create Parser Utility (30 min)**

**File:** `src/utils/parseStepperCode.ts`

```typescript
export function parseStepperCode(text: string | null): {
  flatOff: number;
  mov: number;
} | null {
  if (!text) return null;
  
  const match = text.match(/(\d+)\s*off\s*at\s*mov\s*(\d+)/i);
  
  if (!match) return null;
  
  return {
    flatOff: parseInt(match[1], 10),
    mov: parseInt(match[2], 10),
  };
}
```

**Test it:**
```typescript
parseStepperCode("100 off at mov 249") // → { flatOff: 100, mov: 249 }
parseStepperCode("125 off at mov 349") // → { flatOff: 125, mov: 349 }
parseStepperCode(null)                 // → null
```

---

### **Step 2: Update RestaurantDetail.tsx (30 min)**

**File:** `src/pages/RestaurantDetail.tsx`

**Add import:**
```typescript
import { parseStepperCode } from "@/utils/parseStepperCode";
```

**Replace this pattern (9 times):**

**BEFORE (WRONG):**
```typescript
restaurant.ncn_la_step1 && {
  id: "la-step1",
  flatOff: parseInt(restaurant.ncn_la || "0"),  // ❌
  mov: 249,  // ❌ HARDCODED
  status: "Picked" as const,
  selected: false,
}
```

**AFTER (CORRECT):**
```typescript
(() => {
  const parsed = parseStepperCode(restaurant.ncn_la_step1);
  return parsed && {
    id: "la-step1",
    flatOff: parsed.flatOff,  // ✅
    mov: parsed.mov,          // ✅
    status: "Picked" as const,
    selected: false,
  };
})()
```

**Apply to these 9 fields:**
1. `ncn_la_step1` (line ~111)
2. `ncn_la_step2` (line ~118)
3. `ncn_la_step3` (line ~125)
4. `ncn_mm_step1` (line ~141)
5. `ncn_mm_step2` (line ~148)
6. `ncn_mm_step3` (line ~155)
7. `ncn_um_step1` (line ~171)
8. `ncn_um_step2` (line ~178)
9. `ncn_um_step3` (line ~185)

---

### **Step 3: Test (30 min)**

**Visual Test:**
1. Open frontend: `http://localhost:8080`
2. Login as: `gupta.ansh@zomato.com` / `1234`
3. Open restaurant: `6503620`
4. Verify NCN section shows:
   - LA Step 1: **100** off at mov **249** ✅
   - LA Step 2: **125** off at mov **349** ✅
   - LA Step 3: **150** off at mov **549** ✅
   - MM Step 1: **100** off at mov **299** ✅
   - MM Step 2: **125** off at mov **399** ✅
   - MM Step 3: **150** off at mov **549** ✅
   - UM Step 1: **100** off at mov **349** ✅
   - UM Step 2: **125** off at mov **499** ✅
   - UM Step 3: **175** off at mov **649** ✅

**Before Fix (WRONG):**
- Shows: 843/922/769 for flat off amounts

**After Fix (CORRECT):**
- Shows: 100/125/150/175 for flat off amounts

---

## 🔍 HOW TO VERIFY IT'S FIXED

### **Search for Hardcoded Values**

Run these searches in `RestaurantDetail.tsx`:

```bash
# Should find ZERO results after fix:
Search: "mov: 249"
Search: "mov: 299"
Search: "mov: 349"
Search: "mov: 399"
Search: "mov: 499"
Search: "mov: 549"
Search: "mov: 649"

# Should find ZERO results after fix:
Search: "parseInt(restaurant.ncn_la ||"
Search: "parseInt(restaurant.ncn_mm ||"
Search: "parseInt(restaurant.ncn_um ||"
```

If any of these searches return results in the stepper code sections, the fix is incomplete.

---

## 📊 EXPECTED RESULTS

### **Test Restaurant (6503620) - Before vs After**

| Field | CSV Value | Before Fix | After Fix |
|-------|-----------|------------|-----------|
| LA Step 1 | "100 off at mov 249" | 843 off at 249 ❌ | 100 off at 249 ✅ |
| LA Step 2 | "125 off at mov 349" | 843 off at 349 ❌ | 125 off at 349 ✅ |
| LA Step 3 | "150 off at mov 549" | 843 off at 549 ❌ | 150 off at 549 ✅ |
| MM Step 1 | "100 off at mov 299" | 922 off at 299 ❌ | 100 off at 299 ✅ |
| MM Step 2 | "125 off at mov 399" | 922 off at 399 ❌ | 125 off at 399 ✅ |
| MM Step 3 | "150 off at mov 549" | 922 off at 549 ❌ | 150 off at 549 ✅ |
| UM Step 1 | "100 off at mov 349" | 769 off at 349 ❌ | 100 off at 349 ✅ |
| UM Step 2 | "125 off at mov 499" | 769 off at 499 ❌ | 125 off at 499 ✅ |
| UM Step 3 | "175 off at mov 649" | 769 off at 649 ❌ | 175 off at 649 ✅ |

---

## ⚠️ COMMON MISTAKES TO AVOID

1. **Don't forget the IIFE wrapper:** `(() => { ... })()`
2. **Don't forget to filter:** `.filter(Boolean)` at the end of the array
3. **Don't use `ncn_la/ncn_mm/ncn_um` for stepper flatOff** - parse from text instead
4. **Update all 9 fields** - LA (3) + MM (3) + UM (3)
5. **Test on frontend** - don't just assume it works

---

## 🎯 DEFINITION OF DONE

- [ ] `parseStepperCode.ts` created
- [ ] Parser tested with sample data
- [ ] All 9 stepper fields updated in RestaurantDetail.tsx
- [ ] No hardcoded MOV values remain (search confirms)
- [ ] Frontend shows correct values for test restaurant
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Documentation updated

---

## 📞 IF YOU GET STUCK

**Common Issues:**

**Issue:** TypeScript error "Type 'false | { ... }' is not assignable"
**Fix:** Make sure you're using the IIFE pattern and `.filter(Boolean)`

**Issue:** Values still showing as 843/922/769
**Fix:** Check you're using `parsed.flatOff` not `restaurant.ncn_la`

**Issue:** Nothing displays
**Fix:** Check parsing is working - add `console.log(parsed)` to debug

**Issue:** Some codes show, others don't
**Fix:** Check CSV data - null values won't show (expected behavior)

---

## 📚 REFERENCE

**Full Context:** See `FIX-HARDCODED-VALUES-CONTEXT.md`

**Current Code:** `src/pages/RestaurantDetail.tsx` lines 80-196

**Test Data:** `test_restaurant_6503620.json`

**CSV Format:** `"[NUMBER] off at mov [NUMBER]"`

---

**READY TO FIX!** 🚀


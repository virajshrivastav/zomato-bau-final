# 🚨 CRITICAL FIX NEEDED: Hardcoded Values in NCN Stepper Codes

**Date:** 2025-11-14  
**Priority:** 🔴 CRITICAL - Must fix before Sprint 2 (full data import)  
**Status:** 🟡 Issue Identified - Fix Pending

---

## 📖 BACKGROUND & CONTEXT

### **Project Overview**
We're building a Zomato Drive Dashboard that displays restaurant drive data (NCN, N2R, Items) from CSV files. The data flows:

```
CSV Files (3 sources) → Supabase Database → Frontend Display
```

### **What We've Accomplished (Sprint 1)**
✅ Created `drive_sheets_data` table with 200+ columns  
✅ Imported test restaurant (6503620 - Kanha Veg)  
✅ Created `useDriveSheets` hook to fetch from Supabase  
✅ Updated frontend to display real data  
✅ Verified 100% data accuracy for test restaurant  

### **Current Status**
- Only 1 restaurant in database (test restaurant)
- Frontend is displaying data
- **BUT:** Critical bug discovered in NCN stepper code mapping

---

## 🎯 THE OVERALL MOTIVE

### **Business Goal**
KAMs (Key Account Managers) need to see accurate discount codes for each restaurant to make business decisions:
- **NCN Drive:** Stepper codes with flat off amounts and MOV (Minimum Order Value)
- **N2R Drive:** Suggested discount constructs
- **Items Drive:** Dish suggestions for menu optimization

### **Technical Goal**
Import all ~5,500 restaurants from CSV files and display their unique data accurately on the frontend.

---

## 🚨 WHAT WENT WRONG

### **The Critical Bug**

During Sprint 1 verification, we discovered that NCN stepper codes have **hardcoded values** in the frontend instead of parsing the actual CSV data.

### **Example of the Problem**

**CSV Data for Restaurant 6503620:**
```json
{
  "ncn_la_step1": "100 off at mov 249",
  "ncn_la_step2": "125 off at mov 349",
  "ncn_la_step3": "150 off at mov 549",
  "ncn_la": "843"
}
```

**What Frontend Currently Shows:**
- Step 1: **843 off at mov 249** ❌
- Step 2: **843 off at mov 349** ❌
- Step 3: **843 off at mov 549** ❌

**What Frontend SHOULD Show:**
- Step 1: **100 off at mov 249** ✅
- Step 2: **125 off at mov 349** ✅
- Step 3: **150 off at mov 549** ✅

### **Root Cause**

**File:** `src/pages/RestaurantDetail.tsx`  
**Lines:** 111-131 (LA), 141-161 (MM), 171-191 (UM)

**Current Code (WRONG):**
```typescript
restaurant.ncn_la_step1 && {
  id: "la-step1",
  flatOff: parseInt(restaurant.ncn_la || "0"),  // ❌ Uses ncn_la column (843)
  mov: 249,  // ❌ HARDCODED
  status: "Picked" as const,
  selected: false,
}
```

**Problems:**
1. ❌ **Flat Off:** Uses `ncn_la` column (843) instead of parsing "100" from the step text
2. ❌ **MOV:** Hardcoded to 249 instead of parsing "249" from the step text

---

## 💥 IMPACT IF NOT FIXED

### **Impact on Test Restaurant (Current)**
- Shows wrong flat off amounts (843 instead of 100/125/150)
- MOV values happen to be correct by coincidence (hardcoded values match CSV)

### **Impact on All 5,500 Restaurants (Sprint 2)**

**Example Restaurant A:**
```
CSV: "80 off at mov 199"
Frontend shows: "650 off at mov 249" ❌ COMPLETELY WRONG
```

**Example Restaurant B:**
```
CSV: "150 off at mov 399"
Frontend shows: "1200 off at mov 249" ❌ COMPLETELY WRONG
```

**Business Impact:**
- ❌ KAMs see incorrect discount amounts
- ❌ Wrong MOV values lead to wrong business decisions
- ❌ System is unusable for production
- ❌ All 5,500 restaurants will have wrong data
- ❌ **BLOCKER for Sprint 2**

---

## ✅ WHAT IS NEEDED

### **Required Fix: Parse CSV Text Instead of Hardcoding**

The CSV text format is:
```
"[FLAT_OFF] off at mov [MOV]"
```

Examples:
- `"100 off at mov 249"` → flatOff: 100, mov: 249
- `"125 off at mov 349"` → flatOff: 125, mov: 349
- `"80 off at mov 199"` → flatOff: 80, mov: 199

### **Solution Architecture**

1. **Create a parsing utility function**
2. **Update RestaurantDetail.tsx to use parsed values**
3. **Test with multiple data patterns**
4. **Verify all 9 stepper code fields**

---

## 📋 DETAILED IMPLEMENTATION REQUIREMENTS

### **Step 1: Create Parsing Utility Function**

**File to Create:** `src/utils/parseStepperCode.ts`

**Function Signature:**
```typescript
export function parseStepperCode(text: string | null): {
  flatOff: number;
  mov: number;
} | null
```

**Requirements:**
- Parse text format: `"[NUMBER] off at mov [NUMBER]"`
- Handle variations: case-insensitive, extra spaces
- Return `null` if parsing fails
- Return object with `flatOff` and `mov` as numbers

**Test Cases:**
```typescript
parseStepperCode("100 off at mov 249")     → { flatOff: 100, mov: 249 }
parseStepperCode("125 off at mov 349")     → { flatOff: 125, mov: 349 }
parseStepperCode("80 OFF at MOV 199")      → { flatOff: 80, mov: 199 }
parseStepperCode("  150  off  at  mov  399  ") → { flatOff: 150, mov: 399 }
parseStepperCode(null)                     → null
parseStepperCode("")                       → null
parseStepperCode("invalid text")           → null
```

**Regex Pattern:**
```typescript
/(\d+)\s*off\s*at\s*mov\s*(\d+)/i
```

**Example Implementation:**
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

---

### **Step 2: Update RestaurantDetail.tsx**

**File to Modify:** `src/pages/RestaurantDetail.tsx`

**Import the utility:**
```typescript
import { parseStepperCode } from "@/utils/parseStepperCode";
```

**Fields to Fix (9 total):**

#### **LA Stepper Codes (Lines 111-131)**

**Current Code (WRONG):**
```typescript
restaurant.ncn_la_step1 && {
  id: "la-step1",
  flatOff: parseInt(restaurant.ncn_la || "0"),  // ❌ WRONG
  mov: 249,  // ❌ HARDCODED
  status: "Picked" as const,
  selected: false,
}
```

**Fixed Code (CORRECT):**
```typescript
(() => {
  const parsed = parseStepperCode(restaurant.ncn_la_step1);
  return parsed && {
    id: "la-step1",
    flatOff: parsed.flatOff,  // ✅ Parsed from CSV
    mov: parsed.mov,          // ✅ Parsed from CSV
    status: "Picked" as const,
    selected: false,
  };
})()
```

**Apply same fix to:**
- `ncn_la_step1` (line ~111)
- `ncn_la_step2` (line ~118)
- `ncn_la_step3` (line ~125)
- `ncn_mm_step1` (line ~141)
- `ncn_mm_step2` (line ~148)
- `ncn_mm_step3` (line ~155)
- `ncn_um_step1` (line ~171)
- `ncn_um_step2` (line ~178)
- `ncn_um_step3` (line ~185)

**Note:** Base codes (e.g., `ncn_la_base_code_suggested`) might need different parsing if they have different format. Check the CSV data first.

---

### **Step 3: Handle Base Codes**

**CSV Data for Base Codes:**
```json
{
  "ncn_la_base_code_suggested": "40 upto 80",
  "ncn_mm_base_code_suggested": "40 upto 80",
  "ncn_um_base_code_suggested": "40 upto 80"
}
```

**Format:** `"[FLAT_OFF] upto [MAX_AMOUNT]"`

**Current Code (Lines 104-110):**
```typescript
restaurant.ncn_la_base_code_suggested && {
  id: "la-base",
  flatOff: parseInt(restaurant.ncn_la || "0"),  // ❌ Uses ncn_la (843)
  mov: 0,
  status: "Picked" as const,
  selected: false,
}
```

**Options:**

**Option A:** Parse base code text
```typescript
// Create parseBaseCode utility
export function parseBaseCode(text: string | null): {
  flatOff: number;
  maxAmount: number;
} | null {
  if (!text) return null;
  const match = text.match(/(\d+)\s*upto\s*(\d+)/i);
  if (!match) return null;
  return {
    flatOff: parseInt(match[1], 10),  // 40
    maxAmount: parseInt(match[2], 10), // 80
  };
}
```

**Option B:** Keep current behavior if base codes don't need MOV
- Base codes might just be informational
- Check with user if base codes need parsing

**Action Required:** Clarify with user whether base codes need parsing or can stay as-is.

---

### **Step 4: Testing Requirements**

#### **Test Data Needed**

Create test cases with different stepper code patterns:

**Test Case 1: Standard Format**
```json
{
  "ncn_la_step1": "100 off at mov 249",
  "ncn_la_step2": "125 off at mov 349",
  "ncn_la_step3": "150 off at mov 549"
}
```
Expected: flatOff: 100/125/150, mov: 249/349/549

**Test Case 2: Different Values**
```json
{
  "ncn_la_step1": "80 off at mov 199",
  "ncn_la_step2": "100 off at mov 299",
  "ncn_la_step3": "120 off at mov 399"
}
```
Expected: flatOff: 80/100/120, mov: 199/299/399

**Test Case 3: High-Value Restaurant**
```json
{
  "ncn_la_step1": "200 off at mov 499",
  "ncn_la_step2": "300 off at mov 699",
  "ncn_la_step3": "400 off at mov 899"
}
```
Expected: flatOff: 200/300/400, mov: 499/699/899

**Test Case 4: Null/Empty Values**
```json
{
  "ncn_la_step1": null,
  "ncn_la_step2": "",
  "ncn_la_step3": "150 off at mov 549"
}
```
Expected: Only step3 shows, others hidden

**Test Case 5: Invalid Format**
```json
{
  "ncn_la_step1": "invalid text",
  "ncn_la_step2": "100",
  "ncn_la_step3": "off at mov"
}
```
Expected: All hidden (parsing returns null)

#### **Verification Steps**

1. **Unit Test the Parser:**
   - Test `parseStepperCode()` with all test cases
   - Verify regex handles variations (case, spaces)
   - Verify null/empty handling

2. **Visual Test on Frontend:**
   - Update test restaurant data in Supabase
   - Verify frontend displays parsed values
   - Check all 9 stepper codes (LA/MM/UM × 3 steps)

3. **Test with Multiple Restaurants:**
   - Import 3-5 restaurants with different data
   - Verify each shows unique values
   - Confirm no hardcoded values appear

---

## 📊 COMPLETE LIST OF AFFECTED FIELDS

### **NCN Stepper Codes (9 fields - CRITICAL)**

| Database Column | Current Behavior | Required Behavior | Priority |
|-----------------|------------------|-------------------|----------|
| `ncn_la_step1` | Hardcoded mov: 249 | Parse from text | 🔴 CRITICAL |
| `ncn_la_step2` | Hardcoded mov: 349 | Parse from text | 🔴 CRITICAL |
| `ncn_la_step3` | Hardcoded mov: 549 | Parse from text | 🔴 CRITICAL |
| `ncn_mm_step1` | Hardcoded mov: 299 | Parse from text | 🔴 CRITICAL |
| `ncn_mm_step2` | Hardcoded mov: 399 | Parse from text | 🔴 CRITICAL |
| `ncn_mm_step3` | Hardcoded mov: 549 | Parse from text | 🔴 CRITICAL |
| `ncn_um_step1` | Hardcoded mov: 349 | Parse from text | 🔴 CRITICAL |
| `ncn_um_step2` | Hardcoded mov: 499 | Parse from text | 🔴 CRITICAL |
| `ncn_um_step3` | Hardcoded mov: 649 | Parse from text | 🔴 CRITICAL |

### **NCN Base Codes (3 fields - TO CLARIFY)**

| Database Column | Current Behavior | Question | Priority |
|-----------------|------------------|----------|----------|
| `ncn_la_base_code_suggested` | Uses ncn_la for flatOff | Parse "40 upto 80"? | 🟡 MEDIUM |
| `ncn_mm_base_code_suggested` | Uses ncn_mm for flatOff | Parse "40 upto 80"? | 🟡 MEDIUM |
| `ncn_um_base_code_suggested` | Uses ncn_um for flatOff | Parse "40 upto 80"? | 🟡 MEDIUM |

### **Other Hardcoded Values (Lower Priority)**

| Field | Current Value | Question | Priority |
|-------|---------------|----------|----------|
| Salt percentage | Hardcoded: 15 | Should come from CSV? | 🟢 LOW |
| N2R fallback construct (LA) | "50% upto 100" | OK as fallback? | 🟢 LOW |
| N2R fallback construct (MM) | "60% upto 120" | OK as fallback? | 🟢 LOW |
| N2R fallback construct (UM) | "70% upto 150" | OK as fallback? | 🟢 LOW |

---

## 🎯 ACCEPTANCE CRITERIA

### **Definition of Done**

✅ **Parser Function Created**
- `parseStepperCode()` utility function exists
- Handles all test cases correctly
- Returns null for invalid input

✅ **RestaurantDetail.tsx Updated**
- All 9 stepper code fields use parser
- No hardcoded MOV values remain
- No usage of `ncn_la/ncn_mm/ncn_um` for stepper flatOff

✅ **Testing Complete**
- Unit tests pass for parser
- Visual verification on frontend
- Test restaurant shows correct values
- Multiple restaurants tested

✅ **Documentation Updated**
- Code comments explain parsing logic
- DRIVE-DATA-PROGRESS.md updated
- This fix documented in completion report

---

## 📁 FILES TO MODIFY

### **New Files to Create**

1. **`src/utils/parseStepperCode.ts`**
   - Export `parseStepperCode()` function
   - Optional: Export `parseBaseCode()` function
   - Include JSDoc comments

2. **`src/utils/__tests__/parseStepperCode.test.ts`** (Optional but recommended)
   - Unit tests for parser
   - Test all edge cases

### **Existing Files to Modify**

1. **`src/pages/RestaurantDetail.tsx`**
   - Import parser utility
   - Update lines 111-131 (LA stepper codes)
   - Update lines 141-161 (MM stepper codes)
   - Update lines 171-191 (UM stepper codes)
   - Optional: Update lines 104-110 (LA base code)
   - Optional: Update lines 134-140 (MM base code)
   - Optional: Update lines 164-170 (UM base code)

2. **`DRIVE-DATA-PROGRESS.md`**
   - Add entry in "Resolved Issues" section
   - Document the fix

---

## 🔍 VERIFICATION CHECKLIST

Before marking this fix as complete, verify:

- [ ] Parser function created and tested
- [ ] All 9 stepper code fields updated
- [ ] No hardcoded MOV values in RestaurantDetail.tsx
- [ ] Test restaurant (6503620) shows correct values:
  - [ ] LA Step 1: 100 off at mov 249
  - [ ] LA Step 2: 125 off at mov 349
  - [ ] LA Step 3: 150 off at mov 549
  - [ ] MM Step 1: 100 off at mov 299
  - [ ] MM Step 2: 125 off at mov 399
  - [ ] MM Step 3: 150 off at mov 549
  - [ ] UM Step 1: 100 off at mov 349
  - [ ] UM Step 2: 125 off at mov 499
  - [ ] UM Step 3: 175 off at mov 649
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Frontend displays correctly
- [ ] Ready for Sprint 2 (full import)

---

## 📞 QUESTIONS TO RESOLVE

Before implementing, clarify:

1. **Base Codes:** Should `ncn_la_base_code_suggested` ("40 upto 80") be parsed or keep current behavior?
2. **Salt Percentage:** Should this come from CSV or stay hardcoded at 15%?
3. **N2R Fallbacks:** Are the hardcoded fallback values OK or should they be removed?
4. **Error Handling:** What should display if parsing fails? Hide the code or show error?

---

## 🚀 NEXT STEPS AFTER FIX

Once this fix is complete:

1. ✅ Re-verify test restaurant data
2. ✅ Update documentation
3. ✅ Mark Sprint 1 as fully complete
4. ✅ Proceed with Sprint 2: Import all 5,500 restaurants
5. ✅ Test with multiple KAMs
6. ✅ Production deployment

---

## 📚 REFERENCE FILES

**Current Implementation:**
- `src/pages/RestaurantDetail.tsx` (lines 80-196)
- `src/hooks/useDriveSheets.ts`

**Test Data:**
- `test_restaurant_6503620.json`
- `insert_test_restaurant.sql`

**Documentation:**
- `DRIVE-DATA-PROGRESS.md`
- `DRIVE-DATA-IMPLEMENTATION-PLAN.md`
- `SPRINT-1-COMPLETION-REPORT.md`

**CSV Sources:**
- `drive-data/NCN-codes.csv`
- `drive-data/N2R-Codes.csv`
- `drive-data/Items-159LL.csv`

---

## ⚡ URGENCY

**Priority:** 🔴 **CRITICAL - BLOCKER FOR SPRINT 2**

**Why Critical:**
- Affects all 5,500 restaurants
- Makes system unusable for production
- Must be fixed before importing full dataset
- Impacts business decisions

**Estimated Time:** 1-2 hours
- Parser function: 30 minutes
- Update RestaurantDetail.tsx: 30 minutes
- Testing: 30 minutes
- Documentation: 15 minutes

---

**END OF CONTEXT DOCUMENT**

**Ready to paste into new thread and implement the fix!** 🚀


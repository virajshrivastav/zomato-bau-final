# 🚀 Quick Reference for Next Thread - Scaling to 5,500 Restaurants

**Read This First Before Starting Next Thread**

---

## ✅ WHAT'S WORKING NOW

### Current Status: 1 Restaurant (6503620) Fully Functional

- ✅ Database table `drive_sheets_data` created in Supabase
- ✅ Single test restaurant imported and displaying correctly
- ✅ All NCN stepper codes parsing dynamically (no hardcoded values)
- ✅ Base codes (percentage-based) displaying correctly
- ✅ React Query hooks fetching data from Supabase
- ✅ UI components rendering with conditional formatting
- ✅ Type-safe TypeScript implementation

**Test Login:**
- Email: `gupta.ansh@zomato.com`
- Password: `1234`
- Restaurant: `6503620`
- URL: `http://localhost:8080/restaurant/6503620`

---

## 🎯 NEXT GOAL: Import All 5,500 Restaurants

---

## 📋 CRITICAL FILES YOU NEED

### 1. **Complete Implementation Guide**
📄 `DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md`
- Full data flow architecture
- All challenges and solutions
- Step-by-step scaling guide
- Best practices and patterns

### 2. **Database Schema**
📄 `supabase/drive_sheets_data_schema.sql`
- Table definition with 200+ columns
- Already created in Supabase
- ⚠️ RLS currently DISABLED (see below)

### 3. **Data Fetching Hooks**
📄 `src/hooks/useDriveSheets.ts`
- `useDriveSheets()` - Fetch all restaurants
- `useDriveSheet(resId)` - Fetch single restaurant
- React Query implementation

### 4. **Parser Utilities**
📄 `src/utils/parseStepperCode.ts` - Parses "100 off at mov 249"
📄 `src/utils/parseBaseCode.ts` - Parses "40 upto 80"

### 5. **Data Transformation**
📄 `src/pages/RestaurantDetail.tsx`
- Transforms database data to UI format
- Uses IIFE pattern for inline parsing
- Applies `.filter(Boolean)` to remove nulls

---

## 🔴 CRITICAL WARNINGS

### 1. **RLS (Row Level Security) is DISABLED**
```sql
-- Currently disabled for testing
ALTER TABLE drive_sheets_data DISABLE ROW LEVEL SECURITY;
```

**⚠️ MUST RE-ENABLE BEFORE PRODUCTION**
- See `PROPER_RLS_POLICY.sql` for implementation
- Or implement application-layer filtering
- Test with multiple KAM logins

### 2. **Mock Data Still Exists in Metrics**
File: `src/pages/RestaurantDetail.tsx` (lines 71-80)

```typescript
const metricsData: RestaurantMetrics = {
  activeDrives: 3,        // ❌ HARDCODED
  zvdPo: restaurant.sept_ov || "N/A",  // ✅ REAL
  adsBudget: {
    total: 50000,         // ❌ HARDCODED
    utilized: 32000,      // ❌ HARDCODED
    percentage: 64,       // ❌ HARDCODED
  },
  toingFlag: "Not Live",  // ❌ HARDCODED
};
```

**Action Required:**
- Calculate `activeDrives` dynamically
- Fetch `adsBudget` from database or remove
- Fetch `toingFlag` from database or remove

### 3. **Python Scripts Cannot Connect to Supabase**
- Network error: `[Errno 11001] getaddrinfo failed`
- **Workaround:** Use SQL INSERT approach
- See `scripts/export_test_restaurant_json.py` and `insert_test_restaurant.sql`

---

## 🏗️ DATA FLOW ARCHITECTURE

```
CSV Files (NCN, N2R, Items)
    ↓
Python Script / SQL INSERT
    ↓
Supabase Database (drive_sheets_data)
    ↓
React Query Hooks (useDriveSheets)
    ↓
RestaurantDetail.tsx (Parsing & Transformation)
    ↓
UI Components (Conditional Rendering)
    ↓
User Sees Dynamic Data
```

---

## 🔑 KEY PATTERNS USED

### 1. **IIFE Pattern for Inline Parsing**
```typescript
(() => {
  const parsed = parseStepperCode(restaurant.ncn_la_step1);
  return parsed && {
    id: "la-step1",
    flatOff: parsed.flatOff,
    mov: parsed.mov,
    status: "Picked" as const,
    selected: false,
  };
})()
```

### 2. **Filter Boolean to Remove Nulls**
```typescript
[code1, code2, code3].filter(Boolean)
```

### 3. **Conditional Rendering Based on Data Shape**
```typescript
{code.percentage !== undefined ? (
  <PercentageView />  // Base codes
) : (
  <FlatDiscountView />  // Stepper codes
)}
```

### 4. **Optional Properties for Flexible Types**
```typescript
interface PromoCode {
  flatOff?: number;      // For stepper codes
  mov?: number;
  percentage?: number;   // For base codes
  maxAmount?: number;
}
```

---

## 📊 IMPORT STRATEGY FOR 5,500 RESTAURANTS

### Phase 1: Preparation
1. Validate CSV files (NCN, N2R, Items)
2. Update import script for batch processing
3. Test with 10-20 restaurants first

### Phase 2: Database Import
1. Backup current database
2. Import in batches (100, 500, 1000, all)
3. Verify data integrity after each batch

### Phase 3: Frontend Testing
1. Test with multiple KAMs
2. Test different restaurant types
3. Performance testing

### Phase 4: Production
1. Re-enable RLS
2. Fix mock data in metrics
3. Final verification

**Estimated Time:** 5-8 hours total

---

## 🚨 COMMON PITFALLS TO AVOID

1. **Forgetting `.filter(Boolean)`** → Includes null/undefined in arrays
2. **Using wrong column** → `ncn_la` instead of `ncn_la_step1`
3. **Hardcoding values** → `mov: 249` instead of `parsed.mov`
4. **Not handling nulls** → `restaurant.field.toUpperCase()` crashes if null
5. **Forgetting `as const`** → TypeScript errors on literal types

---

## 📞 IF YOU GET STUCK

### Issue: "Restaurant not found"
- Check database: `SELECT * FROM drive_sheets_data WHERE res_id = 'XXX'`
- Check RLS is disabled
- Verify KAM email matches

### Issue: "Data shows as N/A"
- Check CSV data exists
- Verify parser regex matches format
- Add `console.log(parsed)` to debug

### Issue: "TypeScript errors"
- Check interface definitions
- Use `as const` for literals
- Make properties optional if needed

---

## 🎯 SUCCESS CRITERIA

### Before Declaring Success:
- [ ] All 5,500 restaurants imported
- [ ] Multiple KAMs tested (at least 3)
- [ ] Performance acceptable (< 2s page load)
- [ ] RLS re-enabled and working
- [ ] Mock data removed/fixed
- [ ] Error handling robust
- [ ] No console errors
- [ ] No TypeScript errors

---

## 📚 DOCUMENTATION HIERARCHY

1. **START HERE:** `QUICK-REFERENCE-NEXT-THREAD.md` (this file)
2. **FULL GUIDE:** `DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md`
3. **SPECIFIC FIXES:** `FIX-HARDCODED-VALUES-QUICK-REFERENCE.md`
4. **VERIFICATION:** `VERIFICATION-REPORT-NCN-HARDCODED-FIX.md`
5. **HISTORY:** `SPRINT-1-COMPLETION-REPORT.md`
6. **WARNINGS:** `IMPORTANT-NOTES.md`

---

## 🚀 READY TO START!

**Your First Steps:**
1. Read `DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md` thoroughly
2. Verify current system still works (test restaurant 6503620)
3. Prepare CSV files for import
4. Follow Phase 1 of the scaling guide
5. Import in small batches first
6. Test thoroughly before scaling up

**Good luck! 🎉**


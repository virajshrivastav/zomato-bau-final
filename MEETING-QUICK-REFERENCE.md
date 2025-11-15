# 📋 Developer Meeting - Quick Reference Sheet

**Date:** 2025-11-15  
**Purpose:** One-page cheat sheet for quick lookups during meeting

---

## 🎯 THE TWO MAIN PROBLEMS

### Problem #1: Google Sheets Formula Data Returns NULL
- **Issue:** Formula-generated cells return `null` when fetched via API
- **Example:** Cell shows "100 off at mov 249" but API returns `null`
- **Impact:** Cannot read 80% of our data (most columns use formulas)
- **Need:** Solution to read formula RESULTS, not formula text

### Problem #2: Scaling to 5,500 Restaurants
- **Current:** 1 restaurant, works perfectly
- **Target:** 5,500 restaurants, 50+ concurrent users
- **Concerns:** Database performance, frontend rendering, data transfer size
- **Need:** Architecture recommendations for scale

---

## 📊 KEY NUMBERS

| Metric | Current | Target | Concern |
|--------|---------|--------|---------|
| Restaurants | 1 | 5,500 | 5,500x increase |
| Users (KAMs) | 1 | 50+ | Concurrent access |
| Database Columns | 200+ | 200+ | Wide table |
| Data Points | 200 | 1.1M | Transfer size |
| Page Load | <500ms | <2s | Performance |
| Update Frequency | Manual | Daily/Hourly | Sync strategy |

---

## 🏗️ TECH STACK

**Frontend:**
- React 18 + TypeScript
- Vite
- TanStack Query (React Query)
- Tailwind CSS + shadcn/ui

**Backend:**
- Supabase (PostgreSQL + Auth)
- Python (data import scripts)
- Google OAuth

**Data:**
- 3 Google Sheets (NCN, N2R, Items)
- PostgreSQL table: `drive_sheets_data` (200+ columns)

---

## 🔑 CRITICAL FILES

```
📁 Project Root
├── 📄 DEVELOPER-MEETING-BRIEF.md ← Full meeting agenda
├── 📄 SYSTEM-ARCHITECTURE-DIAGRAM.md ← Visual diagrams
├── 📄 DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md ← Implementation details
│
├── 📁 supabase/
│   └── drive_sheets_data_schema.sql ← Database schema (200+ cols)
│
├── 📁 scripts/
│   └── import_drive_data_single.py ← Current CSV import logic
│
└── 📁 src/
    ├── hooks/useDriveSheets.ts ← Data fetching layer
    └── pages/
        ├── KAMHub.tsx ← Restaurant list (needs optimization)
        └── RestaurantDetail.tsx ← Single restaurant view
```

---

## 🚨 GOOGLE SHEETS API - THE FORMULA PROBLEM

### What We're Trying to Read

**Sheet Cell (visible):**
```
=CONCATENATE(A1, " off at mov ", B1)
Display: "100 off at mov 249"
```

**API Response (current):**
```json
{
  "values": [
    [null]  // ❌ Returns null instead of "100 off at mov 249"
  ]
}
```

### What We Need

**API Response (desired):**
```json
{
  "values": [
    ["100 off at mov 249"]  // ✅ Returns the calculated result
  ]
}
```

### Questions for Developer

1. Is `valueRenderOption: 'FORMATTED_VALUE'` the solution?
2. Are there other API parameters we're missing?
3. Is this a known Google Sheets API limitation?
4. What's the recommended workaround?

---

## 📈 SCALABILITY - SPECIFIC CONCERNS

### Database Query
```typescript
// Current (fetches everything)
const { data } = await supabase
  .from("drive_sheets_data")
  .select("*");  // ⚠️ 200+ columns × 5,500 rows

// Question: Should we do this instead?
const { data } = await supabase
  .from("drive_sheets_data")
  .select("res_id, res_name, locality, cuisine")  // Only needed fields
  .eq("am_email", currentUser.email)  // Filter by KAM
  .range(0, 49);  // Pagination
```

### Frontend Rendering
```typescript
// Current (renders all at once)
{restaurants.map(r => <RestaurantCard key={r.id} {...r} />)}
// ⚠️ 5,500 DOM nodes

// Question: Should we use virtual scrolling?
import { useVirtualizer } from '@tanstack/react-virtual';
```

### Data Transfer
```
Current payload size (estimated):
- 5,500 rows × 200 columns × ~50 bytes = ~55 MB

Question: How to optimize?
- Pagination?
- Field selection?
- Compression?
- GraphQL?
```

---

## 💡 PROPOSED SOLUTIONS (Need Validation)

### For Google Sheets

**Option A:** Use `valueRenderOption: 'FORMATTED_VALUE'`
```javascript
const response = await sheets.spreadsheets.values.get({
  spreadsheetId: 'xxx',
  range: 'Sheet1!A1:Z1000',
  valueRenderOption: 'FORMATTED_VALUE'  // ← Key parameter
});
```

**Option B:** Google Apps Script webhook
```javascript
function onEdit(e) {
  // Push data to our API when sheet changes
  UrlFetchApp.fetch('https://our-api.com/webhook', {
    method: 'POST',
    payload: JSON.stringify(getSheetData())
  });
}
```

**Option C:** Keep CSV but automate export
- Apps Script exports to Google Drive
- Backend polls Drive and imports

### For Scalability

**Option A:** Pagination + Virtual Scrolling
- Backend: `LIMIT 50 OFFSET 0`
- Frontend: `@tanstack/react-virtual`

**Option B:** Aggressive Caching
- React Query: `staleTime: 5 * 60 * 1000` (5 min)
- Reduce API calls

**Option C:** Database Optimization
- Add more indexes
- Normalize schema (separate tables?)
- Use database views

---

## ❓ TOP 10 QUESTIONS FOR DEVELOPER

### Google Sheets (Priority 1)
1. How to read formula results via Google Sheets API?
2. What's the correct `valueRenderOption` parameter?
3. Recommended Node.js library for Google Sheets?
4. How to handle API rate limits (100 req/100s)?
5. Service Account vs OAuth for backend access?

### Scalability (Priority 2)
6. Is 200+ columns in one table acceptable?
7. Recommended pagination strategy for 5,500 rows?
8. Should we use GraphQL instead of REST?
9. Virtual scrolling library recommendation?
10. Caching strategy (Redis? React Query? Both)?

---

## 🎯 SUCCESS CRITERIA

By end of meeting, we should have:

✅ Clear answer on Google Sheets formula reading  
✅ Step-by-step plan for Sheets integration  
✅ Scalability architecture recommendation  
✅ Performance optimization checklist  
✅ Timeline estimate for implementation  

---

## 📞 DEMO ACCESS

**Live System:**
- URL: [Your URL]
- Email: gupta.ansh@zomato.com
- Password: 1234
- Test Restaurant: 6503620 (Kanha Veg)

**Google Sheets:**
- NCN Codes: [Sheet URL]
- N2R Codes: [Sheet URL]
- Items ≤159: [Sheet URL]

**Supabase:**
- Project: zomato-drive-dashboard
- Database: drive_sheets_data table

---

## ⏱️ TIME ALLOCATION

- **10 min:** System demo + context
- **20 min:** Google Sheets problem deep-dive
- **20 min:** Scalability discussion
- **10 min:** Action items + next steps

---

## 📝 NOTES SECTION

(Use this space during meeting to capture key points)

**Google Sheets Solution:**
- 
- 
- 

**Scalability Recommendations:**
- 
- 
- 

**Action Items:**
- [ ] 
- [ ] 
- [ ] 

**Follow-up Questions:**
- 
- 

---

**Last Updated:** 2025-11-15  
**Version:** 1.0


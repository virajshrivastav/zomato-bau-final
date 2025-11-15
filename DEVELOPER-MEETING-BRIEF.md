# 🤝 Developer Meeting Brief - Zomato Drive Dashboard

**Date:** 2025-11-15  
**Purpose:** Technical consultation on Google Sheets integration and scalability  
**Attendee:** Full-Stack Developer  
**Duration:** 60 minutes

---

## 📋 AGENDA

1. **Current System Overview** (10 min)
2. **Problem #1: Google Sheets Direct Integration** (20 min)
3. **Problem #2: Scalability & Performance** (20 min)
4. **Technical Q&A** (10 min)

---

## 🎯 PROJECT OVERVIEW

### What We Built
A unified dashboard for Key Account Managers (KAMs) to manage restaurant partnership drives, replacing the inefficient workflow of managing 5-10 Google Sheets with 50+ columns each.

### Current Status
- ✅ **MVP Complete** - All 5 screens working
- ✅ **Sprint 1 Complete** - Single restaurant data flow verified (100% accuracy)
- 🔄 **Sprint 2 Pending** - Scale to all 5,500 restaurants

### Business Context
- **Users:** 50+ KAMs managing 5,500+ restaurants
- **Data Sources:** 3 Google Sheets (NCN, N2R, Items) with 200+ combined columns
- **Current Workflow:** CSV export → Manual import → Database → Dashboard
- **Desired Workflow:** Google Sheets → Real-time sync → Dashboard

---

## 🏗️ TECHNICAL ARCHITECTURE

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TanStack Query (React Query) for state management
- Tailwind CSS + shadcn/ui components
- React Router v6

**Backend:**
- Supabase (PostgreSQL database + Auth)
- Row Level Security (RLS) for data isolation
- Google OAuth for authentication

**Data Layer:**
- PostgreSQL table: `drive_sheets_data` (200+ columns)
- Python scripts for CSV import
- React Query hooks for data fetching

### Current Data Flow

```
Google Sheets (Source of Truth)
    ↓
Manual CSV Export (3 files)
    ↓
Python Import Script (scripts/import_drive_data_single.py)
    ↓
Supabase PostgreSQL (drive_sheets_data table)
    ↓
React Query Hooks (useDriveSheets.ts)
    ↓
Frontend Components (RestaurantDetail.tsx, KAMHub.tsx)
    ↓
User Interface
```

### Database Schema
- **Table:** `drive_sheets_data`
- **Columns:** 200+ (NCN: ~100, N2R: ~50, Items: ~50)
- **Primary Key:** `res_id` (restaurant ID)
- **Indexes:** `res_id`, `am_email`
- **RLS:** Currently disabled for testing (needs re-enabling)

### Key Files
- **Schema:** `supabase/drive_sheets_data_schema.sql`
- **Import Script:** `scripts/import_drive_data_single.py`
- **Data Hooks:** `src/hooks/useDriveSheets.ts`
- **Frontend Pages:** `src/pages/RestaurantDetail.tsx`, `src/pages/KAMHub.tsx`

---

## 🚨 PROBLEM #1: Google Sheets Direct Integration

### Current Limitation
We currently require CSV files to be manually exported and imported into the database before data appears in the system.

### Desired Solution
Fetch data directly from Google Sheets in real-time without manual CSV export/import.

### The Core Issue: Formula-Generated Data Reads as NULL

**Problem Description:**
- Google Sheets contains many calculated columns using formulas (e.g., `=IF(A1>100, "High", "Low")`)
- When using Google Sheets API, formula cells return `null` or empty values instead of the calculated result
- This breaks the entire data pipeline

**Example:**
```
Sheet Cell: =CONCATENATE(A1, " - ", B1)
Display Value: "Restaurant ABC - Mumbai"
API Returns: null or ""
```

### Questions for Developer

1. **Root Cause:**
   - Why does Google Sheets API return null for formula-generated values?
   - Is this a known limitation or a configuration issue?

2. **Solutions:**
   - What's the best approach to read formula results from Google Sheets API?
   - Should we use `valueRenderOption: 'FORMATTED_VALUE'` vs `'UNFORMATTED_VALUE'`?
   - Are there alternative APIs or methods?

3. **Implementation:**
   - What's the recommended Google Sheets API client for Node.js/TypeScript?
   - How to handle authentication (Service Account vs OAuth)?
   - Rate limits and quota considerations?

4. **Data Sync Strategy:**
   - Real-time polling vs webhook-based updates?
   - How to detect changes in Google Sheets?
   - Caching strategy to minimize API calls?

5. **Error Handling:**
   - What happens if Google Sheets is temporarily unavailable?
   - How to handle partial data failures?
   - Fallback mechanisms?

---

## 🚀 PROBLEM #2: Scalability & Performance

### Current Scale
- **Restaurants:** 5,500+
- **Users:** 50+ KAMs
- **Data Points:** 200+ columns × 5,500 rows = 1.1M+ data points
- **Update Frequency:** Daily (currently manual)

### Performance Concerns

1. **Database Query Performance**
   - Current: Fetching all 200+ columns for all restaurants
   - Question: Should we implement pagination, lazy loading, or column selection?

2. **Frontend Rendering**
   - Rendering 5,500 restaurant cards in KAM Hub
   - Question: Virtual scrolling? Infinite scroll? Server-side pagination?

3. **Data Transfer**
   - Transferring 1.1M+ data points on initial load
   - Question: Optimize payload size? Compression? GraphQL?

4. **Real-time Updates**
   - Multiple KAMs updating data simultaneously
   - Question: Optimistic updates? WebSocket? Polling?

5. **Concurrent Users**
   - 50+ KAMs accessing system simultaneously
   - Question: Connection pooling? Caching strategy? CDN?

### Questions for Developer

1. **Database Optimization:**
   - Should we denormalize further or normalize the schema?
   - Indexing strategy for 200+ columns?
   - Partitioning by KAM or region?

2. **API Design:**
   - RESTful pagination vs GraphQL?
   - Recommended page size for 5,500 records?
   - Filtering and sorting strategy?

3. **Caching:**
   - Where to cache: Browser? CDN? Redis? Supabase?
   - Cache invalidation strategy?
   - Stale-while-revalidate pattern?

4. **Frontend Performance:**
   - React Query configuration for large datasets?
   - Component-level code splitting?
   - Memoization strategies?

5. **Monitoring:**
   - What metrics to track?
   - Performance monitoring tools?
   - Error tracking and logging?

---

## 📊 CURRENT PERFORMANCE BASELINE

### Sprint 1 Metrics (1 Restaurant)
- **Database Query Time:** <100ms
- **Frontend Render Time:** <50ms
- **Total Page Load:** <500ms
- **Bundle Size:** ~500KB (gzipped)

### Projected Sprint 2 Metrics (5,500 Restaurants)
- **Database Query Time:** ??? (need estimation)
- **Data Transfer Size:** ??? (need calculation)
- **Frontend Render Time:** ??? (need testing)
- **Memory Usage:** ??? (need profiling)

---

## 💡 PROPOSED SOLUTIONS (For Discussion)

### Google Sheets Integration Options

**Option A: Google Sheets API with Proper Configuration**
```javascript
// Using valueRenderOption to get calculated values
const response = await sheets.spreadsheets.values.get({
  spreadsheetId: 'xxx',
  range: 'Sheet1!A1:Z1000',
  valueRenderOption: 'FORMATTED_VALUE', // Returns formula results
  dateTimeRenderOption: 'FORMATTED_STRING'
});
```
- **Pros:** Direct integration, real-time data
- **Cons:** API rate limits, complex error handling
- **Questions:** Is this the right approach? What are the gotchas?

**Option B: Google Apps Script + Webhook**
```javascript
// Apps Script pushes data to our API when sheet changes
function onEdit(e) {
  const data = getSheetData();
  UrlFetchApp.fetch('https://our-api.com/webhook', {
    method: 'POST',
    payload: JSON.stringify(data)
  });
}
```
- **Pros:** Push-based, no polling, formula values included
- **Cons:** Requires Apps Script setup, webhook infrastructure
- **Questions:** Is this more reliable? How to handle failures?

**Option C: Hybrid Approach (CSV Export + Scheduled Sync)**
```javascript
// Keep current CSV approach but automate it
// Google Apps Script exports CSV to Google Drive
// Backend service polls Drive and imports automatically
```
- **Pros:** Proven to work, simpler error handling
- **Cons:** Not real-time, still requires export step
- **Questions:** Is this acceptable for business needs?

### Scalability Solutions

**Option A: Pagination + Virtual Scrolling**
```typescript
// Backend: Paginated API
GET /api/restaurants?page=1&limit=50&kam_email=xxx

// Frontend: React Virtual + Infinite Scroll
import { useVirtualizer } from '@tanstack/react-virtual';
```
- **Pros:** Proven pattern, good UX
- **Cons:** Complex state management
- **Questions:** Recommended page size? Prefetching strategy?

**Option B: Server-Side Filtering + Client-Side Cache**
```typescript
// Backend: Filter at database level
SELECT * FROM drive_sheets_data
WHERE am_email = 'xxx'
LIMIT 100;

// Frontend: Aggressive caching with React Query
queryClient.setDefaultOptions({
  queries: { staleTime: 5 * 60 * 1000 } // 5 min
});
```
- **Pros:** Reduced data transfer, faster queries
- **Cons:** Stale data risk
- **Questions:** Optimal cache duration? Invalidation triggers?

**Option C: GraphQL + Field Selection**
```graphql
query GetRestaurants($kamEmail: String!) {
  restaurants(where: { kam_email: { _eq: $kamEmail } }) {
    res_id
    res_name
    locality
    # Only fetch needed fields
  }
}
```
- **Pros:** Flexible, optimized payloads
- **Cons:** Learning curve, infrastructure change
- **Questions:** Worth the migration effort?

---

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### Current Database Schema (Simplified)

```sql
CREATE TABLE drive_sheets_data (
  -- Basic Info
  res_id TEXT PRIMARY KEY,
  res_name TEXT,
  am_email TEXT NOT NULL,
  locality TEXT,
  cuisine TEXT,

  -- NCN Data (~100 columns)
  ncn_p1 TEXT,
  ncn_p2 TEXT,
  ncn_la_step1 TEXT,
  ncn_la_step2 TEXT,
  -- ... 96 more NCN columns

  -- N2R Data (~50 columns)
  n2r_la_current_aov TEXT,
  n2r_la_suggested_mov TEXT,
  -- ... 48 more N2R columns

  -- Items Data (~50 columns)
  items_priority TEXT,
  items_dish_tag_1 TEXT,
  -- ... 48 more Items columns

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_am_email ON drive_sheets_data(am_email);
CREATE INDEX idx_res_id ON drive_sheets_data(res_id);
```

### Current React Query Implementation

```typescript
// src/hooks/useDriveSheets.ts
export function useDriveSheets() {
  return useQuery({
    queryKey: ["drive_sheets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .select("*") // ⚠️ Fetches ALL 200+ columns
        .order("res_name", { ascending: true });

      if (error) throw error;
      return data as DriveSheetData[];
    },
  });
}
```

**Question:** Should we implement field selection here?

### Current Import Script (Python)

```python
# scripts/import_drive_data_single.py
def load_ncn_data(res_id):
    df = pd.read_csv(NCN_CSV, skiprows=2)
    restaurant = df[df['res_id'].astype(str) == res_id]
    # Maps 100+ CSV columns to database columns
    return data

def upload_to_supabase(data):
    supabase.table('drive_sheets_data').upsert(data).execute()
```

**Question:** How to adapt this for Google Sheets API?

---

## 📝 SPECIFIC QUESTIONS FOR DEVELOPER

### Google Sheets Integration

1. **Formula Handling:**
   - What's the definitive way to read formula results via API?
   - Have you encountered this issue before? How did you solve it?

2. **API Client:**
   - Recommend: `googleapis` npm package? Or alternative?
   - Service Account vs OAuth for backend access?

3. **Rate Limits:**
   - Google Sheets API: 100 requests/100 seconds/user
   - How to handle 3 sheets × 5,500 rows within limits?
   - Batch requests? Caching strategy?

4. **Data Validation:**
   - How to ensure data integrity when reading from Sheets?
   - Type coercion (strings vs numbers)?
   - Handling empty cells vs null vs undefined?

5. **Error Recovery:**
   - What if API call fails mid-import?
   - Retry logic? Exponential backoff?
   - Partial import handling?

### Scalability & Performance

1. **Database:**
   - Is 200+ columns in a single table a red flag?
   - Should we normalize (separate tables for NCN, N2R, Items)?
   - Indexing strategy for text columns?

2. **Query Optimization:**
   - Should we use database views for common queries?
   - Materialized views for aggregations?
   - Full-text search for restaurant names?

3. **Frontend:**
   - React Query: Recommended `staleTime` and `cacheTime`?
   - Should we implement optimistic updates?
   - Prefetching strategy for detail pages?

4. **Infrastructure:**
   - Supabase free tier limits: 500MB database, 2GB bandwidth
   - When to upgrade? What tier?
   - Alternative: Self-hosted PostgreSQL?

5. **Monitoring:**
   - What should we monitor in production?
   - Recommended tools: Sentry? LogRocket? Datadog?
   - Performance budgets?

---

## 🎯 DESIRED OUTCOMES FROM MEETING

1. **Clear recommendation** on Google Sheets integration approach
2. **Step-by-step plan** to implement formula value reading
3. **Scalability roadmap** with specific optimizations
4. **Performance benchmarks** to aim for
5. **Risk assessment** of proposed solutions
6. **Timeline estimate** for implementation

---

## 📚 REFERENCE MATERIALS TO SHARE

### Documentation Files
- `DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md` - Full implementation details
- `SPRINT-1-COMPLETION-REPORT.md` - Current status and metrics
- `IMPORTANT-NOTES.md` - Known issues and limitations
- `supabase/drive_sheets_data_schema.sql` - Complete database schema

### Code Files
- `src/hooks/useDriveSheets.ts` - Data fetching layer
- `src/pages/RestaurantDetail.tsx` - Main UI component
- `scripts/import_drive_data_single.py` - Current import logic

### Live Demo
- **URL:** [Your deployed URL or localhost]
- **Test Account:** gupta.ansh@zomato.com / 1234
- **Test Restaurant:** 6503620 (Kanha Veg)

---

## ⏰ MEETING STRUCTURE

### Part 1: Context Setting (10 min)
- Quick demo of current system
- Show data flow diagram
- Explain business requirements

### Part 2: Google Sheets Problem (20 min)
- Demonstrate the formula issue
- Discuss potential solutions
- Get recommendation

### Part 3: Scalability Discussion (20 min)
- Review current architecture
- Identify bottlenecks
- Plan optimizations

### Part 4: Action Items (10 min)
- Summarize recommendations
- Define next steps
- Set follow-up timeline

---

## 🚀 POST-MEETING ACTION ITEMS

- [ ] Document developer's recommendations
- [ ] Create implementation plan for Google Sheets integration
- [ ] Create scalability optimization roadmap
- [ ] Update technical documentation
- [ ] Schedule follow-up if needed

---

**Prepared by:** AI Assistant
**Last Updated:** 2025-11-15
**Version:** 1.0



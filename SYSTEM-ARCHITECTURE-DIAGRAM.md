# 🏗️ System Architecture - Visual Reference

**Purpose:** Visual diagrams for developer meeting  
**Date:** 2025-11-15

---

## 📊 CURRENT ARCHITECTURE (As-Is)

```
┌─────────────────────────────────────────────────────────────────┐
│                        GOOGLE SHEETS                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  NCN Codes   │  │  N2R Codes   │  │ Items ≤159   │          │
│  │  (~100 cols) │  │  (~50 cols)  │  │  (~50 cols)  │          │
│  │  5,500 rows  │  │  5,500 rows  │  │  5,500 rows  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ MANUAL CSV EXPORT
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOCAL CSV FILES                             │
│  NCN-codes.csv  │  N2R-Codes.csv  │  Items-159LL.csv           │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Python Script (import_drive_data_single.py)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRESQL                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Table: drive_sheets_data                          │  │
│  │  - res_id (PK)                                            │  │
│  │  - 200+ columns (NCN + N2R + Items merged)               │  │
│  │  - 5,500 rows (one per restaurant)                       │  │
│  │  - Indexes: res_id, am_email                             │  │
│  │  - RLS: Currently DISABLED                               │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Supabase Client (@supabase/supabase-js)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT QUERY LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  useDriveSheets() - Fetch all restaurants                │  │
│  │  useDriveSheet(id) - Fetch single restaurant             │  │
│  │  - Caching, refetching, error handling                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ React Components
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND UI                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   KAM Hub    │  │  Restaurant  │  │     KAM      │          │
│  │  (List View) │  │    Detail    │  │  Analytics   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 DESIRED ARCHITECTURE (To-Be)

```
┌─────────────────────────────────────────────────────────────────┐
│                        GOOGLE SHEETS                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  NCN Codes   │  │  N2R Codes   │  │ Items ≤159   │          │
│  │  (~100 cols) │  │  (~50 cols)  │  │  (~50 cols)  │          │
│  │  5,500 rows  │  │  5,500 rows  │  │  5,500 rows  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ GOOGLE SHEETS API (Real-time)
                            │ - valueRenderOption: FORMATTED_VALUE
                            │ - Batch requests for performance
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SYNC SERVICE                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  - Scheduled sync (every 1 hour? 6 hours?)               │  │
│  │  - Webhook listener (if using Apps Script)               │  │
│  │  - Data validation & transformation                      │  │
│  │  - Error handling & retry logic                          │  │
│  │  - Change detection (only update modified rows)          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Upsert to Database
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRESQL                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Table: drive_sheets_data                          │  │
│  │  - Optimized schema (normalized or denormalized?)        │  │
│  │  - Proper indexes for performance                        │  │
│  │  - RLS enabled for security                              │  │
│  │  - Audit columns (last_synced_at, sync_status)           │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Cache Layer (Redis? Supabase Realtime?)           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Optimized Queries (Pagination, Field Selection)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT QUERY LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  - Paginated queries (50-100 items per page)             │  │
│  │  - Infinite scroll support                               │  │
│  │  - Optimistic updates                                    │  │
│  │  - Smart caching (5-10 min staleTime)                    │  │
│  │  - Prefetching for better UX                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Virtual Scrolling
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND UI                                 │
│  - Virtual scrolling for large lists                             │
│  - Code splitting for faster initial load                        │
│  - Progressive loading of data                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA SYNC STRATEGIES (Options)

### Option A: Polling (Simple)
```
┌──────────┐     Every N minutes      ┌──────────────┐
│  Backend │ ───────────────────────> │ Google Sheets│
│  Service │ <─────────────────────── │     API      │
└──────────┘     Fetch all data       └──────────────┘
      │
      │ Upsert changed rows
      ▼
┌──────────┐
│ Database │
└──────────┘
```
**Pros:** Simple, reliable  
**Cons:** Not real-time, API quota usage

### Option B: Webhook (Event-driven)
```
┌──────────────┐     onEdit trigger     ┌──────────┐
│ Google Sheets│ ───────────────────────>│  Apps    │
│              │                         │  Script  │
└──────────────┘                         └──────────┘
                                              │
                                              │ HTTP POST
                                              ▼
                                         ┌──────────┐
                                         │  Backend │
                                         │  Webhook │
                                         └──────────┘
                                              │
                                              ▼
                                         ┌──────────┐
                                         │ Database │
                                         └──────────┘
```
**Pros:** Real-time, efficient  
**Cons:** Complex setup, webhook reliability

### Option C: Hybrid (Best of both)
```
┌──────────────┐
│ Google Sheets│
└──────────────┘
      │
      ├─────> Webhook (for immediate updates)
      │
      └─────> Scheduled Sync (for reliability, every 6 hours)
                  │
                  ▼
             ┌──────────┐
             │ Database │
             └──────────┘
```
**Pros:** Real-time + reliable  
**Cons:** More complex

---

## 📈 SCALABILITY BOTTLENECKS

### Current Bottleneck #1: Database Query
```
SELECT * FROM drive_sheets_data;
↓
Returns: 5,500 rows × 200 columns = 1.1M data points
↓
Transfer size: ~50-100 MB (uncompressed)
↓
Frontend memory: High
```

**Solution:**
```
SELECT res_id, res_name, locality, cuisine 
FROM drive_sheets_data 
WHERE am_email = 'current_user@zomato.com'
LIMIT 50 OFFSET 0;
↓
Returns: 50 rows × 4 columns = 200 data points
↓
Transfer size: ~10 KB
↓
Frontend memory: Low
```

### Current Bottleneck #2: Frontend Rendering
```
5,500 restaurant cards rendered at once
↓
DOM nodes: 5,500 × ~20 = 110,000 nodes
↓
Memory: High, Scroll: Janky
```

**Solution:**
```
Virtual scrolling: Only render visible items
↓
DOM nodes: ~20 visible × 20 = 400 nodes
↓
Memory: Low, Scroll: Smooth
```

---

## 🎯 PERFORMANCE TARGETS

### Current (1 Restaurant)
- Initial Load: <500ms
- Query Time: <100ms
- Render Time: <50ms

### Target (5,500 Restaurants)
- Initial Load: <2s
- Query Time: <200ms
- Render Time: <100ms
- Scroll FPS: 60fps
- Memory Usage: <200MB

---

## 🔐 SECURITY CONSIDERATIONS

### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE drive_sheets_data ENABLE ROW LEVEL SECURITY;

-- Policy: KAMs can only see their own restaurants
CREATE POLICY kam_access ON drive_sheets_data
  FOR SELECT
  USING (am_email = auth.jwt() ->> 'email');
```

### API Rate Limiting
```
Google Sheets API Limits:
- 100 requests per 100 seconds per user
- 500 requests per 100 seconds per project

Strategy:
- Batch requests (combine multiple ranges)
- Cache aggressively
- Use exponential backoff
```



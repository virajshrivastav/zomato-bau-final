# ❓ My Questions for the Developer

**Date:** 2025-11-15  
**Purpose:** Personal list of doubts and clarifications needed

---

## 🔴 CRITICAL QUESTIONS

### 1. Google Sheets Formula Problem

**Background:**
Our Google Sheets have many columns with formulas like:
- `=CONCATENATE(A1, " off at mov ", B1)` → Shows "100 off at mov 249"
- `=IF(C1>100, "High", "Low")` → Shows "High"
- `=VLOOKUP(...)` → Shows calculated values

**The Problem:**
When we try to read these cells using Google Sheets API, we get `null` or empty values instead of the calculated results.

**My Questions:**
1. **Why does this happen?** Is it because we're reading the formula instead of the result?
2. **What's the fix?** Is there a specific API parameter we need to use?
3. **Is this a common issue?** Have you encountered this before?
4. **Alternative approaches?** Should we avoid formulas in source sheets?
5. **Data validation:** How do we ensure we're getting the right data type (string vs number)?

---

### 2. Real-Time Data Sync from Google Sheets

**Current Workflow:**
1. Data team updates Google Sheets daily
2. We manually export 3 CSV files
3. Run Python script to import to database
4. Dashboard shows updated data

**Desired Workflow:**
1. Data team updates Google Sheets
2. System automatically detects changes
3. Database updates automatically
4. Dashboard shows updated data (real-time or near real-time)

**My Questions:**
1. **Best approach?** Polling vs Webhooks vs Hybrid?
2. **How often to sync?** Every hour? Every 6 hours? On-demand?
3. **Change detection:** How to know which rows changed (to avoid re-importing everything)?
4. **Error handling:** What if sync fails? How to retry? How to alert us?
5. **Data consistency:** How to ensure data integrity during sync?
6. **Cost implications:** API quota limits, infrastructure costs?

---

### 3. Handling Large Data Volumes

**Current State:**
- 1 restaurant: Works perfectly, loads in <500ms
- Database query: <100ms
- Frontend render: <50ms

**Target State:**
- 5,500 restaurants: Need to maintain good performance
- 50+ KAMs using simultaneously
- Each KAM sees 100-200 restaurants on average

**My Questions:**
1. **Database design:** Is our current flat table (200+ columns) a problem?
   - Should we normalize (separate tables for NCN, N2R, Items)?
   - Or keep denormalized for query simplicity?
   - What are the trade-offs?

2. **Query optimization:**
   - Should we fetch all 200+ columns or only what's needed?
   - How to implement pagination? What page size?
   - Should we use database views or materialized views?
   - Indexing strategy for 200+ columns?

3. **Frontend performance:**
   - How to render 5,500 items without freezing the browser?
   - Virtual scrolling? Infinite scroll? Server-side pagination?
   - What library do you recommend?
   - How to handle search/filter with large datasets?

4. **Caching strategy:**
   - Where to cache: Browser? Server? Database?
   - How long to cache? 5 min? 1 hour?
   - How to invalidate cache when data changes?
   - React Query settings: `staleTime`, `cacheTime`?

5. **Concurrent users:**
   - 50 KAMs accessing simultaneously - any concerns?
   - Database connection pooling?
   - Rate limiting needed?

---

## 🟡 IMPORTANT QUESTIONS

### 4. Google Sheets API Implementation

**My Questions:**
1. **Which library?** `googleapis` npm package? Or something else?
2. **Authentication:** Service Account vs OAuth 2.0?
   - Service Account: For backend-only access?
   - OAuth: For user-specific access?
   - Which is better for our use case?

3. **Rate limits:**
   - Google Sheets API: 100 requests per 100 seconds per user
   - We have 3 sheets × 5,500 rows
   - How to stay within limits?
   - Batch requests? How many rows per request?

4. **Error handling:**
   - What errors to expect?
   - Retry logic? Exponential backoff?
   - How to handle partial failures?

5. **Data transformation:**
   - Google Sheets returns arrays of arrays
   - How to map to our database schema?
   - Type conversion (string to number, date parsing)?

---

### 5. Database Schema Optimization

**Current Schema:**
```sql
CREATE TABLE drive_sheets_data (
  res_id TEXT PRIMARY KEY,
  res_name TEXT,
  am_email TEXT,
  -- ... 197 more columns
);
```

**My Questions:**
1. **Is this acceptable?** Or is 200+ columns a red flag?
2. **Normalization:** Should we split into:
   ```sql
   restaurants (basic info)
   ncn_data (NCN columns)
   n2r_data (N2R columns)
   items_data (Items columns)
   ```
   - Pros/cons of normalization?
   - Impact on query performance?

3. **Data types:** Currently all TEXT - should we use proper types?
   - Numbers as INTEGER/NUMERIC?
   - Dates as TIMESTAMP?
   - Trade-offs?

4. **Indexes:** Currently only on `res_id` and `am_email`
   - Should we add more?
   - Which columns to index?
   - Impact on write performance?

5. **Row Level Security (RLS):**
   - Currently disabled for testing
   - How to properly implement?
   - Performance impact?

---

### 6. Frontend Architecture

**My Questions:**
1. **State management:** Is React Query enough? Or need Redux/Zustand?
2. **Code splitting:** How to optimize bundle size?
3. **Lazy loading:** Which components to lazy load?
4. **Memoization:** Where to use `useMemo` and `useCallback`?
5. **Performance monitoring:** What tools to use? How to measure?

---

## 🟢 NICE-TO-HAVE QUESTIONS

### 7. Future Scalability

**My Questions:**
1. **Growth projection:** What if we go from 5,500 to 50,000 restaurants?
2. **Infrastructure:** When to move from Supabase to self-hosted?
3. **Microservices:** Should we split into separate services?
4. **CDN:** Do we need a CDN for static assets?
5. **Monitoring:** What metrics to track in production?

---

### 8. Best Practices

**My Questions:**
1. **Error tracking:** Sentry? LogRocket? Other?
2. **Logging:** What to log? Where to store logs?
3. **Testing:** Unit tests? Integration tests? E2E tests?
4. **CI/CD:** Deployment pipeline recommendations?
5. **Documentation:** What to document for future developers?

---

### 9. Security

**My Questions:**
1. **API keys:** How to securely store Google Sheets API credentials?
2. **Environment variables:** Best practices for secrets management?
3. **SQL injection:** Are we vulnerable with Supabase client?
4. **XSS protection:** Any concerns with our current setup?
5. **CORS:** Do we need to configure anything?

---

### 10. Cost Optimization

**My Questions:**
1. **Supabase pricing:** When do we hit free tier limits?
   - Database: 500MB limit
   - Bandwidth: 2GB/month limit
   - API requests: Unlimited?

2. **Google Sheets API:** Any costs?
3. **Hosting:** Vercel free tier sufficient?
4. **Estimated monthly cost** for production with 50 users?

---

## 📊 SPECIFIC SCENARIOS TO DISCUSS

### Scenario 1: Data Sync Failure
**What happens if:**
- Google Sheets API is down?
- Network fails mid-sync?
- Database is temporarily unavailable?

**How to handle:**
- Retry logic?
- Fallback to cached data?
- Alert system?

---

### Scenario 2: Concurrent Updates
**What happens if:**
- KAM updates restaurant data in dashboard
- At same time, Google Sheets sync runs
- Conflict between user update and sync

**How to handle:**
- Last-write-wins?
- Merge strategies?
- Lock mechanisms?

---

### Scenario 3: Performance Degradation
**What happens if:**
- Page load time increases to 5+ seconds
- Database queries slow down
- Frontend becomes unresponsive

**How to detect:**
- Monitoring tools?
- Performance budgets?
- Alerting thresholds?

**How to fix:**
- Quick wins?
- Long-term solutions?

---

## 🎯 PRIORITIZED QUESTION LIST

### Must Answer Today:
1. ✅ Google Sheets formula reading solution
2. ✅ Data sync strategy (polling vs webhook)
3. ✅ Pagination approach for 5,500 restaurants
4. ✅ Database schema validation (200+ columns OK?)
5. ✅ Frontend rendering strategy (virtual scroll?)

### Can Follow Up Later:
6. ⏳ Detailed caching strategy
7. ⏳ Error handling patterns
8. ⏳ Monitoring and alerting setup
9. ⏳ Cost optimization
10. ⏳ Security hardening

---

## 📝 NOTES DURING MEETING

**Question 1 - Google Sheets Formulas:**
Answer:
- 
- 

**Question 2 - Data Sync:**
Answer:
- 
- 

**Question 3 - Scalability:**
Answer:
- 
- 

**Additional Insights:**
- 
- 
- 

**Action Items for Me:**
- [ ] 
- [ ] 
- [ ] 

---

**Prepared by:** Me  
**Last Updated:** 2025-11-15


# Performance Metrics - Final Decisions Summary

**Date:** 2025-11-15  
**Status:** ✅ All Decisions Confirmed - Ready to Implement  

---

## 🎯 CONFIRMED DECISIONS

### 1. Strategize Button ✅
**Decision:** Keep in UI as placeholder, non-functional for now

**Implementation:**
- Button will be visible in the UI
- No functionality for MVP
- Will be implemented later based on requirements

**Code:**
```typescript
<Button onClick={() => {
  console.log("Strategize - coming soon");
}}>
  <Target className="w-4 h-4 mr-2" />
  Strategize Now
</Button>
```

**Effort:** 0 hours (just placeholder)

---

### 2. Charts & Visualizations ✅
**Decision:** Implement all drives with best visualizations

**Chart Types by Drive:**

**NCN Drive:**
- **Bar Chart:** Stepper vs Base coverage comparison
  - 3 groups: LA, MM, UM
  - 2 bars per group: Base (blue), Stepper (green)
  - Y-axis: Coverage percentage
  - Show delta indicators (▲, ▼)

- **Horizontal Bar Chart:** Other metrics
  - Flash Sale Coverage
  - BOGO OV Coverage
  - Overall OV Coverage
  - Overall Res Coverage

**N2R Drive:**
- **Bar Chart:** Conversion rates comparison
  - 3 bars: LA OV Conversion, MM OV Conversion, UM OV Conversion
  - Color-coded by performance (green > 50%, yellow 30-50%, red < 30%)

**Items Drive:**
- **Line Chart:** Weekly trends (2 charts)
  - Chart 1: OV Coverage trend (Baseline → W41 → W42 → W43 → W44)
  - Chart 2: Items Count trend (Baseline → W41 → W42 → W43 → W44)
  - Show delta and WoW changes
  - Highlight positive/negative trends

**Library:** Recharts (already in project)

**Effort:** 3-6 hours

---

### 3. Access Control ✅
**Decision:** KAM-only access, filter by logged-in email

**Implementation:**
- Each KAM sees only their own metrics
- Filter all queries by `kam_email` field
- No role-based access for MVP
- Zonal Head view is a separate feature (not in this implementation)

**Code:**
```typescript
const { user } = useAuth();
const kamEmail = user?.email || "";

// Hooks automatically filter by email
const { data: ncn } = useNCNSummary(kamEmail);
const { data: n2r } = useN2RSummary(kamEmail);
const { data: items } = useItemsSummary(kamEmail);
```

**Database Queries:**
```sql
SELECT * FROM ncn_summary WHERE kam_email = 'logged_in_kam@zomato.com';
SELECT * FROM n2r_summary WHERE kam_email = 'logged_in_kam@zomato.com';
SELECT * FROM items_summary WHERE kam_email = 'logged_in_kam@zomato.com';
```

**Effort:** 0 hours (already planned)

---

### 4. Update Frequency ✅
**Decision:** Daily CSV updates, manual import

**Process:**
1. User replaces CSV files in `performance-metrics/` folder
2. User runs import script: `python scripts/import_performance_metrics.py`
3. Script generates SQL files
4. User executes SQL via Supabase CLI or dashboard
5. Data refreshes in database
6. Frontend automatically shows updated data (React Query cache)

**No automation needed** - Manual process is sufficient for daily updates

**Effort:** 0 hours (already planned)

---

### 5. Zonal Head View ✅
**Decision:** Separate feature, not in MVP

**Rationale:**
- Zonal Head view requires different data aggregation
- Different UI/UX requirements
- Will be a separate page/feature
- Not part of Performance Metrics MVP

**Future Implementation:**
- Separate page: `/zonal-head-analytics`
- Aggregated team metrics
- Individual KAM breakdowns
- Team leaderboards

**Effort:** 0 hours (out of scope for MVP)

---

## 📊 UPDATED IMPLEMENTATION SCOPE

### MVP Includes:
- ✅ 3 database tables (ncn_summary, n2r_summary, items_summary)
- ✅ Import script for CSV data
- ✅ React hooks for data fetching
- ✅ KAM-specific filtering
- ✅ **Charts for all 3 drives** (NEW)
- ✅ Strategize button placeholder
- ✅ Loading/error states
- ✅ Responsive design

### MVP Excludes:
- ❌ Strategize button functionality (placeholder only)
- ❌ Zonal Head aggregated view (separate feature)
- ❌ Export functionality
- ❌ Advanced filtering/sorting

---

## ⏱️ UPDATED TIME ESTIMATES

| Phase | Task | Original | Updated | Reason |
|-------|------|----------|---------|--------|
| **Phase 1** | Database Setup | 1-2h | 1-2h | No change |
| **Phase 2** | Data Import | 2-3h | 2-3h | No change |
| **Phase 3** | Frontend (Basic) | 2-3h | 3-4h | Added charts |
| **Phase 3.5** | Charts Implementation | - | 2-3h | NEW |
| **Phase 4** | Testing | 1h | 1-2h | Test charts |
| **Total** | | **4-6h** | **6-8h** | +2h for charts |

---

## 🎨 UI COMPONENTS BREAKDOWN

### NCN Drive Section
```
┌─────────────────────────────────────────────────────┐
│ NCN Drive Performance                               │
├─────────────────────────────────────────────────────┤
│ [Stepper/Base Coverage Cards] (3 cards: LA, MM, UM)│
│ [Other Metrics Cards] (4 cards)                     │
│                                                     │
│ [Bar Chart: Stepper vs Base Comparison]            │
│ [Horizontal Bar: Other Metrics]                     │
└─────────────────────────────────────────────────────┘
```

### N2R Drive Section
```
┌─────────────────────────────────────────────────────┐
│ N2R Drive Performance                               │
├─────────────────────────────────────────────────────┤
│ [Conversion Cards] (3 cards: LA, MM, UM)           │
│                                                     │
│ [Bar Chart: Conversion Comparison]                  │
└─────────────────────────────────────────────────────┘
```

### Items Drive Section
```
┌─────────────────────────────────────────────────────┐
│ Items Drive Performance                             │
├─────────────────────────────────────────────────────┤
│ [Weekly Trend Table] (OV Coverage + Items Count)   │
│                                                     │
│ [Line Chart: OV Coverage Trend]                     │
│ [Line Chart: Items Count Trend]                     │
└─────────────────────────────────────────────────────┘
```

### Strategize Button
```
┌─────────────────────────────────────────────────────┐
│ [🎯 Strategize Now] (Placeholder - non-functional) │
└─────────────────────────────────────────────────────┘
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup (1-2 hours)
- [ ] Create `supabase/performance_metrics_schema.sql`
- [ ] Execute schema in Supabase
- [ ] Verify 3 tables created

### Phase 2: Data Import (2-3 hours)
- [ ] Create `scripts/import_performance_metrics.py`
- [ ] Parse 3 CSV files
- [ ] Generate SQL statements
- [ ] Execute import
- [ ] Verify data (252 rows total)

### Phase 3: Frontend - Basic (3-4 hours)
- [ ] Create `src/types/performanceMetrics.ts`
- [ ] Create `src/hooks/usePerformanceMetrics.ts`
- [ ] Update `src/pages/KAMAnalytics.tsx`
- [ ] Implement NCN section (cards)
- [ ] Implement N2R section (cards)
- [ ] Implement Items section (table)
- [ ] Add Strategize button (placeholder)
- [ ] Add loading/error states

### Phase 3.5: Charts Implementation (2-3 hours)
- [ ] Install/verify Recharts library
- [ ] Create NCN bar chart (Stepper vs Base)
- [ ] Create NCN horizontal bar chart (Other metrics)
- [ ] Create N2R bar chart (Conversions)
- [ ] Create Items line chart (OV Coverage trend)
- [ ] Create Items line chart (Items Count trend)
- [ ] Add chart tooltips and legends
- [ ] Make charts responsive

### Phase 4: Testing (1-2 hours)
- [ ] Test with multiple KAM emails
- [ ] Verify data accuracy
- [ ] Test charts interactivity
- [ ] Test responsive design
- [ ] Test loading/error states

---

## ✅ SUCCESS CRITERIA

### MVP Complete When:
- [x] All decisions confirmed
- [ ] 3 database tables created
- [ ] 252 rows imported
- [ ] React hooks working
- [ ] KAMAnalytics page displays data
- [ ] **All 3 drives have charts**
- [ ] Strategize button visible (placeholder)
- [ ] Data filtered by KAM email
- [ ] Loading/error states work
- [ ] Responsive design verified
- [ ] No critical bugs

---

## 🚀 READY TO PROCEED

**All decisions confirmed!** You can now:

1. **Start Implementation** - Follow `PERFORMANCE-METRICS-QUICK-START.md`
2. **Track Progress** - Use `PERFORMANCE-METRICS-CHECKLIST.md`
3. **Reference Specs** - Check `PERFORMANCE-METRICS-TECHNICAL-SPEC.md`

**Estimated Total Time:** 6-8 hours

---

**Last Updated:** 2025-11-15  
**Status:** ✅ Ready to Implement

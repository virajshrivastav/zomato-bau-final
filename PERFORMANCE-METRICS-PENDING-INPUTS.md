# Performance Metrics - Pending User Inputs

**Status:** ⏸️ Awaiting Decisions  
**Last Updated:** 2025-11-15  
**Priority:** Medium (Can be added after MVP)  

---

## 🎯 OVERVIEW

This document tracks all features and decisions that are **deferred** and awaiting user input. These are placeholders in the current implementation that can be enhanced later.

---

## 📋 PENDING DECISIONS

### 1. Strategize Button Functionality ✅

**Status:** ✅ **DECISION MADE** - Hold for now, non-functional placeholder

**Decision:**
- Keep button in UI
- No functionality for now
- Will be implemented later

**Current Implementation:**
```typescript
<Button onClick={() => {
  // Placeholder - functionality to be added later
  console.log("Strategize button - coming soon");
}}>
  <Target className="w-4 h-4 mr-2" />
  Strategize Now
</Button>
```

**Future Work:**
- [ ] Define strategize functionality requirements
- [ ] Design UI/UX for strategize feature
- [ ] Implement when ready

**Example Options:**

**Option A: Modal with Recommendations**
```typescript
const [showStrategize, setShowStrategize] = useState(false);

<Button onClick={() => setShowStrategize(true)}>
  Strategize Now
</Button>

<StrategizeModal 
  open={showStrategize}
  onClose={() => setShowStrategize(false)}
  ncnData={ncn}
  n2rData={n2r}
  itemsData={items}
/>
```

**Option B: Navigate to Strategy Page**
```typescript
<Button onClick={() => navigate('/strategy')}>
  Strategize Now
</Button>
```

**Option C: Export Report**
```typescript
<Button onClick={() => exportPerformanceReport(ncn, n2r, items)}>
  Strategize Now
</Button>
```

**Decision Needed By:** Before Phase 4  
**Impact:** Medium (UI enhancement)  
**Effort:** 2-4 hours depending on complexity  

---

### 2. Charts & Visualizations ✅

**Status:** ✅ **DECISION MADE** - Implement all drives data with best visualizations

**Decision:**
- All drives data is important
- Use any chart type that works best
- Focus on clear data visualization
- Implement during MVP (not deferred)

**Recommended Approach:**

**NCN Drive Charts:**
- Bar chart for Stepper vs Base coverage comparison (LA, MM, UM)
- Horizontal bar chart for overall metrics (Flash Sale, BOGO, Overall OV/Res)

**N2R Drive Charts:**
- Bar chart comparing LA, MM, UM conversion rates
- Simple and clear comparison

**Items Drive Charts:**
- Line chart for weekly trends (Baseline → Week 44)
- Show both OV Coverage and Items Count trends
- Highlight delta and WoW changes

**Implementation Priority:**
1. NCN coverage comparison (most important)
2. Items weekly trends (shows progress)
3. N2R conversion comparison

1. **Which chart types are most important?**
   - [ ] Bar charts (compare metrics)
   - [ ] Pie charts (show distribution)
   - [ ] Line charts (show trends over time)
   - [ ] Area charts (cumulative performance)
   - [ ] Combo charts (multiple metrics)
   - [ ] Other: _______________

2. **What data should be visualized?**
   - [ ] NCN coverage breakdown (LA/MM/UM)
   - [ ] N2R conversion rates comparison
   - [ ] Items weekly trends (Week 41-44)
   - [ ] Overall drive performance comparison
   - [ ] Team benchmarking
   - [ ] Other: _______________

3. **Priority order?** (Rank 1-5)
   - [ ] NCN metrics visualization
   - [ ] N2R metrics visualization
   - [ ] Items weekly trends
   - [ ] Drive comparison
   - [ ] Team comparison

4. **Interactive features?**
   - [ ] Hover tooltips
   - [ ] Click to drill down
   - [ ] Filter by date range
   - [ ] Export chart as image
   - [ ] Other: _______________

**Example Chart Options:**

**Option A: NCN Coverage Bar Chart**
```typescript
<BarChart data={[
  { name: 'LA Base', value: parseFloat(ncn.la_base_coverage) },
  { name: 'MM Base', value: parseFloat(ncn.mm_base_coverage) },
  { name: 'UM Base', value: parseFloat(ncn.um_base_coverage) },
]} />
```

**Option B: Items Weekly Trend Line Chart**
```typescript
<LineChart data={[
  { week: 'Baseline', value: items.ov_coverage_baseline },
  { week: 'Week 41', value: items.ov_coverage_week_41 },
  { week: 'Week 42', value: items.ov_coverage_week_42 },
  { week: 'Week 43', value: items.ov_coverage_week_43 },
  { week: 'Week 44', value: items.ov_coverage_week_44 },
]} />
```

**Option C: Drive Comparison Pie Chart**
```typescript
<PieChart data={[
  { name: 'NCN', value: calculateNCNScore(ncn) },
  { name: 'N2R', value: calculateN2RScore(n2r) },
  { name: 'Items', value: calculateItemsScore(items) },
]} />
```

**Decision Needed By:** Before Phase 4  
**Impact:** High (major UX improvement)  
**Effort:** 3-6 hours depending on complexity  

---

### 3. Access Control & Permissions ✅

**Status:** ✅ **DECISION MADE** - KAM-only access, filter by KAM email

**Decision:**
- Performance Metrics page is accessible to every individual KAM
- Pull summary data based on logged-in KAM's email
- Each KAM sees only their own metrics
- Zonal Head view is separate (different page/feature)

**Implementation:**
```typescript
const { user } = useAuth();
const { ncn, n2r, items } = usePerformanceMetrics(user?.email || "");
```

**Database Query:**
```sql
-- Each hook filters by kam_email
SELECT * FROM ncn_summary WHERE kam_email = 'logged_in_kam@zomato.com';
SELECT * FROM n2r_summary WHERE kam_email = 'logged_in_kam@zomato.com';
SELECT * FROM items_summary WHERE kam_email = 'logged_in_kam@zomato.com';
```

**Note:** Zonal Head aggregated view is a separate feature (not part of this implementation)

**Future Consideration:**
- Zonal Head view will be a different page/feature
- Will show aggregated team data
- Not included in current Performance Metrics MVP



---

## 📊 DECISION TRACKING

| Feature | Status | Priority | Effort | Decision |
|---------|--------|----------|--------|----------|
| Strategize Button | ✅ Decided | Low | 0h (deferred) | Keep in UI, non-functional for now |
| Charts/Visualizations | ✅ Decided | High | 3-6h | Implement all drives with best charts |
| Access Control | ✅ Decided | High | 0h (MVP) | KAM-only, filter by email |
| Zonal Head View | ⏸️ Future | Medium | 4-8h | Separate page/feature (not in MVP) |

---

## 🎯 WHEN TO PROVIDE INPUT

**Recommended Timeline:**

1. **After MVP Launch** (Phase 1-3 complete)
   - Test basic functionality
   - Gather user feedback
   - Identify most needed features

2. **Before Phase 4** (Enhancements)
   - Decide on chart types
   - Define strategize functionality
   - Plan access control

3. **Iterative Approach**
   - Start with one feature at a time
   - Test and refine
   - Add next feature

---

## 📝 HOW TO PROVIDE INPUT

**For Each Feature:**

1. **Review the questions** in this document
2. **Check the example options** provided
3. **Provide your decision** via:
   - Direct message with feature name
   - Mockup/wireframe (if visual)
   - User story (if complex)

**Example Response Format:**

```
Feature: Strategize Button

Decision:
- Open modal with recommendations
- Show drive-specific insights
- Include action items
- Export to PDF option

Priority: High
Timeline: Add in Phase 4
```

---

## 🔗 RELATED DOCUMENTS

- **Implementation Plan:** `PERFORMANCE-METRICS-IMPLEMENTATION-PLAN.md`
- **Technical Spec:** `PERFORMANCE-METRICS-TECHNICAL-SPEC.md`
- **Main Project Status:** `PROJECT-STATUS.md`

---

**Last Updated:** 2025-11-15  
**Next Review:** After MVP completion

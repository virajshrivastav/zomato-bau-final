# Performance Metrics Page - Implementation Plan

**Status:** ✅ Ready to Implement (All Decisions Confirmed)
**Last Updated:** 2025-11-15
**Estimated Time:** 6-8 hours (including charts)

---

## 📋 OVERVIEW

This document outlines the implementation plan for the Performance Metrics page (KAM Hub Analytics), which displays drive-wise summary data for NCN, N2R, and Items drives.

---

## 🎯 OBJECTIVES

1. Display KAM-specific performance metrics from 3 drives (NCN, N2R, Items)
2. Pull data from CSV files imported into database
3. Provide clean, visual summary of drive performance
4. Enable future enhancements (charts, strategize features)

---

## 📊 DATA SOURCES

### CSV Files (Located in `performance-metrics/` folder)

1. **NCN Coverage Summary.csv** - 129 rows (KAM-wise NCN metrics)
2. **N2R Summary.csv** - 61 rows (KAM-wise N2R metrics)
3. **Input Summary.csv** - 62 rows (KAM-wise Items metrics)

### Update Frequency
- **Frequency:** Once per day
- **Method:** Manual CSV replacement + script execution
- **Automation:** Not required

---

## 🏗️ ARCHITECTURE

```
CSV Files (performance-metrics/)
    ↓
Python Import Script (import_performance_metrics.py)
    ↓
Supabase Database (3 summary tables)
    ↓
React Query Hooks (usePerformanceMetrics.ts)
    ↓
KAMAnalytics.tsx (UI Components)
    ↓
User sees drive-wise metrics
```

---

## 📦 DATABASE SCHEMA

### Table 1: `ncn_summary`

**Purpose:** Store NCN drive summary metrics per KAM

**Columns:**
- `kam_email` (TEXT, PRIMARY KEY)
- `kam_name` (TEXT)
- `tl_email` (TEXT)
- `team` (TEXT)
- `la_base_coverage` (TEXT) - Column E
- `mm_base_coverage` (TEXT) - Column F
- `um_base_coverage` (TEXT) - Column G
- `la_stepper_coverage` (TEXT) - Column H
- `mm_stepper_coverage` (TEXT) - Column I
- `um_stepper_coverage` (TEXT) - Column J
- `flash_sale_coverage` (TEXT) - Column O
- `bogo_ov_coverage` (TEXT) - Column Q
- `overall_ov_coverage` (TEXT) - Column T
- `overall_res_coverage` (TEXT) - Column U
- `updated_at` (TIMESTAMP)

### Table 2: `n2r_summary`

**Purpose:** Store N2R drive summary metrics per KAM

**Columns:**
- `kam_email` (TEXT, PRIMARY KEY)
- `kam_name` (TEXT)
- `tl_email` (TEXT)
- `team` (TEXT)
- `la_ov_conversion` (TEXT) - Column M
- `mm_ov_conversion` (TEXT) - Column S
- `um_ov_conversion` (TEXT) - Column Y
- `updated_at` (TIMESTAMP)

### Table 3: `items_summary`

**Purpose:** Store Items drive summary metrics per KAM

**Columns:**
- `kam_email` (TEXT, PRIMARY KEY)
- `kam_name` (TEXT)
- `tl_email` (TEXT)
- `team` (TEXT)
- `ov_coverage_data` (JSONB) - Columns BZ:CV (weekly OV data)
- `items_count_data` (JSONB) - Columns DV:ER (weekly items count)
- `updated_at` (TIMESTAMP)

**Note:** Using JSONB for complex weekly data to avoid 50+ columns

---

## 🔧 IMPLEMENTATION PHASES

### Phase 1: Database Setup ✅
**Time:** 1-2 hours

- [x] Create schema file: `supabase/performance_metrics_schema.sql`
- [ ] Execute schema in Supabase
- [ ] Verify tables created
- [ ] Add indexes on `kam_email`

### Phase 2: Data Import ⏳
**Time:** 2-3 hours

- [ ] Create import script: `scripts/import_performance_metrics.py`
- [ ] Parse NCN CSV (129 rows)
- [ ] Parse N2R CSV (61 rows)
- [ ] Parse Items CSV (62 rows)
- [ ] Generate INSERT SQL statements
- [ ] Execute import
- [ ] Verify data integrity

### Phase 3: Frontend Integration ⏳
**Time:** 2-3 hours

- [ ] Create TypeScript interfaces: `src/types/performanceMetrics.ts`
- [ ] Create React hooks: `src/hooks/usePerformanceMetrics.ts`
- [ ] Update KAMAnalytics.tsx with real data
- [ ] Create metric card components
- [ ] Add loading/error states
- [ ] Test with multiple KAMs

### Phase 4: Testing & Polish ⏳
**Time:** 1 hour

- [ ] Test with 3-5 different KAM emails
- [ ] Handle missing data gracefully
- [ ] Verify responsive design
- [ ] Check performance
- [ ] Document usage

---

## 📱 UI COMPONENTS

### NCN Drive Section
**Metrics to Display:**
1. **Stepper/Base Coverage Card** (6 sub-metrics)
   - LA Base, MM Base, UM Base
   - LA Stepper, MM Stepper, UM Stepper
2. **Flash Sale Coverage Card**
3. **BOGO OV Coverage Card**
4. **Overall OV Coverage Card**
5. **Overall Res Coverage Card**

### N2R Drive Section
**Metrics to Display:**
1. **LA OV Conversion Card**
2. **MM OV Conversion Card**
3. **UM OV Conversion Card**

### Items Drive Section
**Metrics to Display:**
1. **OV Coverage Section** (weekly trends)
   - Baseline, Week 41-44, Delta, WoW
2. **Items Count Section** (weekly trends)
   - Baseline, Week 41-44, Delta, WoW

---

## 🎨 DEFERRED FEATURES

### 1. Strategize Button Functionality
**Status:** ⏸️ **AWAITING INPUT**

**Placeholder Implementation:**
```typescript
<Button onClick={() => {
  // TODO: Add strategize functionality
  // Options to consider:
  // - Open modal with recommendations
  // - Export report to PDF/Excel
  // - Show AI-powered insights
  // - Navigate to strategy planning page
}}>
  <Target className="w-4 h-4 mr-2" />
  Strategize Now
</Button>
```

**Questions for Later:**
- [ ] What should happen when user clicks "Strategize"?
- [ ] Should it open a modal or navigate to new page?
- [ ] What insights/recommendations to show?
- [ ] Should it be drive-specific or overall?

---

### 2. Charts & Visualizations
**Status:** ⏸️ **AWAITING INPUT**

**Placeholder Implementation:**
```typescript
{/* Chart Placeholder - To be implemented */}
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
  <p className="text-gray-500">Chart visualization coming soon</p>
</div>
```

**Questions for Later:**
- [ ] Which chart types are most important? (Bar, Pie, Line, Area?)
- [ ] What data should be visualized first?
- [ ] Should charts be drive-specific or comparative?
- [ ] Weekly trends or overall performance?
- [ ] Interactive charts or static?

**Chart Options to Consider:**
- **Bar Charts:** Compare metrics across drives
- **Pie Charts:** Show distribution (e.g., coverage breakdown)
- **Line Charts:** Weekly trends for Items drive
- **Area Charts:** Cumulative performance over time
- **Combo Charts:** Multiple metrics on same chart

---

### 3. Access Control & Permissions
**Status:** ⏸️ **AWAITING INPUT**

**Current Implementation:**
- KAM-only access (filtered by `user.email`)
- Each KAM sees only their own metrics

**Placeholder for Future Enhancement:**
```typescript
// TODO: Add role-based access control
const { user, role } = useAuth();

if (role === 'ZONAL_HEAD') {
  // Show aggregated team data
  const { data: teamMetrics } = useTeamPerformanceMetrics(user.team);
} else if (role === 'KAM') {
  // Show individual KAM data
  const { data: kamMetrics } = usePerformanceMetrics(user.email);
}
```

**Questions for Later:**
- [ ] Should Zonal Heads see aggregated team data?
- [ ] Should they see individual KAM breakdowns?
- [ ] Should there be team comparisons?
- [ ] Should there be leaderboards?
- [ ] What permissions for viewing vs editing?

---

## 🔄 DATA UPDATE WORKFLOW

### Daily Update Process

**Step 1: Receive Updated CSV Files**
- Replace files in `performance-metrics/` folder
- Ensure file names match exactly:
  - `Dashboard Context data Drives - NCN Coverage Summary .csv`
  - `Dashboard Context data Drives - N2R Summary.csv`
  - `Dashboard Context data Drives - Input Summary.csv`

**Step 2: Run Import Script**
```bash
cd scripts
python import_performance_metrics.py
```

**Step 3: Verify Import**
```sql
-- Check row counts
SELECT COUNT(*) FROM ncn_summary;  -- Should match CSV rows
SELECT COUNT(*) FROM n2r_summary;
SELECT COUNT(*) FROM items_summary;

-- Check last update time
SELECT MAX(updated_at) FROM ncn_summary;
```

**Step 4: Frontend Auto-Updates**
- React Query cache: 5 minutes
- Users see new data on next page load
- No manual refresh needed (after cache expires)

**Estimated Time:** 2-5 minutes per update

---

## 📐 COLUMN MAPPING REFERENCE

### NCN CSV → Database Mapping

| CSV Column | Column Letter | Database Field | Description |
|------------|---------------|----------------|-------------|
| KAM | B | kam_email | KAM email address |
| TL | C | tl_email | Team Lead email |
| Team | D | team | Team name |
| LA Base | E | la_base_coverage | LA base coverage % |
| MM Base | F | mm_base_coverage | MM base coverage % |
| UM Base | G | um_base_coverage | UM base coverage % |
| LA | H | la_stepper_coverage | LA stepper coverage % |
| MM | I | mm_stepper_coverage | MM stepper coverage % |
| UM | J | um_stepper_coverage | UM stepper coverage % |
| Overall Coverage | O | flash_sale_coverage | Flash sale coverage % |
| Res OV Coverage | Q | bogo_ov_coverage | BOGO OV coverage % |
| With OV > 100 | T | overall_ov_coverage | Overall OV coverage % |
| (Next column) | U | overall_res_coverage | Overall res coverage % |

### N2R CSV → Database Mapping

| CSV Column | Column Letter | Database Field | Description |
|------------|---------------|----------------|-------------|
| KAM | B | kam_email | KAM email address |
| TL | C | tl_email | Team Lead email |
| Team | D | team | Team name |
| LA OV Conversion | M | la_ov_conversion | LA OV conversion % |
| MM OV Conversion | S | mm_ov_conversion | MM OV conversion % |
| UM OV Conversion | Y | um_ov_conversion | UM OV conversion % |

### Items CSV → Database Mapping

| CSV Range | Database Field | Description |
|-----------|----------------|-------------|
| BZ:CV | ov_coverage_data (JSONB) | OV Coverage weekly metrics |
| DV:ER | items_count_data (JSONB) | Items count weekly metrics |

**JSONB Structure Example:**
```json
{
  "baseline": "0.33%",
  "week_41": "0.25%",
  "week_42": "0.22%",
  "week_43": "0.20%",
  "week_44": "0.18%",
  "delta": "▼ 0.2%",
  "wow": "▲ 0.0%"
}
```

---

## 🧪 TESTING CHECKLIST

### Data Import Testing
- [ ] All 3 CSV files parse correctly
- [ ] No data loss during import
- [ ] Special characters handled (▲, ▼, %)
- [ ] NULL values handled gracefully
- [ ] Duplicate KAM emails handled (UPSERT)

### Frontend Testing
- [ ] Test with KAM having all 3 drives
- [ ] Test with KAM having only NCN
- [ ] Test with KAM having only N2R
- [ ] Test with KAM having only Items
- [ ] Test with KAM not in CSV (show "No data")
- [ ] Test loading states
- [ ] Test error states
- [ ] Test responsive design (mobile, tablet, desktop)

### Performance Testing
- [ ] Page loads in < 2 seconds
- [ ] No memory leaks
- [ ] React Query caching works
- [ ] No unnecessary re-renders

---

## 🚨 KNOWN LIMITATIONS & EDGE CASES

### Data Quality Issues
1. **Missing KAMs:** Some KAMs may not appear in all 3 CSVs
   - **Solution:** Show "N/A" for missing drives

2. **Special Characters:** Delta indicators (▲, ▼) in CSV
   - **Solution:** Store as-is (TEXT field), display with proper encoding

3. **Percentage Formats:** Inconsistent (42%, 42.5%, 0.42)
   - **Solution:** Store as TEXT, normalize in UI if needed

4. **NULL/Empty Values:** Some cells may be empty
   - **Solution:** Default to "N/A" or "0%" based on context

### Technical Limitations
1. **No Real-time Updates:** Data refreshes daily only
   - **Acceptable:** Per requirements

2. **No Historical Data:** Only current snapshot
   - **Future Enhancement:** Add versioning/history tables

3. **No Drill-down:** Can't see restaurant-level details
   - **Future Enhancement:** Link to KAM Hub filtered view

---

## 📚 RELATED DOCUMENTATION

- **Main Project Status:** `PROJECT-STATUS.md`
- **Database Guide:** `DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md`
- **System Architecture:** `SYSTEM-ARCHITECTURE-DIAGRAM.md`
- **Sprint 2 Summary:** `SPRINT-2-COMPLETION-SUMMARY.md`

---

## 🎯 SUCCESS CRITERIA

### Minimum Viable Product (MVP)
- [x] Database schema created
- [ ] CSV data imported successfully
- [ ] KAMAnalytics page shows real data
- [ ] All 3 drives display correctly
- [ ] Filtered by logged-in KAM email
- [ ] Handles missing data gracefully
- [ ] Responsive design works

### Nice-to-Have (Post-MVP)
- [ ] Charts/visualizations added
- [ ] Strategize button functional
- [ ] Export to Excel/PDF
- [ ] Historical trend tracking
- [ ] Team aggregation for Zonal Heads
- [ ] Performance benchmarking

---

## 📞 CONTACT & SUPPORT

**For Questions About:**
- **Strategize Button:** Awaiting user input
- **Chart Types:** Awaiting user input
- **Access Control:** Awaiting user input
- **Technical Issues:** Check existing documentation first

---

**Last Updated:** 2025-11-15
**Next Review:** After Phase 2 completion



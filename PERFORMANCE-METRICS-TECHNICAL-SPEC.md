# Performance Metrics - Technical Specification

**Version:** 1.0  
**Last Updated:** 2025-11-15  
**Status:** 🚧 In Development  

---

## 📋 TABLE OF CONTENTS

1. [Database Schema](#database-schema)
2. [API Layer](#api-layer)
3. [Frontend Components](#frontend-components)
4. [Data Flow](#data-flow)
5. [Type Definitions](#type-definitions)
6. [Import Scripts](#import-scripts)

---

## 🗄️ DATABASE SCHEMA

### File: `supabase/performance_metrics_schema.sql`

```sql
-- ============================================
-- PERFORMANCE METRICS SUMMARY TABLES
-- ============================================
-- Purpose: Store KAM-wise drive summary data
-- Source: CSV files from performance-metrics/
-- Update Frequency: Daily (manual)
-- ============================================

-- Table 1: NCN Drive Summary
CREATE TABLE IF NOT EXISTS ncn_summary (
  -- Primary Key
  kam_email TEXT PRIMARY KEY,
  
  -- KAM Info
  kam_name TEXT,
  tl_email TEXT,
  team TEXT,
  
  -- Stepper/Base Coverage (Columns E-J)
  la_base_coverage TEXT,
  mm_base_coverage TEXT,
  um_base_coverage TEXT,
  la_stepper_coverage TEXT,
  mm_stepper_coverage TEXT,
  um_stepper_coverage TEXT,
  
  -- Delta indicators (Columns K-M)
  delta_la TEXT,
  delta_mm TEXT,
  delta_um TEXT,
  
  -- Other Coverage Metrics
  flash_sale_coverage TEXT,      -- Column O
  bogo_ov_coverage TEXT,          -- Column Q
  overall_ov_coverage TEXT,       -- Column T
  overall_res_coverage TEXT,      -- Column U
  
  -- BOGO Sub-metrics (Columns V-X)
  bogo_get150 TEXT,
  bogo_take150 TEXT,
  bogo_binge150 TEXT,
  
  -- Metadata
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: N2R Drive Summary
CREATE TABLE IF NOT EXISTS n2r_summary (
  -- Primary Key
  kam_email TEXT PRIMARY KEY,
  
  -- KAM Info
  kam_name TEXT,
  tl_email TEXT,
  team TEXT,
  
  -- OV Conversion Metrics (Columns M, S, Y)
  la_ov_conversion TEXT,
  mm_ov_conversion TEXT,
  um_ov_conversion TEXT,
  
  -- Metadata
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table 3: Items Drive Summary
CREATE TABLE IF NOT EXISTS items_summary (
  -- Primary Key
  kam_email TEXT PRIMARY KEY,
  
  -- KAM Info
  kam_name TEXT,
  tl_email TEXT,
  team TEXT,
  
  -- OV Coverage Data (Columns BZ:CV)
  -- Stored as JSONB for flexibility
  ov_coverage_baseline TEXT,
  ov_coverage_week_41 TEXT,
  ov_coverage_week_42 TEXT,
  ov_coverage_week_43 TEXT,
  ov_coverage_week_44 TEXT,
  ov_coverage_delta TEXT,
  ov_coverage_wow TEXT,
  
  -- Items Count Data (Columns DV:ER)
  items_count_baseline TEXT,
  items_count_week_41 TEXT,
  items_count_week_42 TEXT,
  items_count_week_43 TEXT,
  items_count_week_44 TEXT,
  items_count_delta TEXT,
  items_count_wow TEXT,
  
  -- Metadata
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ncn_summary_kam_email ON ncn_summary(kam_email);
CREATE INDEX IF NOT EXISTS idx_n2r_summary_kam_email ON n2r_summary(kam_email);
CREATE INDEX IF NOT EXISTS idx_items_summary_kam_email ON items_summary(kam_email);

-- Comments for documentation
COMMENT ON TABLE ncn_summary IS 'NCN drive performance metrics per KAM';
COMMENT ON TABLE n2r_summary IS 'N2R drive performance metrics per KAM';
COMMENT ON TABLE items_summary IS 'Items drive performance metrics per KAM';
```

---

## 🔌 API LAYER

### File: `src/hooks/usePerformanceMetrics.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { NCNSummary, N2RSummary, ItemsSummary } from "@/types/performanceMetrics";

/**
 * Fetch NCN summary for a specific KAM
 */
export function useNCNSummary(kamEmail: string) {
  return useQuery({
    queryKey: ["ncn_summary", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ncn_summary")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        // Return null if no data found (KAM not in NCN drive)
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as NCNSummary;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch N2R summary for a specific KAM
 */
export function useN2RSummary(kamEmail: string) {
  return useQuery({
    queryKey: ["n2r_summary", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("n2r_summary")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as N2RSummary;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch Items summary for a specific KAM
 */
export function useItemsSummary(kamEmail: string) {
  return useQuery({
    queryKey: ["items_summary", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items_summary")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as ItemsSummary;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch all performance metrics for a KAM (combined)
 */
export function usePerformanceMetrics(kamEmail: string) {
  const ncn = useNCNSummary(kamEmail);
  const n2r = useN2RSummary(kamEmail);
  const items = useItemsSummary(kamEmail);

  return {
    ncn,
    n2r,
    items,
    isLoading: ncn.isLoading || n2r.isLoading || items.isLoading,
    error: ncn.error || n2r.error || items.error,
  };
}
```

---

## 📦 TYPE DEFINITIONS

### File: `src/types/performanceMetrics.ts`

```typescript
/**
 * NCN Drive Summary Data
 */
export interface NCNSummary {
  kam_email: string;
  kam_name: string | null;
  tl_email: string | null;
  team: string | null;

  // Stepper/Base Coverage
  la_base_coverage: string | null;
  mm_base_coverage: string | null;
  um_base_coverage: string | null;
  la_stepper_coverage: string | null;
  mm_stepper_coverage: string | null;
  um_stepper_coverage: string | null;

  // Delta indicators
  delta_la: string | null;
  delta_mm: string | null;
  delta_um: string | null;

  // Other metrics
  flash_sale_coverage: string | null;
  bogo_ov_coverage: string | null;
  overall_ov_coverage: string | null;
  overall_res_coverage: string | null;

  // BOGO sub-metrics
  bogo_get150: string | null;
  bogo_take150: string | null;
  bogo_binge150: string | null;

  updated_at: string;
}

/**
 * N2R Drive Summary Data
 */
export interface N2RSummary {
  kam_email: string;
  kam_name: string | null;
  tl_email: string | null;
  team: string | null;

  la_ov_conversion: string | null;
  mm_ov_conversion: string | null;
  um_ov_conversion: string | null;

  updated_at: string;
}

/**
 * Items Drive Summary Data
 */
export interface ItemsSummary {
  kam_email: string;
  kam_name: string | null;
  tl_email: string | null;
  team: string | null;

  // OV Coverage weekly data
  ov_coverage_baseline: string | null;
  ov_coverage_week_41: string | null;
  ov_coverage_week_42: string | null;
  ov_coverage_week_43: string | null;
  ov_coverage_week_44: string | null;
  ov_coverage_delta: string | null;
  ov_coverage_wow: string | null;

  // Items count weekly data
  items_count_baseline: string | null;
  items_count_week_41: string | null;
  items_count_week_42: string | null;
  items_count_week_43: string | null;
  items_count_week_44: string | null;
  items_count_delta: string | null;
  items_count_wow: string | null;

  updated_at: string;
}

/**
 * Combined performance metrics
 */
export interface PerformanceMetrics {
  ncn: NCNSummary | null;
  n2r: N2RSummary | null;
  items: ItemsSummary | null;
}
```

---

## 🎨 FRONTEND COMPONENTS

### Component Structure

```
src/pages/KAMAnalytics.tsx (Main Page)
  ├── PerformanceHeader (Title, Strategize Button)
  ├── NCNDriveSection
  │   ├── StepperCoverageCard
  │   ├── FlashSaleCard
  │   ├── BOGOCard
  │   └── OverallCoverageCard
  ├── N2RDriveSection
  │   ├── LAConversionCard
  │   ├── MMConversionCard
  │   └── UMConversionCard
  └── ItemsDriveSection
      ├── OVCoverageWeeklyCard
      └── ItemsCountWeeklyCard
```

### Main Page Component

**File:** `src/pages/KAMAnalytics.tsx`

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, BarChart3, TrendingUp } from "lucide-react";

export default function KAMAnalytics() {
  const { user } = useAuth();
  const { ncn, n2r, items, isLoading, error } = usePerformanceMetrics(
    user?.email || ""
  );

  if (isLoading) {
    return <div>Loading performance metrics...</div>;
  }

  if (error) {
    return <div>Error loading metrics: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Performance Metrics</h1>

        {/* Strategize Button - AWAITING INPUT */}
        <Button onClick={() => {
          // TODO: Add strategize functionality
          console.log("Strategize clicked - functionality pending");
        }}>
          <Target className="w-4 h-4 mr-2" />
          Strategize Now
        </Button>
      </div>

      {/* NCN Drive Section */}
      {ncn ? (
        <NCNDriveSection data={ncn} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">No NCN drive data available</p>
          </CardContent>
        </Card>
      )}

      {/* N2R Drive Section */}
      {n2r ? (
        <N2RDriveSection data={n2r} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">No N2R drive data available</p>
          </CardContent>
        </Card>
      )}

      {/* Items Drive Section */}
      {items ? (
        <ItemsDriveSection data={items} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">No Items drive data available</p>
          </CardContent>
        </Card>
      )}

      {/* Chart Placeholder - AWAITING INPUT */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              Chart visualizations coming soon
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Awaiting input on chart types and data to display
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔄 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│  CSV Files (performance-metrics/)                           │
│  - NCN Coverage Summary.csv (129 rows)                      │
│  - N2R Summary.csv (61 rows)                                │
│  - Input Summary.csv (62 rows)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Python Import Script                                       │
│  scripts/import_performance_metrics.py                      │
│  - Parse CSV files                                          │
│  - Generate SQL INSERT statements                           │
│  - Handle special characters (▲, ▼)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase Database                                          │
│  - ncn_summary (129 rows)                                   │
│  - n2r_summary (61 rows)                                    │
│  - items_summary (62 rows)                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  React Query Hooks                                          │
│  src/hooks/usePerformanceMetrics.ts                         │
│  - useNCNSummary(kamEmail)                                  │
│  - useN2RSummary(kamEmail)                                  │
│  - useItemsSummary(kamEmail)                                │
│  - Cache: 5 minutes                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  KAMAnalytics Page                                          │
│  src/pages/KAMAnalytics.tsx                                 │
│  - Fetch data for logged-in KAM                             │
│  - Display NCN, N2R, Items metrics                          │
│  - Handle loading/error states                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  User Interface                                             │
│  - Metric cards with percentages                            │
│  - Drive-wise sections                                      │
│  - Strategize button (placeholder)                          │
│  - Chart placeholders (awaiting input)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🐍 IMPORT SCRIPTS

### File: `scripts/import_performance_metrics.py`

**Purpose:** Parse CSV files and generate SQL INSERT statements

**Key Functions:**

```python
def parse_ncn_csv():
    """
    Parse NCN Coverage Summary CSV
    Returns: List of dicts with KAM data
    """
    # Read CSV from performance-metrics/
    # Extract columns B-X
    # Handle special characters (▲, ▼)
    # Return structured data

def parse_n2r_csv():
    """
    Parse N2R Summary CSV
    Returns: List of dicts with KAM data
    """
    # Read CSV from performance-metrics/
    # Extract columns B, C, D, M, S, Y
    # Return structured data

def parse_items_csv():
    """
    Parse Items Summary CSV
    Returns: List of dicts with KAM data
    """
    # Read CSV from performance-metrics/
    # Extract columns BZ:CV (OV Coverage)
    # Extract columns DV:ER (Items Count)
    # Return structured data

def generate_ncn_sql(data):
    """
    Generate INSERT statements for ncn_summary
    Uses UPSERT (ON CONFLICT DO UPDATE)
    """

def generate_n2r_sql(data):
    """
    Generate INSERT statements for n2r_summary
    Uses UPSERT (ON CONFLICT DO UPDATE)
    """

def generate_items_sql(data):
    """
    Generate INSERT statements for items_summary
    Uses UPSERT (ON CONFLICT DO UPDATE)
    """
```

**SQL Pattern (UPSERT):**

```sql
INSERT INTO ncn_summary (
  kam_email, kam_name, tl_email, team,
  la_base_coverage, mm_base_coverage, um_base_coverage,
  -- ... other fields
  updated_at
) VALUES (
  'bhuwneshwari.dhouni@zomato.com',
  'Bhuwneshwari Dhouni',
  'prahaas.muchandi@zomato.com',
  'CKAM',
  '36.51%',
  '27.33%',
  '47.19%',
  -- ... other values
  NOW()
)
ON CONFLICT (kam_email) DO UPDATE SET
  kam_name = EXCLUDED.kam_name,
  tl_email = EXCLUDED.tl_email,
  team = EXCLUDED.team,
  la_base_coverage = EXCLUDED.la_base_coverage,
  -- ... other fields
  updated_at = NOW();
```

---

## 🧪 TESTING STRATEGY

### Unit Tests

**Test Data Parsing:**
```python
def test_parse_ncn_csv():
    data = parse_ncn_csv()
    assert len(data) == 129
    assert data[0]['kam_email'] == 'bhuwneshwari.dhouni@zomato.com'
    assert data[0]['la_base_coverage'] == '36.51%'
```

**Test SQL Generation:**
```python
def test_generate_ncn_sql():
    data = [{'kam_email': 'test@zomato.com', ...}]
    sql = generate_ncn_sql(data)
    assert 'INSERT INTO ncn_summary' in sql
    assert 'ON CONFLICT' in sql
```

### Integration Tests

**Test Database Import:**
```sql
-- After import, verify counts
SELECT COUNT(*) FROM ncn_summary;  -- Should be 129
SELECT COUNT(*) FROM n2r_summary;  -- Should be 61
SELECT COUNT(*) FROM items_summary; -- Should be 62

-- Verify specific KAM
SELECT * FROM ncn_summary
WHERE kam_email = 'bhuwneshwari.dhouni@zomato.com';
```

**Test Frontend Hooks:**
```typescript
// Test useNCNSummary hook
const { data } = useNCNSummary('bhuwneshwari.dhouni@zomato.com');
expect(data?.la_base_coverage).toBe('36.51%');
```

### End-to-End Tests

1. **Login as KAM with all 3 drives**
   - Verify all sections display
   - Check data accuracy

2. **Login as KAM with only NCN**
   - Verify NCN section displays
   - Verify N2R/Items show "No data"

3. **Login as KAM not in any CSV**
   - Verify all sections show "No data"
   - No errors thrown

---

## 🚨 ERROR HANDLING

### Database Errors

```typescript
// Handle missing data gracefully
if (error?.code === "PGRST116") {
  // No rows returned - KAM not in this drive
  return null;
}

// Handle other errors
throw new Error(`Failed to fetch metrics: ${error.message}`);
```

### CSV Parsing Errors

```python
try:
    data = parse_ncn_csv()
except FileNotFoundError:
    print("❌ CSV file not found")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error parsing CSV: {e}")
    sys.exit(1)
```

### Frontend Display

```typescript
// Show fallback for missing data
{ncn?.la_base_coverage || "N/A"}

// Show error state
{error && (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

---

## 📊 PERFORMANCE CONSIDERATIONS

### Database Optimization

1. **Indexes:** Already created on `kam_email` for fast lookups
2. **Query Caching:** React Query caches for 5 minutes
3. **Data Size:** Small tables (~60-130 rows each)
4. **Query Time:** Expected < 50ms per query

### Frontend Optimization

1. **Code Splitting:** Lazy load KAMAnalytics page
2. **Memoization:** Use `useMemo` for computed values
3. **Conditional Rendering:** Only render sections with data
4. **Skeleton Loading:** Show placeholders while loading

### Network Optimization

1. **Parallel Queries:** Fetch all 3 drives simultaneously
2. **Stale-While-Revalidate:** Show cached data, fetch in background
3. **Error Boundaries:** Prevent full page crash on error

---

## 🔐 SECURITY CONSIDERATIONS

### Row Level Security (RLS)

**Current Status:** RLS disabled for testing

**Future Implementation:**
```sql
-- Enable RLS on summary tables
ALTER TABLE ncn_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE n2r_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_summary ENABLE ROW LEVEL SECURITY;

-- Policy: KAMs can only see their own data
CREATE POLICY kam_access_ncn ON ncn_summary
  FOR SELECT
  USING (kam_email = auth.jwt() ->> 'email');

CREATE POLICY kam_access_n2r ON n2r_summary
  FOR SELECT
  USING (kam_email = auth.jwt() ->> 'email');

CREATE POLICY kam_access_items ON items_summary
  FOR SELECT
  USING (kam_email = auth.jwt() ->> 'email');
```

### Data Validation

1. **Email Validation:** Ensure kam_email is valid format
2. **Percentage Validation:** Ensure percentages are valid (0-100%)
3. **SQL Injection Prevention:** Use parameterized queries
4. **XSS Prevention:** Sanitize display values

---

## 📝 MAINTENANCE GUIDE

### Daily Update Checklist

- [ ] Receive updated CSV files
- [ ] Backup old CSV files (optional)
- [ ] Replace files in `performance-metrics/` folder
- [ ] Run import script: `python scripts/import_performance_metrics.py`
- [ ] Verify import success (check row counts)
- [ ] Test frontend (spot check 2-3 KAMs)
- [ ] Monitor for errors in logs

### Troubleshooting

**Problem:** Import script fails
- **Check:** CSV file names match exactly
- **Check:** CSV format hasn't changed
- **Check:** Database connection working

**Problem:** Frontend shows "No data"
- **Check:** KAM email exists in CSV
- **Check:** Database import completed
- **Check:** React Query cache (try hard refresh)

**Problem:** Data looks incorrect
- **Check:** CSV column mapping
- **Check:** Special character encoding
- **Check:** Database values vs CSV values

---

## 🎯 FUTURE ENHANCEMENTS

### Phase 2 Features (Awaiting Input)

1. **Strategize Button Functionality**
   - [ ] Define requirements
   - [ ] Design UI/UX
   - [ ] Implement backend logic
   - [ ] Add frontend components

2. **Charts & Visualizations**
   - [ ] Choose chart library (Recharts already in use)
   - [ ] Define chart types needed
   - [ ] Implement data transformations
   - [ ] Add interactive features

3. **Access Control**
   - [ ] Define Zonal Head requirements
   - [ ] Implement team aggregation
   - [ ] Add role-based UI
   - [ ] Test permissions

### Phase 3 Features (Nice-to-Have)

1. **Historical Tracking**
   - Store daily snapshots
   - Show trend over time
   - Compare week-over-week

2. **Export Functionality**
   - Export to Excel
   - Export to PDF
   - Email reports

3. **Benchmarking**
   - Compare to team average
   - Show percentile ranking
   - Highlight top performers

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Next Review:** After Phase 1 completion


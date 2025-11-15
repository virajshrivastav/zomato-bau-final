# Performance Metrics - Quick Start Guide

**Purpose:** Step-by-step guide to implement Performance Metrics page  
**Time Required:** 4-6 hours  
**Last Updated:** 2025-11-15  

---

## 🎯 WHAT YOU'RE BUILDING

A Performance Metrics page that displays KAM-specific drive summaries for:
- **NCN Drive:** Coverage metrics (Stepper, Flash Sale, BOGO, Overall)
- **N2R Drive:** Conversion metrics (LA, MM, UM)
- **Items Drive:** Weekly trend metrics (OV Coverage, Items Count)

**Data Source:** 3 CSV files → Database → React UI

---

## ✅ PRE-REQUISITES

Before starting, ensure you have:

- [x] Supabase database connected and working
- [x] CSV files in `performance-metrics/` folder:
  - `Dashboard Context data Drives - NCN Coverage Summary .csv`
  - `Dashboard Context data Drives - N2R Summary.csv`
  - `Dashboard Context data Drives - Input Summary.csv`
- [x] Python environment with required packages
- [x] React app running locally
- [x] Access to Supabase dashboard

---

## 🚀 IMPLEMENTATION STEPS

### PHASE 1: Database Setup (1-2 hours)

#### Step 1.1: Create Schema File

**File:** `supabase/performance_metrics_schema.sql`

```bash
# Create the file
touch supabase/performance_metrics_schema.sql
```

**Copy the schema from:** `PERFORMANCE-METRICS-TECHNICAL-SPEC.md` (lines 15-120)

Or use this quick version:

```sql
-- NCN Summary Table
CREATE TABLE IF NOT EXISTS ncn_summary (
  kam_email TEXT PRIMARY KEY,
  kam_name TEXT,
  tl_email TEXT,
  team TEXT,
  la_base_coverage TEXT,
  mm_base_coverage TEXT,
  um_base_coverage TEXT,
  la_stepper_coverage TEXT,
  mm_stepper_coverage TEXT,
  um_stepper_coverage TEXT,
  delta_la TEXT,
  delta_mm TEXT,
  delta_um TEXT,
  flash_sale_coverage TEXT,
  bogo_ov_coverage TEXT,
  overall_ov_coverage TEXT,
  overall_res_coverage TEXT,
  bogo_get150 TEXT,
  bogo_take150 TEXT,
  bogo_binge150 TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- N2R Summary Table
CREATE TABLE IF NOT EXISTS n2r_summary (
  kam_email TEXT PRIMARY KEY,
  kam_name TEXT,
  tl_email TEXT,
  team TEXT,
  la_ov_conversion TEXT,
  mm_ov_conversion TEXT,
  um_ov_conversion TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Items Summary Table
CREATE TABLE IF NOT EXISTS items_summary (
  kam_email TEXT PRIMARY KEY,
  kam_name TEXT,
  tl_email TEXT,
  team TEXT,
  ov_coverage_baseline TEXT,
  ov_coverage_week_41 TEXT,
  ov_coverage_week_42 TEXT,
  ov_coverage_week_43 TEXT,
  ov_coverage_week_44 TEXT,
  ov_coverage_delta TEXT,
  ov_coverage_wow TEXT,
  items_count_baseline TEXT,
  items_count_week_41 TEXT,
  items_count_week_42 TEXT,
  items_count_week_43 TEXT,
  items_count_week_44 TEXT,
  items_count_delta TEXT,
  items_count_wow TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ncn_summary_kam_email ON ncn_summary(kam_email);
CREATE INDEX IF NOT EXISTS idx_n2r_summary_kam_email ON n2r_summary(kam_email);
CREATE INDEX IF NOT EXISTS idx_items_summary_kam_email ON items_summary(kam_email);
```

#### Step 1.2: Execute Schema

**Option A: Via Supabase CLI**
```bash
supabase db execute --file supabase/performance_metrics_schema.sql --linked
```

**Option B: Via Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Copy-paste the schema
3. Click "Run"

#### Step 1.3: Verify Tables Created

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('ncn_summary', 'n2r_summary', 'items_summary');

-- Should return 3 rows
```

✅ **Checkpoint:** 3 tables created successfully

---

### PHASE 2: Data Import (2-3 hours)

#### Step 2.1: Create Import Script

**File:** `scripts/import_performance_metrics.py`

**Quick Start Template:**

```python
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

# File paths
NCN_CSV = "performance-metrics/Dashboard Context data Drives - NCN Coverage Summary .csv"
N2R_CSV = "performance-metrics/Dashboard Context data Drives - N2R Summary.csv"
ITEMS_CSV = "performance-metrics/Dashboard Context data Drives - Input Summary.csv"

def safe_str(value):
    """Convert value to string, handle NaN"""
    if pd.isna(value):
        return 'NULL'
    return f"'{str(value).replace(\"'\", \"''\")}'"

def parse_ncn_csv():
    """Parse NCN CSV and generate SQL"""
    df = pd.read_csv(NCN_CSV, skiprows=2)  # Skip header rows
    
    sql_statements = []
    
    for _, row in df.iterrows():
        kam_email = safe_str(row.iloc[1])  # Column B
        
        if kam_email == 'NULL':
            continue
            
        sql = f"""
INSERT INTO ncn_summary (
  kam_email, kam_name, tl_email, team,
  la_base_coverage, mm_base_coverage, um_base_coverage,
  la_stepper_coverage, mm_stepper_coverage, um_stepper_coverage,
  delta_la, delta_mm, delta_um,
  flash_sale_coverage, bogo_ov_coverage,
  overall_ov_coverage, overall_res_coverage,
  bogo_get150, bogo_take150, bogo_binge150
) VALUES (
  {kam_email},
  {safe_str(row.iloc[1])},  -- kam_name (same as email for now)
  {safe_str(row.iloc[2])},  -- tl_email (Column C)
  {safe_str(row.iloc[3])},  -- team (Column D)
  {safe_str(row.iloc[4])},  -- la_base (Column E)
  {safe_str(row.iloc[5])},  -- mm_base (Column F)
  {safe_str(row.iloc[6])},  -- um_base (Column G)
  {safe_str(row.iloc[7])},  -- la_stepper (Column H)
  {safe_str(row.iloc[8])},  -- mm_stepper (Column I)
  {safe_str(row.iloc[9])},  -- um_stepper (Column J)
  {safe_str(row.iloc[10])}, -- delta_la (Column K)
  {safe_str(row.iloc[11])}, -- delta_mm (Column L)
  {safe_str(row.iloc[12])}, -- delta_um (Column M)
  {safe_str(row.iloc[14])}, -- flash_sale (Column O)
  {safe_str(row.iloc[16])}, -- bogo (Column Q)
  {safe_str(row.iloc[19])}, -- overall_ov (Column T)
  {safe_str(row.iloc[20])}, -- overall_res (Column U)
  {safe_str(row.iloc[22])}, -- get150 (Column W)
  {safe_str(row.iloc[23])}, -- take150 (Column X)
  {safe_str(row.iloc[24])}  -- binge150 (Column Y)
)
ON CONFLICT (kam_email) DO UPDATE SET
  kam_name = EXCLUDED.kam_name,
  tl_email = EXCLUDED.tl_email,
  team = EXCLUDED.team,
  la_base_coverage = EXCLUDED.la_base_coverage,
  mm_base_coverage = EXCLUDED.mm_base_coverage,
  um_base_coverage = EXCLUDED.um_base_coverage,
  la_stepper_coverage = EXCLUDED.la_stepper_coverage,
  mm_stepper_coverage = EXCLUDED.mm_stepper_coverage,
  um_stepper_coverage = EXCLUDED.um_stepper_coverage,
  delta_la = EXCLUDED.delta_la,
  delta_mm = EXCLUDED.delta_mm,
  delta_um = EXCLUDED.delta_um,
  flash_sale_coverage = EXCLUDED.flash_sale_coverage,
  bogo_ov_coverage = EXCLUDED.bogo_ov_coverage,
  overall_ov_coverage = EXCLUDED.overall_ov_coverage,
  overall_res_coverage = EXCLUDED.overall_res_coverage,
  bogo_get150 = EXCLUDED.bogo_get150,
  bogo_take150 = EXCLUDED.bogo_take150,
  bogo_binge150 = EXCLUDED.bogo_binge150,
  updated_at = NOW();
"""
        sql_statements.append(sql)
    
    return sql_statements

# Similar functions for N2R and Items...

if __name__ == "__main__":
    print("🚀 Starting Performance Metrics Import")
    
    # Generate SQL
    ncn_sql = parse_ncn_csv()
    print(f"✅ Generated {len(ncn_sql)} NCN statements")
    
    # Write to file
    with open("sql_output/insert_ncn_summary.sql", "w", encoding="utf-8") as f:
        f.write("\n".join(ncn_sql))
    
    print("✅ SQL files generated")
```

#### Step 2.2: Run Import Script

```bash
# Create output directory
mkdir -p sql_output

# Run the script
python scripts/import_performance_metrics.py
```

**Expected Output:**
```
🚀 Starting Performance Metrics Import
✅ Generated 129 NCN statements
✅ Generated 61 N2R statements
✅ Generated 62 Items statements
✅ SQL files generated
```

#### Step 2.3: Execute SQL

**Option A: Via Supabase CLI**
```bash
supabase db execute --file sql_output/insert_ncn_summary.sql --linked
supabase db execute --file sql_output/insert_n2r_summary.sql --linked
supabase db execute --file sql_output/insert_items_summary.sql --linked
```

**Option B: Via Supabase Dashboard**
1. Copy SQL from `sql_output/insert_ncn_summary.sql`
2. Paste in SQL Editor
3. Run
4. Repeat for N2R and Items

#### Step 2.4: Verify Import

```sql
-- Check row counts
SELECT COUNT(*) as ncn_count FROM ncn_summary;     -- Should be ~129
SELECT COUNT(*) as n2r_count FROM n2r_summary;     -- Should be ~61
SELECT COUNT(*) as items_count FROM items_summary; -- Should be ~62

-- Check sample data
SELECT * FROM ncn_summary LIMIT 5;
SELECT * FROM n2r_summary LIMIT 5;
SELECT * FROM items_summary LIMIT 5;

-- Check specific KAM
SELECT * FROM ncn_summary
WHERE kam_email = 'bhuwneshwari.dhouni@zomato.com';
```

✅ **Checkpoint:** Data imported successfully

---

### PHASE 3: Frontend Integration (2-3 hours)

#### Step 3.1: Create Type Definitions

**File:** `src/types/performanceMetrics.ts`

```typescript
export interface NCNSummary {
  kam_email: string;
  kam_name: string | null;
  tl_email: string | null;
  team: string | null;
  la_base_coverage: string | null;
  mm_base_coverage: string | null;
  um_base_coverage: string | null;
  la_stepper_coverage: string | null;
  mm_stepper_coverage: string | null;
  um_stepper_coverage: string | null;
  delta_la: string | null;
  delta_mm: string | null;
  delta_um: string | null;
  flash_sale_coverage: string | null;
  bogo_ov_coverage: string | null;
  overall_ov_coverage: string | null;
  overall_res_coverage: string | null;
  bogo_get150: string | null;
  bogo_take150: string | null;
  bogo_binge150: string | null;
  updated_at: string;
}

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

export interface ItemsSummary {
  kam_email: string;
  kam_name: string | null;
  tl_email: string | null;
  team: string | null;
  ov_coverage_baseline: string | null;
  ov_coverage_week_41: string | null;
  ov_coverage_week_42: string | null;
  ov_coverage_week_43: string | null;
  ov_coverage_week_44: string | null;
  ov_coverage_delta: string | null;
  ov_coverage_wow: string | null;
  items_count_baseline: string | null;
  items_count_week_41: string | null;
  items_count_week_42: string | null;
  items_count_week_43: string | null;
  items_count_week_44: string | null;
  items_count_delta: string | null;
  items_count_wow: string | null;
  updated_at: string;
}
```

#### Step 3.2: Create React Hooks

**File:** `src/hooks/usePerformanceMetrics.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { NCNSummary, N2RSummary, ItemsSummary } from "@/types/performanceMetrics";

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
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return data as NCNSummary;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5,
  });
}

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

#### Step 3.3: Update KAMAnalytics Page

**File:** `src/pages/KAMAnalytics.tsx`

Replace the existing mock data implementation with:

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KAMAnalytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ncn, n2r, items, isLoading, error } = usePerformanceMetrics(
    user?.email || ""
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Metrics</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/kam-hub")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to KAM Hub
          </Button>
          <h1 className="text-3xl font-bold">Performance Metrics</h1>
        </div>

        {/* Strategize Button - Placeholder */}
        <Button onClick={() => {
          console.log("Strategize clicked - functionality pending");
          alert("Strategize functionality coming soon!");
        }}>
          <Target className="w-4 h-4 mr-2" />
          Strategize Now
        </Button>
      </div>

      {/* NCN Drive Section */}
      <Card>
        <CardHeader>
          <CardTitle>📊 NCN Drive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {ncn.data ? (
            <div className="space-y-4">
              {/* Stepper/Base Coverage */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">LA Base</p>
                  <p className="text-2xl font-bold">{ncn.data.la_base_coverage || "N/A"}</p>
                  <p className="text-sm text-gray-600 mt-1">LA Stepper</p>
                  <p className="text-xl font-semibold">{ncn.data.la_stepper_coverage || "N/A"}</p>
                  <p className="text-xs text-gray-500 mt-1">{ncn.data.delta_la || ""}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">MM Base</p>
                  <p className="text-2xl font-bold">{ncn.data.mm_base_coverage || "N/A"}</p>
                  <p className="text-sm text-gray-600 mt-1">MM Stepper</p>
                  <p className="text-xl font-semibold">{ncn.data.mm_stepper_coverage || "N/A"}</p>
                  <p className="text-xs text-gray-500 mt-1">{ncn.data.delta_mm || ""}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">UM Base</p>
                  <p className="text-2xl font-bold">{ncn.data.um_base_coverage || "N/A"}</p>
                  <p className="text-sm text-gray-600 mt-1">UM Stepper</p>
                  <p className="text-xl font-semibold">{ncn.data.um_stepper_coverage || "N/A"}</p>
                  <p className="text-xs text-gray-500 mt-1">{ncn.data.delta_um || ""}</p>
                </div>
              </div>

              {/* Other Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Flash Sale</p>
                  <p className="text-xl font-bold">{ncn.data.flash_sale_coverage || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">BOGO OV</p>
                  <p className="text-xl font-bold">{ncn.data.bogo_ov_coverage || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Overall OV</p>
                  <p className="text-xl font-bold">{ncn.data.overall_ov_coverage || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Overall Res</p>
                  <p className="text-xl font-bold">{ncn.data.overall_res_coverage || "N/A"}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No NCN drive data available for your account</p>
          )}
        </CardContent>
      </Card>

      {/* N2R Drive Section */}
      <Card>
        <CardHeader>
          <CardTitle>📊 N2R Drive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {n2r.data ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">LA OV Conversion</p>
                <p className="text-2xl font-bold">{n2r.data.la_ov_conversion || "N/A"}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">MM OV Conversion</p>
                <p className="text-2xl font-bold">{n2r.data.mm_ov_conversion || "N/A"}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">UM OV Conversion</p>
                <p className="text-2xl font-bold">{n2r.data.um_ov_conversion || "N/A"}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No N2R drive data available for your account</p>
          )}
        </CardContent>
      </Card>

      {/* Items Drive Section */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Items Drive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {items.data ? (
            <div className="space-y-6">
              {/* OV Coverage */}
              <div>
                <h3 className="font-semibold mb-3">OV Coverage Trend</h3>
                <div className="grid grid-cols-7 gap-2">
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <p className="text-xs text-gray-600">Baseline</p>
                    <p className="text-sm font-bold">{items.data.ov_coverage_baseline || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">Week 41</p>
                    <p className="text-sm font-bold">{items.data.ov_coverage_week_41 || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">Week 42</p>
                    <p className="text-sm font-bold">{items.data.ov_coverage_week_42 || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">Week 43</p>
                    <p className="text-sm font-bold">{items.data.ov_coverage_week_43 || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">Week 44</p>
                    <p className="text-sm font-bold">{items.data.ov_coverage_week_44 || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded text-center">
                    <p className="text-xs text-gray-600">Delta</p>
                    <p className="text-sm font-bold">{items.data.ov_coverage_delta || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded text-center">
                    <p className="text-xs text-gray-600">WoW</p>
                    <p className="text-sm font-bold">{items.data.ov_coverage_wow || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Items Count */}
              <div>
                <h3 className="font-semibold mb-3">Items Count Trend</h3>
                <div className="grid grid-cols-7 gap-2">
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <p className="text-xs text-gray-600">Baseline</p>
                    <p className="text-sm font-bold">{items.data.items_count_baseline || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">Week 41</p>
                    <p className="text-sm font-bold">{items.data.items_count_week_41 || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">Week 42</p>
                    <p className="text-sm font-bold">{items.data.items_count_week_42 || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">Week 43</p>
                    <p className="text-sm font-bold">{items.data.items_count_week_43 || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">Week 44</p>
                    <p className="text-sm font-bold">{items.data.items_count_week_44 || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded text-center">
                    <p className="text-xs text-gray-600">Delta</p>
                    <p className="text-sm font-bold">{items.data.items_count_delta || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded text-center">
                    <p className="text-xs text-gray-600">WoW</p>
                    <p className="text-sm font-bold">{items.data.items_count_wow || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No Items drive data available for your account</p>
          )}
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Chart visualizations coming soon</p>
            <p className="text-gray-400 text-sm mt-2">Awaiting input on chart types and data to display</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

✅ **Checkpoint:** Frontend displays real data

---

### PHASE 4: Testing (1 hour)

#### Test Checklist

**Database Tests:**
```sql
-- Test 1: Verify all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('ncn_summary', 'n2r_summary', 'items_summary');

-- Test 2: Check row counts
SELECT
  (SELECT COUNT(*) FROM ncn_summary) as ncn_count,
  (SELECT COUNT(*) FROM n2r_summary) as n2r_count,
  (SELECT COUNT(*) FROM items_summary) as items_count;

-- Test 3: Check for NULL emails
SELECT COUNT(*) FROM ncn_summary WHERE kam_email IS NULL;
SELECT COUNT(*) FROM n2r_summary WHERE kam_email IS NULL;
SELECT COUNT(*) FROM items_summary WHERE kam_email IS NULL;

-- Test 4: Sample data check
SELECT * FROM ncn_summary LIMIT 3;
```

**Frontend Tests:**

1. **Login as KAM with all 3 drives**
   - Email: `bhuwneshwari.dhouni@zomato.com`
   - Expected: All 3 sections show data

2. **Check data accuracy**
   - Compare displayed values with CSV
   - Verify percentages match
   - Check delta indicators (▲/▼)

3. **Test loading states**
   - Refresh page
   - Should show loading spinner
   - Then display data

4. **Test error handling**
   - Temporarily break database connection
   - Should show error message

5. **Test responsive design**
   - Mobile view
   - Tablet view
   - Desktop view

✅ **Checkpoint:** All tests pass

---

## 🎉 SUCCESS CRITERIA

You've successfully completed the implementation when:

- [x] 3 database tables created
- [x] CSV data imported (129 + 61 + 62 rows)
- [x] React hooks fetch data correctly
- [x] KAMAnalytics page displays real metrics
- [x] All 3 drives show correctly
- [x] Data filtered by logged-in KAM
- [x] Loading/error states work
- [x] Responsive design works

---

## 🚨 TROUBLESHOOTING

### Problem: Tables not created
**Solution:** Check Supabase connection, verify SQL syntax

### Problem: Import script fails
**Solution:** Check CSV file paths, verify pandas installed

### Problem: Frontend shows "No data"
**Solution:** Verify KAM email exists in database, check React Query cache

### Problem: Data looks wrong
**Solution:** Check CSV column mapping, verify import script logic

---

## 📚 NEXT STEPS

After MVP is complete:

1. **Gather user feedback**
2. **Decide on chart types** (see `PERFORMANCE-METRICS-PENDING-INPUTS.md`)
3. **Define strategize functionality**
4. **Plan access control** for Zonal Heads

---

**Estimated Total Time:** 4-6 hours
**Difficulty:** Medium
**Prerequisites:** Database + React knowledge

**Good luck! 🚀**

# Business Trends Dashboard - Implementation Context

## 🎯 Purpose
This document maps all files, dependencies, and integration points for the **Business Trends Dashboard** feature. This is a **STANDALONE** implementation that can be safely integrated or removed without affecting the main system.

---

## 📂 File Structure & Mapping

### **Core Implementation Files** (Isolated - Safe to Remove)

#### 1. Page Component
```
src/pages/BusinessTrends.tsx
```
- **Purpose**: Main dashboard page component
- **Dependencies**: Only uses isolated business-trends components
- **Route**: `/business-trends`
- **Status**: Standalone, no dependencies on main system pages

#### 2. Type Definitions
```
src/types/businessTrends.ts
```
- **Purpose**: TypeScript interfaces for trends data
- **Exports**: 
  - `Quarter`, `MetricType`, `RestaurantDetails`
  - `QuarterlyData`, `GrowthComparison`, `MetricData`
  - `RestaurantMetrics`, `RestaurantTrendsData`
  - `ParsedGrowth`, `ChartDataPoint`, `ComparisonDataPoint`
  - `MetricMetadata`
- **Dependencies**: None
- **Status**: Completely isolated

#### 3. Utility Functions
```
src/utils/parseTrendsData.ts
```
- **Purpose**: CSV parser for business trends data
- **Exports**: 
  - `parseTrendsCSV()` - Main parser function
  - `parseGrowth()` - Growth string parser
  - `parseNumber()` - Number parser
  - `parseCSVLine()` - CSV line parser
- **Dependencies**: Only `src/types/businessTrends.ts`
- **Status**: Isolated utility

```
src/utils/metricMetadata.ts
```
- **Purpose**: Metric configuration and formatting
- **Exports**:
  - `METRIC_METADATA` - Configuration object
  - `QUARTER_LABELS` - Quarter display names
  - `formatLargeNumber()`, `formatCurrency()`, `formatPercentage()`
  - `getMetricMetadata()`, `getGrowthColor()`, `getGrowthBgColor()`
  - `getMetricChartColor()`
- **Dependencies**: Only `src/types/businessTrends.ts`
- **Status**: Isolated utility

#### 4. Component Library
```
src/components/business-trends/MetricOverviewCard.tsx
src/components/business-trends/QuarterlyTrendChart.tsx
src/components/business-trends/GrowthComparisonChart.tsx
src/components/business-trends/MultiMetricChart.tsx
```
- **Purpose**: Reusable visualization components
- **Dependencies**: 
  - Own types: `src/types/businessTrends.ts`
  - Own utils: `src/utils/parseTrendsData.ts`, `src/utils/metricMetadata.ts`
  - Shared UI: `@/components/ui/*` (shadcn/ui components)
  - External: `recharts`, `framer-motion`, `lucide-react`
- **Status**: Isolated to business-trends namespace

#### 5. Data File
```
public/business-trends-data.csv
```
- **Purpose**: Business trends data source
- **Original**: `new-files/Dashboard Context data Drives - Long Term Trends  (2).csv`
- **Format**: CSV with 6 restaurant details columns + 78 metric columns
- **Status**: Standalone data file

#### 6. Documentation
```
docs/features/BUSINESS-TRENDS-DASHBOARD.md
docs/BUSINESS-TRENDS-IMPLEMENTATION-CONTEXT.md (this file)
```
- **Purpose**: Feature documentation and implementation context
- **Status**: Documentation only

---

## 🔗 Integration Points (Main System Touch Points)

### **ONLY 1 File Modified in Main System**

#### App.tsx
```
src/App.tsx
```
**Changes Made:**
1. **Line 16**: Added import
   ```typescript
   import BusinessTrends from "./pages/BusinessTrends";
   ```

2. **Lines 82-89**: Added route
   ```typescript
   <Route
     path="/business-trends"
     element={
       <ProtectedRoute>
         <BusinessTrends />
       </ProtectedRoute>
     }
   />
   ```

**To Remove Integration:**
- Delete the import on line 16
- Delete the route block (lines 82-89)
- No other changes needed

---

## 📦 External Dependencies Used

### Already Installed (No New Dependencies)
- `recharts` - Chart library
- `framer-motion` - Animation library
- `lucide-react` - Icons
- `react-router-dom` - Routing
- `@radix-ui/react-*` - UI primitives (via shadcn/ui)

### Shared UI Components (From Main System)
```
@/components/ui/button
@/components/ui/card
@/components/ui/badge
@/components/ui/tabs
@/components/ui/select
@/components/DarkModeToggle
@/components/ProtectedRoute
```
**Note**: These are shared components. Business Trends uses them but doesn't modify them.

---

## 🎨 Styling & Theming

### Tailwind Classes Used
- Uses standard Tailwind utility classes
- Respects theme variables from main system:
  - `hsl(var(--background))`
  - `hsl(var(--foreground))`
  - `hsl(var(--primary))`
  - `hsl(var(--muted))`
  - `hsl(var(--border))`

### Custom Colors
- Growth indicators: `hsl(142, 76%, 36%)` (green), `hsl(0, 84%, 60%)` (red)
- Chart colors: Defined in `metricMetadata.ts`

**No modifications to global styles or theme files.**

---

## 🔍 Data Flow

```
CSV File (public/business-trends-data.csv)
    ↓
fetch() in BusinessTrends.tsx useEffect
    ↓
parseTrendsCSV() in parseTrendsData.ts
    ↓
RestaurantTrendsData[] state
    ↓
Components (MetricOverviewCard, Charts, etc.)
    ↓
Recharts visualization
```

**No database connections, no API calls, no backend integration.**

---

## 🚀 How to Integrate with Main System

### Option 1: Add Navigation Link
Add a link in your main navigation/sidebar:
```typescript
<Link to="/business-trends">Business Trends</Link>
```

### Option 2: Add to Restaurant Detail Page
In `src/pages/RestaurantDetail.tsx`, add a button:
```typescript
<Button onClick={() => navigate('/business-trends')}>
  View Long Term Trends
</Button>
```

### Option 3: Add to KAM Hub
In `src/pages/KAMHub.tsx`, add a card/link to access trends.

---

## 🗑️ How to Completely Remove

### Step 1: Delete Implementation Files
```bash
# Delete page
rm src/pages/BusinessTrends.tsx

# Delete components
rm -rf src/components/business-trends/

# Delete types
rm src/types/businessTrends.ts

# Delete utilities
rm src/utils/parseTrendsData.ts
rm src/utils/metricMetadata.ts

# Delete data
rm public/business-trends-data.csv

# Delete documentation
rm docs/features/BUSINESS-TRENDS-DASHBOARD.md
rm docs/BUSINESS-TRENDS-IMPLEMENTATION-CONTEXT.md
```

### Step 2: Remove from App.tsx
1. Remove import: `import BusinessTrends from "./pages/BusinessTrends";`
2. Remove route block (lines 82-89)

### Step 3: Verify
- No other files reference business-trends components
- No other files import from `src/types/businessTrends.ts`
- No other files use `parseTrendsData` or `metricMetadata` utilities

**That's it! Clean removal with zero impact on main system.**

---

## 📊 Metrics & Data Structure

### Six Metrics Tracked
1. **OV** - Order Volume (Number)
2. **CV** - Commissionable Value (Currency ₹)
3. **MVD** - Merchant Vouchered Discount (Currency ₹)
4. **ZVD** - Zomato Vouchered Discount (Currency ₹) - **REVERSED COLORS**
5. **ADS** - Advertisements (Currency ₹)
6. **CMPO** - Cost Margin Per Order (Currency ₹)

### Nine Quarters
JAS 23, OND 23, JFM 24, AMJ 24, JAS 24, OND 24, JFM 25, AMJ 25, JAS 25

### Four Growth Comparisons
- QoQ Growth% (Quarter on Quarter)
- JAS 25 vs JAS 24 (Year over Year)
- JAS 25 vs JAS 23 (2 Year)
- Jan to Sept 25 vs Jan to Sept 24 (Year to Date)

---

## ⚠️ Important Notes

### ZVD Special Handling
- **ZVD (Zomato Vouchered Discount)** has reversed color logic
- Increase = RED (bad for business)
- Decrease = GREEN (good for business)
- Implemented in `parseGrowth()` and color utility functions

### CSV Format
- 85 total columns
- Columns 1-6: Restaurant details
- Column 7: Empty separator
- Columns 8-85: Metrics data (13 columns × 6 metrics)
- Each metric: 9 quarterly values + 4 growth comparisons

### Performance
- Client-side CSV parsing (runs once on mount)
- All data loaded into memory
- No pagination needed (small dataset)
- Charts render efficiently with Recharts

---

## 🔐 Security & Access

### Authentication
- Protected by `<ProtectedRoute>` wrapper
- Requires user to be logged in
- Uses existing auth system from main application

### Data Access
- CSV file is public (in `/public` folder)
- No sensitive data exposure
- Read-only implementation

---

## 🎯 Future Integration Possibilities

### Database Integration
Replace CSV loading with API call:
```typescript
// In BusinessTrends.tsx, replace fetch with:
const response = await fetch('/api/business-trends');
const data = await response.json();
```

### Restaurant-Specific View
Pass restaurant ID from RestaurantDetail page:
```typescript
<Route path="/business-trends/:resId" element={...} />
```

### KAM Filtering
Filter data by logged-in KAM's email (similar to Performance Metrics page)

### Export Functionality
Add Excel/PDF export buttons using libraries like `xlsx` or `jspdf`

---

## ✅ Testing Checklist

- [ ] Page loads without errors
- [ ] CSV data parses correctly
- [ ] All 6 metrics display properly
- [ ] Charts render with correct data
- [ ] Growth indicators show correct colors
- [ ] ZVD shows reversed colors (red for increase)
- [ ] Dark mode works correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations are smooth
- [ ] Tooltips show correct information
- [ ] Restaurant selector works
- [ ] Tab switching works
- [ ] Metric selector buttons work

---

## 📝 Version Info

- **Created**: 2025-11-18
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Status**: Standalone, Production-Ready

---

## 👥 Maintenance

### To Update Data
Replace `public/business-trends-data.csv` with new CSV file (same format)

### To Add New Metrics
1. Update `MetricType` in `businessTrends.ts`
2. Add metadata in `metricMetadata.ts`
3. Update parser column indices in `parseTrendsData.ts`
4. Add to `allMetrics` array in `BusinessTrends.tsx`

### To Add New Quarters
- CSV parser automatically handles new quarters
- Update `Quarter` type in `businessTrends.ts` if needed
- Add to `QUARTER_LABELS` in `metricMetadata.ts`

---

**END OF CONTEXT DOCUMENT**


# Business Trends Dashboard

## Overview
The Business Trends Dashboard is a standalone page that visualizes long-term business performance trends for restaurants across multiple quarters. It provides comprehensive insights into 6 key business metrics over 9 quarters with growth comparisons.

## Access
- **Route**: `/business-trends`
- **URL**: `http://localhost:8080/business-trends`
- **Authentication**: Protected route (requires login)

## Features

### 1. Restaurant Selection
- Dropdown selector to choose from all available restaurants
- Displays restaurant details:
  - Primary Cuisine
  - Location (Subzone, Zone)
  - Account Manager

### 2. Six Key Metrics

#### OV (Order Volume)
- **Description**: Number of Orders
- **Color Coding**: Green ↑ (increase is good), Red ↓ (decrease is bad)

#### CV (Commissionable Value)
- **Description**: Net Revenue of Merchant
- **Format**: Currency (₹)
- **Color Coding**: Green ↑ (increase is good), Red ↓ (decrease is bad)

#### MVD (Merchant Vouchered Discount)
- **Description**: Discount given by Merchant/Restaurant
- **Format**: Currency (₹)
- **Color Coding**: Green ↑ (increase is good), Red ↓ (decrease is bad)

#### ZVD (Zomato Vouchered Discount)
- **Description**: Discount given by Zomato
- **Format**: Currency (₹)
- **Color Coding**: **REVERSED** - Red ↑ (increase is bad), Green ↓ (decrease is good)

#### ADS (Advertisements)
- **Description**: Amount of Advertisements by Restaurant
- **Format**: Currency (₹)
- **Color Coding**: Green ↑ (increase is good), Red ↓ (decrease is bad)

#### CMPO (Cost Margin Per Order)
- **Description**: Amount Zomato earned after all costs per order
- **Format**: Currency (₹)
- **Color Coding**: Green ↑ (increase is good), Red ↓ (decrease is bad)

### 3. Nine Quarters of Data
- JAS 23 (Q3 2023)
- OND 23 (Q4 2023)
- JFM 24 (Q1 2024)
- AMJ 24 (Q2 2024)
- JAS 24 (Q3 2024)
- OND 24 (Q4 2024)
- JFM 25 (Q1 2025)
- AMJ 25 (Q2 2025)
- JAS 25 (Q3 2025)

### 4. Growth Comparisons
Each metric includes 4 growth comparison metrics:
- **QoQ Growth%**: Quarter on Quarter (JAS 25 vs AMJ 25)
- **YoY Growth**: JAS 25 vs JAS 24
- **2Y Growth**: JAS 25 vs JAS 23
- **YTD Growth**: Jan to Sept 25 vs Jan to Sept 24

### 5. Visualizations

#### Metrics Overview Cards
- Grid of 6 cards showing current values (Q3 2025)
- QoQ and YoY growth indicators with color coding
- Animated entry with staggered delays

#### Individual Metric Analysis Tab
- **Quarterly Trend Chart**: Area/Line chart showing metric values across all 9 quarters
- **Growth Comparison Chart**: Bar chart comparing all 4 growth metrics
- Metric selector buttons to switch between metrics

#### Multi-Metric Comparison Tab
- **OV vs CV**: Order Volume compared with Commissionable Value
- **MVD vs ZVD**: Merchant Discount compared with Zomato Discount
- **ADS vs CMPO**: Advertisements compared with Cost Margin Per Order
- All charts show trends across all quarters

## Technical Implementation

### File Structure
```
src/
├── pages/
│   └── BusinessTrends.tsx              # Main dashboard page
├── components/
│   └── business-trends/
│       ├── MetricOverviewCard.tsx      # Metric summary card
│       ├── QuarterlyTrendChart.tsx     # Time series chart
│       ├── GrowthComparisonChart.tsx   # Growth bar chart
│       └── MultiMetricChart.tsx        # Multi-line comparison
├── types/
│   └── businessTrends.ts               # TypeScript interfaces
└── utils/
    ├── parseTrendsData.ts              # CSV parser
    └── metricMetadata.ts               # Metric configuration
```

### Data Source
- **File**: `public/business-trends-data.csv`
- **Format**: CSV with restaurant details and quarterly metrics
- **Loading**: Client-side fetch on component mount

### Technologies Used
- **Charts**: Recharts (Area, Line, Bar charts)
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui (Card, Tabs, Select, Badge, Button)
- **Styling**: Tailwind CSS
- **State Management**: React useState/useEffect

### Key Features
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth animations and transitions
- Interactive tooltips on charts
- Color-coded growth indicators
- Metric-specific formatting (currency, numbers, percentages)

## Usage

1. Navigate to `/business-trends`
2. Select a restaurant from the dropdown
3. View the metrics overview cards showing current performance
4. Switch between tabs:
   - **Individual Metrics**: Analyze one metric at a time with detailed charts
   - **Multi-Metric Comparison**: Compare related metrics side-by-side
5. Hover over charts for detailed tooltips
6. Use the metric selector buttons to switch between different metrics

## Future Enhancements
- Export data to Excel/PDF
- Custom date range selection
- Comparison between multiple restaurants
- Predictive analytics and forecasting
- Integration with live database instead of CSV
- Filters by zone, cuisine, or account manager


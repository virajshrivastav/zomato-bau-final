/**
 * Business Trends Types
 * Types for Long Term Business Trends Dashboard
 */

// Quarter identifiers
export type Quarter =
  | "JAS 23"
  | "OND 23"
  | "JFM 24"
  | "AMJ 24"
  | "JAS 24"
  | "OND 24"
  | "JFM 25"
  | "AMJ 25"
  | "JAS 25";

// Metric types
export type MetricType = "OV" | "CV" | "MVD" | "ZVD" | "ADS" | "CMPO";

// Restaurant details
export interface RestaurantDetails {
  res_id: string;
  res_name: string;
  primary_cuisine: string;
  subzone: string;
  zone: string;
  account_manager: string;
}

// Quarterly data for a single metric
export interface QuarterlyData {
  "JAS 23": number;
  "OND 23": number;
  "JFM 24": number;
  "AMJ 24": number;
  "JAS 24": number;
  "OND 24": number;
  "JFM 25": number;
  "AMJ 25": number;
  "JAS 25": number;
}

// Growth comparison data
export interface GrowthComparison {
  jas25_vs_jas24: string; // e.g., "↑ 9.6%" or "↓ 4.5%"
  jas25_vs_jas23: string;
  jan_sept_25_vs_24: string;
  qoq_growth: string; // Quarter on Quarter
}

// Complete metric data (quarterly + growth)
export interface MetricData {
  quarterly: QuarterlyData;
  growth: GrowthComparison;
}

// All metrics for a restaurant
export interface RestaurantMetrics {
  OV: MetricData;
  CV: MetricData;
  MVD: MetricData;
  ZVD: MetricData;
  ADS: MetricData;
  CMPO: MetricData;
}

// Complete restaurant business trends data
export interface RestaurantTrendsData {
  restaurant: RestaurantDetails;
  metrics: RestaurantMetrics;
}

// Parsed growth value with direction
export interface ParsedGrowth {
  value: number; // Numeric value (e.g., 9.6)
  direction: "up" | "down" | "neutral"; // Growth direction
  formatted: string; // Original formatted string
  isPositive: boolean; // Whether this is good (depends on metric)
}

// Chart data point for time series
export interface ChartDataPoint {
  quarter: Quarter;
  value: number;
  label: string; // Short label for display
}

// Comparison chart data
export interface ComparisonDataPoint {
  name: string;
  value: number;
  isPositive: boolean;
}

// Metric metadata
export interface MetricMetadata {
  key: MetricType;
  label: string;
  description: string;
  unit: string;
  reverseColors: boolean; // true for ZVD (red when up, green when down)
  format: (value: number) => string;
}

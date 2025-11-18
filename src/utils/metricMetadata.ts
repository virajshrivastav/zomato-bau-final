/**
 * Metric Metadata Configuration
 * Defines display properties and formatting for each business metric
 */

import { MetricType, MetricMetadata } from "@/types/businessTrends";

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

/**
 * Format currency (Indian Rupees)
 */
export function formatCurrency(value: number): string {
  return `₹${formatLargeNumber(value)}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Metric metadata configuration
 */
export const METRIC_METADATA: Record<MetricType, MetricMetadata> = {
  OV: {
    key: "OV",
    label: "Order Volume",
    description: "Number of Orders",
    unit: "orders",
    reverseColors: false,
    format: (value: number) => formatLargeNumber(value),
  },
  CV: {
    key: "CV",
    label: "Commissionable Value",
    description: "Net Revenue of Merchant",
    unit: "₹",
    reverseColors: false,
    format: formatCurrency,
  },
  MVD: {
    key: "MVD",
    label: "Merchant Vouchered Discount",
    description: "Discount given by Merchant/Restaurant",
    unit: "₹",
    reverseColors: false,
    format: formatCurrency,
  },
  ZVD: {
    key: "ZVD",
    label: "Zomato Vouchered Discount",
    description: "Discount given by Zomato",
    unit: "₹",
    reverseColors: true, // RED when increased, GREEN when decreased
    format: formatCurrency,
  },
  ADS: {
    key: "ADS",
    label: "Advertisements",
    description: "Amount of Advertisements by Restaurant",
    unit: "₹",
    reverseColors: false,
    format: formatCurrency,
  },
  CMPO: {
    key: "CMPO",
    label: "Cost Margin Per Order",
    description: "Amount Zomato earned after all costs per order",
    unit: "₹",
    reverseColors: false,
    format: (value: number) => `₹${value.toFixed(0)}`,
  },
};

/**
 * Get metric metadata
 */
export function getMetricMetadata(metricType: MetricType): MetricMetadata {
  return METRIC_METADATA[metricType];
}

/**
 * Get color for growth indicator
 */
export function getGrowthColor(isPositive: boolean, reverseColors: boolean = false): string {
  const actualPositive = reverseColors ? !isPositive : isPositive;
  return actualPositive ? "text-green-600" : "text-red-600";
}

/**
 * Get background color for growth indicator
 */
export function getGrowthBgColor(isPositive: boolean, reverseColors: boolean = false): string {
  const actualPositive = reverseColors ? !isPositive : isPositive;
  return actualPositive ? "bg-green-50" : "bg-red-50";
}

/**
 * Get chart color for metric
 */
export function getMetricChartColor(metricType: MetricType): string {
  const colors: Record<MetricType, string> = {
    OV: "hsl(var(--chart-1))", // Blue
    CV: "hsl(var(--chart-2))", // Green
    MVD: "hsl(var(--chart-3))", // Orange
    ZVD: "hsl(var(--chart-4))", // Purple
    ADS: "hsl(var(--chart-5))", // Pink
    CMPO: "hsl(220, 70%, 50%)", // Custom blue
  };
  return colors[metricType];
}

/**
 * Quarter labels for display
 */
export const QUARTER_LABELS: Record<string, string> = {
  "JAS 23": "Q3'23",
  "OND 23": "Q4'23",
  "JFM 24": "Q1'24",
  "AMJ 24": "Q2'24",
  "JAS 24": "Q3'24",
  "OND 24": "Q4'24",
  "JFM 25": "Q1'25",
  "AMJ 25": "Q2'25",
  "JAS 25": "Q3'25",
};

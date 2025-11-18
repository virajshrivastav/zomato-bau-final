/**
 * Parse Business Trends CSV Data
 * Utility to parse and transform the Long Term Business Trends CSV file
 */

import {
  RestaurantTrendsData,
  RestaurantDetails,
  MetricData,
  QuarterlyData,
  GrowthComparison,
  ParsedGrowth,
  MetricType,
} from "@/types/businessTrends";

/**
 * Parse a CSV line into fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Parse growth string (e.g., "↑ 9.6%" or "↓ 4.5%")
 */
export function parseGrowth(growthStr: string, metricType: MetricType): ParsedGrowth {
  const cleaned = growthStr.trim();
  const isUp = cleaned.includes("↑") || cleaned.includes("â²");
  const isDown = cleaned.includes("↓") || cleaned.includes("â¼");

  // Extract numeric value
  const numMatch = cleaned.match(/[-+]?\d+\.?\d*/);
  const value = numMatch ? parseFloat(numMatch[0]) : 0;

  const direction = isUp ? "up" : isDown ? "down" : "neutral";

  // For ZVD, reverse the positive/negative logic
  const isPositive = metricType === "ZVD" ? direction === "down" : direction === "up";

  return {
    value,
    direction,
    formatted: cleaned,
    isPositive,
  };
}

/**
 * Parse number from string (handles empty strings)
 */
function parseNumber(str: string): number {
  const cleaned = str.replace(/,/g, "").trim();
  return cleaned === "" ? 0 : parseFloat(cleaned) || 0;
}

/**
 * Parse CSV file content into structured data
 */
export function parseTrendsCSV(csvContent: string): RestaurantTrendsData[] {
  const lines = csvContent.split("\n").filter((line) => line.trim());

  if (lines.length < 3) {
    throw new Error("Invalid CSV format: insufficient lines");
  }

  // Skip header rows (first 2 lines)
  const dataLines = lines.slice(2);

  return dataLines.map((line) => {
    const fields = parseCSVLine(line);

    // Restaurant details (columns 0-5)
    const restaurant: RestaurantDetails = {
      res_id: fields[0] || "",
      res_name: fields[1] || "",
      primary_cuisine: fields[2] || "",
      subzone: fields[3] || "",
      zone: fields[4] || "",
      account_manager: fields[5] || "",
    };

    // Helper to extract metric data
    const extractMetric = (startIdx: number, metricType: MetricType): MetricData => {
      const quarterly: QuarterlyData = {
        "JAS 23": parseNumber(fields[startIdx]),
        "OND 23": parseNumber(fields[startIdx + 1]),
        "JFM 24": parseNumber(fields[startIdx + 2]),
        "AMJ 24": parseNumber(fields[startIdx + 3]),
        "JAS 24": parseNumber(fields[startIdx + 4]),
        "OND 24": parseNumber(fields[startIdx + 5]),
        "JFM 25": parseNumber(fields[startIdx + 6]),
        "AMJ 25": parseNumber(fields[startIdx + 7]),
        "JAS 25": parseNumber(fields[startIdx + 8]),
      };

      const growth: GrowthComparison = {
        jas25_vs_jas24: fields[startIdx + 9] || "",
        jas25_vs_jas23: fields[startIdx + 10] || "",
        jan_sept_25_vs_24: fields[startIdx + 11] || "",
        qoq_growth: fields[startIdx + 12] || "",
      };

      return { quarterly, growth };
    };

    // Extract all metrics (each metric has 13 columns: 9 quarters + 4 growth)
    // Column layout: 6 restaurant details + 1 empty + (13 * 6 metrics)
    const metrics = {
      OV: extractMetric(7, "OV"), // Start at column 7
      CV: extractMetric(21, "CV"), // 7 + 14 (13 + 1 empty)
      MVD: extractMetric(35, "MVD"), // 21 + 14
      ZVD: extractMetric(49, "ZVD"), // 35 + 14
      ADS: extractMetric(63, "ADS"), // 49 + 14
      CMPO: extractMetric(77, "CMPO"), // 63 + 14
    };

    return {
      restaurant,
      metrics,
    };
  });
}

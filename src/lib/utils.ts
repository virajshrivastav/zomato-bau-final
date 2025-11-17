import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Automatically determines badge variant based on performance score
 * @param value - Performance score (number or string with %, ₹, K, etc.)
 * @returns Badge variant type
 */
export function getPerformanceBadgeVariant(
  value: number | string
): "success" | "warning" | "danger" | "neutral" {
  // Convert string values to numbers
  let numValue: number;

  if (typeof value === "string") {
    // Remove common suffixes and prefixes
    const cleanValue = value
      .replace("%", "")
      .replace("₹", "")
      .replace("K", "")
      .replace("k", "")
      .replace(",", "")
      .trim();

    numValue = parseFloat(cleanValue);

    // If parsing failed, return neutral
    if (isNaN(numValue)) {
      return "neutral";
    }
  } else {
    numValue = value;
  }

  // Determine variant based on score thresholds
  if (numValue >= 80) return "success";
  if (numValue >= 60) return "warning";
  if (numValue >= 40) return "danger";
  return "neutral";
}

/**
 * Determines badge variant based on relative position within a group of values
 * Highest = green, middle = yellow, lowest = red
 * @param value - Current value to evaluate
 * @param allValues - Array of all values in the group to compare against
 * @returns Badge variant type
 */
export function getRelativePerformanceBadgeVariant(
  value: number,
  allValues: number[]
): "success" | "warning" | "danger" | "neutral" {
  if (allValues.length === 0) return "neutral";
  if (allValues.length === 1) return "success";

  const sortedValues = [...allValues].sort((a, b) => b - a); // Sort descending
  const max = sortedValues[0];
  const min = sortedValues[sortedValues.length - 1];

  // If all values are the same
  if (max === min) return "warning";

  // Calculate thresholds
  const range = max - min;
  const upperThreshold = max - range * 0.33; // Top 33%
  const lowerThreshold = min + range * 0.33; // Bottom 33%

  if (value >= upperThreshold) return "success"; // Green for highest
  if (value <= lowerThreshold) return "danger"; // Red for lowest
  return "warning"; // Yellow for middle
}

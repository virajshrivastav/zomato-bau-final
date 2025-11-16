/**
 * Parses NCN base code text format to extract percentage and max amount values
 *
 * Expected format: "[NUMBER] upto [NUMBER]"
 * Example: "40 upto 80" → { percentage: 40, maxAmount: 80 }
 *
 * Display format: "40% upto 80rs"
 *
 * @param text - The base code text from CSV (e.g., "40 upto 80")
 * @returns Object with percentage and maxAmount values, or null if parsing fails
 */
export function parseBaseCode(text: string | null): {
  percentage: number;
  maxAmount: number;
} | null {
  // Handle null, undefined, or empty string
  if (!text) {
    console.warn("⚠️ parseBaseCode: Received null/empty value");
    return null;
  }

  // Handle "NULL" string from database
  if (text.trim().toUpperCase() === "NULL") {
    console.warn('⚠️ parseBaseCode: Received "NULL" string');
    return null;
  }

  // Try to match the pattern: "40 upto 80" or "40% upto 80rs" (already formatted)
  const match = text.match(/(\d+)\s*%?\s*upto\s*(\d+)\s*rs?/i);

  if (!match) {
    console.warn("⚠️ parseBaseCode: Failed to parse:", text);
    return null;
  }

  const result = {
    percentage: parseInt(match[1], 10),
    maxAmount: parseInt(match[2], 10),
  };

  console.log("✅ parseBaseCode: Successfully parsed:", text, "→", result);
  return result;
}

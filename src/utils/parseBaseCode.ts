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
  if (!text) return null;
  
  const match = text.match(/(\d+)\s*upto\s*(\d+)/i);
  
  if (!match) return null;
  
  return {
    percentage: parseInt(match[1], 10),
    maxAmount: parseInt(match[2], 10),
  };
}


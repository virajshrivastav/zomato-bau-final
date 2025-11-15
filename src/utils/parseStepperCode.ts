/**
 * Parses NCN stepper code text format to extract flatOff and MOV values
 *
 * Expected format: "[NUMBER] off at mov [NUMBER]"
 * Example: "100 off at mov 249" → { flatOff: 100, mov: 249 }
 *
 * @param text - The stepper code text from CSV (e.g., "100 off at mov 249")
 * @returns Object with flatOff and mov values, or null if parsing fails
 */
export function parseStepperCode(text: string | null): {
  flatOff: number;
  mov: number;
} | null {
  if (!text) return null;

  const match = text.match(/(\d+)\s*off\s*at\s*mov\s*(\d+)/i);

  if (!match) return null;

  return {
    flatOff: parseInt(match[1], 10),
    mov: parseInt(match[2], 10),
  };
}

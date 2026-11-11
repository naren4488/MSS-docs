/** Digits only — "+91 98290-12345" → "919829012345". */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Client search: matches the name (text), or — when the query has 3+ digits —
 * any of the number cells (mobile, K number) ignoring spaces, dashes, "+91" and "/".
 */
export function rowMatchesClientSearch(
  query: string,
  nameCell: string,
  numberCells: readonly string[],
): boolean {
  const text = query.trim().toLowerCase();
  if (!text) return true;
  if (nameCell.toLowerCase().includes(text)) return true;
  const digits = digitsOnly(text);
  if (digits.length < 3) return false;
  const wanted = digits.length > 10 && digits.startsWith("91") ? digits.slice(2) : digits;
  return numberCells.some((cell) => digitsOnly(cell).includes(wanted));
}

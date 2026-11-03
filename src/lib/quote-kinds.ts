/** What a quote request is for; shared by the form, the action and the pages that preset it. */
export const QUOTE_KINDS = [
  ["bulk", "Bulk order (10+ cases)"],
  ["sample", "Sample pack"],
  ["printing", "Custom printing"],
] as const;
export type QuoteKind = (typeof QUOTE_KINDS)[number][0];

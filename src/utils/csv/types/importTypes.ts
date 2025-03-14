
/**
 * Result of a trade import operation
 */
export type ImportResult = {
  results: any[];
  errors: Array<{ trade: Record<string, any>; error: string }>;
};

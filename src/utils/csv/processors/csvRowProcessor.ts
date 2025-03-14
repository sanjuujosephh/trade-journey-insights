
import { processField } from "./fieldProcessors";

/**
 * Processes a raw CSV row into a trade object
 * @param row The CSV data row
 * @param headers The CSV header row
 * @returns Processed trade object
 */
export function processCsvRow(row: string[], headers: string[]): Record<string, any> {
  const trade: Record<string, any> = {};
  
  headers.forEach((header, index) => {
    if (header && row[index] !== undefined) {
      trade[header] = processField(header, row[index]);
    }
  });
  
  // Add timestamp if not present
  if (!trade.timestamp) {
    trade.timestamp = new Date().toISOString();
  }

  // Ensure required fields have default values
  trade.outcome = trade.outcome || 'breakeven';
  trade.trade_type = trade.trade_type || 'options';
  trade.symbol = trade.symbol || 'UNKNOWN';
  
  return trade;
}

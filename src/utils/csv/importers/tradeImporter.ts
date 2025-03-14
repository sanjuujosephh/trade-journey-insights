
import { processCsvRow } from "../processors/csvRowProcessor";
import { insertTrade } from "../database/tradeInserter";
import { ImportResult } from "../types/importTypes";

/**
 * Processes and imports CSV data into the trades database
 * @param csvData The raw CSV data array
 * @returns Results of the import operation
 */
export async function processAndImportTrades(csvData: Array<Array<string>>): Promise<ImportResult> {
  // Extract headers from the first row
  const headers = csvData[0];
  
  // Process the rows (skip header row)
  const processedTrades = csvData.slice(1)
    .map(row => processCsvRow(row, headers))
    .filter(trade => trade.entry_price); // Only require entry_price to be valid
  
  console.log('Processed trades ready for insertion:', processedTrades);
  
  // Insert trades one by one to better handle errors
  const results: any[] = [];
  const errors: Array<{ trade: Record<string, any>; error: string }> = [];
  
  for (const trade of processedTrades) {
    const { success, error } = await insertTrade(trade);
    
    if (!success && error) {
      errors.push({ trade, error });
    } else {
      results.push(trade);
    }
  }
  
  return { results, errors };
}

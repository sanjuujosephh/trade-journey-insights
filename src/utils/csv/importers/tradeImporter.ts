
import { supabase } from "@/lib/supabase";
import { processField } from "../processors/fieldProcessors";

type ImportResult = {
  results: any[];
  errors: Array<{ trade: Record<string, any>; error: string }>;
};

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

/**
 * Inserts a processed trade into the database
 * @param trade The processed trade object
 * @returns Result of the insert operation
 */
export async function insertTrade(trade: Record<string, any>): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .insert([trade]);
      
    if (error) {
      console.error('Error inserting trade:', error, trade);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Exception when inserting trade:', err);
    return { success: false, error: errorMessage };
  }
}

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

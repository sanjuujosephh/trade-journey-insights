
import { supabase } from "@/lib/supabase";
import { Trade } from "@/types/trade";

/**
 * Processes raw CSV data for import into the trades database
 */
export async function processAndImportTrades(csvData: Array<Array<string>>): Promise<{ 
  results: any[], 
  errors: Array<{ trade: Record<string, any>, error: string }> 
}> {
  // Extract headers from the first row
  const headers = csvData[0];
  
  // Process the rows (skip header row)
  const processedTrades = csvData.slice(1).map(row => {
    const trade: Record<string, any> = {};
    
    // Map each cell to its corresponding header
    headers.forEach((header, index) => {
      if (header && row[index] !== undefined) {
        // Special handling for time fields to prevent database errors
        if (['entry_time', 'exit_time'].includes(header)) {
          // Store only HH:MM:SS format without AM/PM
          let timeValue = row[index];
          if (timeValue) {
            // Remove AM/PM indicators completely
            timeValue = timeValue.replace(/\s?[AP]M$/i, '').trim();
            
            // Ensure the time has seconds (HH:MM:SS)
            if (timeValue.split(':').length === 2) {
              timeValue = `${timeValue}:00`;
            }
            
            // Type the empty string as null for the database
            trade[header] = timeValue || null;
          } else {
            trade[header] = null;
          }
        }
        // Handle date fields
        else if (['entry_date', 'exit_date'].includes(header)) {
          // Store dates as is - they'll be processed as strings
          trade[header] = row[index] || null;
        }
        // Convert numeric values
        else if (
          ['entry_price', 'exit_price', 'quantity', 'stop_loss', 'vix', 
           'call_iv', 'put_iv', 'confidence_level', 'strike_price',
           'emotional_score', 'confidence_level_score'].includes(header)
        ) {
          const num = parseFloat(row[index]);
          trade[header] = isNaN(num) ? null : num;
        } 
        // Handle the analysis_count as an integer
        else if (header === 'analysis_count') {
          const num = parseInt(row[index], 10);
          trade[header] = isNaN(num) ? 0 : num;
        }
        else {
          trade[header] = row[index] || null;
        }
      }
    });
    
    // Add timestamp if not present
    if (!trade.timestamp) {
      trade.timestamp = new Date().toISOString();
    }
    
    return trade;
  }).filter(trade => trade.symbol && trade.entry_price); // Filter out incomplete rows
  
  console.log('Processed trades ready for insertion:', processedTrades);
  
  // Insert trades one by one to better handle errors
  const results: any[] = [];
  const errors: Array<{ trade: Record<string, any>, error: string }> = [];
  
  for (const trade of processedTrades) {
    try {
      const { data, error } = await supabase
        .from('trades')
        .insert([trade]);
        
      if (error) {
        console.error('Error inserting trade:', error, trade);
        errors.push({ trade, error: error.message });
      } else {
        results.push(trade);
      }
    } catch (err) {
      console.error('Exception when inserting trade:', err);
      errors.push({ trade, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
  
  return { results, errors };
}

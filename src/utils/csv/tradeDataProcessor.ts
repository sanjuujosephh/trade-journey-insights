
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
        // Handle enum fields that might have constraints
        else if (header === 'market_condition') {
          // Handle market_condition field to prevent constraint violation
          const validConditions = ['trending', 'ranging', 'news_driven', 'volatile'];
          const value = row[index]?.toLowerCase();
          trade[header] = validConditions.includes(value) ? value : null;
        }
        else if (header === 'option_type') {
          // Handle option_type field
          const validTypes = ['call', 'put'];
          const value = row[index]?.toLowerCase();
          trade[header] = validTypes.includes(value) ? value : null;
        }
        else if (header === 'trade_direction') {
          // Handle trade_direction field
          const validDirections = ['long', 'short'];
          const value = row[index]?.toLowerCase();
          trade[header] = validDirections.includes(value) ? value : null;
        }
        else if (header === 'exit_reason') {
          // Handle exit_reason field
          const validReasons = ['stop_loss', 'target', 'manual', 'time_based'];
          const value = row[index]?.toLowerCase();
          trade[header] = validReasons.includes(value) ? value : null;
        }
        else if (header === 'entry_emotion') {
          // Handle entry_emotion field
          const validEmotions = ['fear', 'greed', 'fomo', 'revenge', 'neutral', 'confident'];
          const value = row[index]?.toLowerCase();
          trade[header] = validEmotions.includes(value) ? value : null;
        }
        else if (header === 'exit_emotion') {
          // Handle exit_emotion field
          const validEmotions = ['satisfied', 'regretful', 'relieved', 'frustrated'];
          const value = row[index]?.toLowerCase();
          trade[header] = validEmotions.includes(value) ? value : null;
        }
        else if (header === 'timeframe') {
          // Handle timeframe field
          const validTimeframes = ['1min', '5min', '15min', '1hr'];
          const value = row[index]?.toLowerCase();
          trade[header] = validTimeframes.includes(value) ? value : null;
        }
        else if (header === 'vwap_position' || header === 'ema_position') {
          // Handle position indicator fields
          const validPositions = header === 'vwap_position' 
            ? ['above_vwap', 'below_vwap'] 
            : ['above_20ema', 'below_20ema'];
          const value = row[index]?.toLowerCase();
          trade[header] = validPositions.includes(value) ? value : null;
        }
        else if (header === 'outcome') {
          // Handle outcome field - this is required so provide a default
          const validOutcomes = ['profit', 'loss', 'breakeven'];
          const value = row[index]?.toLowerCase();
          trade[header] = validOutcomes.includes(value) ? value : 'breakeven';
        }
        else if (header === 'trade_type') {
          // Handle trade_type field - this is required
          const validTypes = ['options', 'stocks', 'futures', 'forex', 'crypto'];
          const value = row[index]?.toLowerCase();
          trade[header] = validTypes.includes(value) ? value : 'options'; // Default to options
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

    // Ensure required fields have default values
    trade.outcome = trade.outcome || 'breakeven';
    trade.trade_type = trade.trade_type || 'options';
    trade.symbol = trade.symbol || 'UNKNOWN';
    
    return trade;
  }).filter(trade => trade.entry_price); // Only require entry_price to be valid
  
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

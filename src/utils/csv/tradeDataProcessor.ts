
import { supabase } from "@/lib/supabase";
import { Trade } from "@/types/trade";

/**
 * Converts various date formats to the application's standard DD-MM-YYYY format
 * @param dateStr The date string to convert
 * @returns Formatted date string or null if invalid
 */
function standardizeDateFormat(dateStr: string): string | null {
  if (!dateStr) return null;
  
  // Try to determine the format and standardize it
  
  // Check if it's already in DD-MM-YYYY format
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
    return dateStr; // Already in correct format
  }
  
  // Try MM/DD/YYYY format (common in US)
  const mmddyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyyMatch) {
    const [, month, day, year] = mmddyyyyMatch;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
  
  // Try YYYY-MM-DD format (ISO format)
  const yyyymmddMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyymmddMatch) {
    const [, year, month, day] = yyyymmddMatch;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
  
  // Try DD/MM/YYYY format
  const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
  
  // Try to parse with Date object as last resort
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  } catch (e) {
    console.warn(`Could not parse date: ${dateStr}`);
  }
  
  return null; // Return null if we can't parse the date
}

/**
 * Standardizes time formats to HH:MM format (24-hour format)
 * @param timeStr The time string to convert
 * @returns Formatted time string or null if invalid
 */
function standardizeTimeFormat(timeStr: string): string | null {
  if (!timeStr) return null;
  
  // Remove AM/PM indicators and trim
  let cleanedTime = timeStr.replace(/\s?[AP]M$/i, '').trim();
  
  // Check if it's already in HH:MM or HH:MM:SS format
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(cleanedTime)) {
    // Extract hours and minutes
    const parts = cleanedTime.split(':');
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');
    
    // Return in HH:MM format
    return `${hours}:${minutes}`;
  }
  
  // Try to parse with Date object as last resort
  try {
    // Create a dummy date with the time
    const dummyDate = new Date(`2000-01-01T${timeStr}`);
    if (!isNaN(dummyDate.getTime())) {
      const hours = dummyDate.getHours().toString().padStart(2, '0');
      const minutes = dummyDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  } catch (e) {
    console.warn(`Could not parse time: ${timeStr}`);
  }
  
  return null; // Return null if we can't parse the time
}

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
        // Handle date fields with standardization
        if (['entry_date', 'exit_date'].includes(header)) {
          trade[header] = standardizeDateFormat(row[index]) || null;
        }
        // Handle time fields with standardization
        else if (['entry_time', 'exit_time'].includes(header)) {
          trade[header] = standardizeTimeFormat(row[index]) || null;
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


/**
 * Process a CSV field value based on its field type
 * @param fieldName The name of the field
 * @param value The raw value from the CSV
 * @returns The processed value
 */
export function processField(fieldName: string, value: string): any {
  // Convert empty strings to null for optional fields
  if (value === '') {
    // Don't return null for required fields
    if (['symbol', 'entry_price', 'trade_type'].includes(fieldName)) {
      return fieldName === 'trade_type' ? 'options' : value;
    }
    return null;
  }

  // Process field based on type
  switch (fieldName) {
    case 'entry_price':
    case 'exit_price':
    case 'quantity':
    case 'stop_loss':
    case 'strike_price':
    case 'vix':
    case 'call_iv':
    case 'put_iv':
    case 'pcr':
    case 'confidence_level':
      return parseFloat(value);
      
    case 'outcome':
      return ['profit', 'loss', 'breakeven'].includes(value) ? value : 'breakeven';
      
    case 'trade_type':
      return ['options', 'futures', 'equity'].includes(value) ? value : 'options';
      
    case 'option_type':
      return ['call', 'put'].includes(value) ? value : null;
      
    case 'trade_direction':
      return ['long', 'short'].includes(value) ? value : null;
      
    case 'vwap_position':
    case 'ema_position':
      return ['above', 'below', 'at'].includes(value) ? value : null;
      
    case 'market_condition':
      return ['trending', 'ranging', 'volatile', 'news_driven'].includes(value) ? value : null;
      
    case 'exit_reason':
      return ['stop_loss', 'target', 'manual', 'time_based'].includes(value) ? value : null;
      
    case 'entry_date':
    case 'exit_date':
    case 'entry_time':
    case 'exit_time':
      return value;
      
    // Add user_id field as required by Supabase RLS
    case 'user_id':
      return value;
      
    // For all other fields, just return the value as is
    default:
      return value;
  }
}

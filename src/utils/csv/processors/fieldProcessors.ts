
import { standardizeDateFormat, standardizeTimeFormat } from '../formatters/dateTimeFormatters';
import * as fieldValidators from '../validators/fieldValidators';

/**
 * Processes a date field for database storage
 * @param value The raw date string
 * @returns Standardized date string or null
 */
export function processDateField(value: string): string | null {
  return standardizeDateFormat(value);
}

/**
 * Processes a time field for database storage
 * @param value The raw time string
 * @returns Standardized time string or null
 */
export function processTimeField(value: string): string | null {
  return standardizeTimeFormat(value);
}

/**
 * Processes a numeric field for database storage
 * @param value The raw numeric string
 * @returns Parsed number or null
 */
export function processNumericField(value: string): number | null {
  if (!value) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

/**
 * Processes an integer field for database storage
 * @param value The raw integer string
 * @param defaultValue The default value if parsing fails
 * @returns Parsed integer or default value
 */
export function processIntegerField(value: string, defaultValue: number = 0): number {
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Processes a field based on its type
 * @param header The field name
 * @param value The raw value
 * @returns Processed value
 */
export function processField(header: string, value: string): any {
  // Handle date fields
  if (['entry_date', 'exit_date'].includes(header)) {
    return processDateField(value);
  }
  
  // Handle time fields
  if (['entry_time', 'exit_time'].includes(header)) {
    return processTimeField(value);
  }
  
  // Handle numeric fields
  if (['entry_price', 'exit_price', 'quantity', 'stop_loss', 'vix', 
      'call_iv', 'put_iv', 'confidence_level', 'strike_price',
      'emotional_score', 'confidence_level_score'].includes(header)) {
    return processNumericField(value);
  }
  
  // Handle integer fields
  if (header === 'analysis_count') {
    return processIntegerField(value);
  }
  
  // Handle enum fields
  if (header === 'market_condition') {
    return fieldValidators.validateMarketCondition(value);
  }
  if (header === 'option_type') {
    return fieldValidators.validateOptionType(value);
  }
  if (header === 'trade_direction') {
    return fieldValidators.validateTradeDirection(value);
  }
  if (header === 'exit_reason') {
    return fieldValidators.validateExitReason(value);
  }
  if (header === 'entry_emotion') {
    return fieldValidators.validateEntryEmotion(value);
  }
  if (header === 'exit_emotion') {
    return fieldValidators.validateExitEmotion(value);
  }
  if (header === 'timeframe') {
    return fieldValidators.validateTimeframe(value);
  }
  if (header === 'vwap_position' || header === 'ema_position') {
    return fieldValidators.validatePositionIndicator(value, header as any);
  }
  if (header === 'outcome') {
    return fieldValidators.validateOutcome(value);
  }
  if (header === 'trade_type') {
    return fieldValidators.validateTradeType(value);
  }
  
  // Default case: return the value or null if empty
  return value || null;
}


/**
 * Contains validators for different field types in CSV data
 */

/**
 * Validates and formats market condition field values
 * @param value The raw market condition value
 * @returns Valid market condition value or null
 */
export function validateMarketCondition(value: string): string | null {
  const validConditions = ['trending', 'ranging', 'news_driven', 'volatile'];
  const normalizedValue = value?.toLowerCase();
  return validConditions.includes(normalizedValue) ? normalizedValue : null;
}

/**
 * Validates and formats option type field values
 * @param value The raw option type value
 * @returns Valid option type value or null
 */
export function validateOptionType(value: string): string | null {
  const validTypes = ['call', 'put'];
  const normalizedValue = value?.toLowerCase();
  return validTypes.includes(normalizedValue) ? normalizedValue : null;
}

/**
 * Validates and formats trade direction field values
 * @param value The raw trade direction value
 * @returns Valid trade direction value or null
 */
export function validateTradeDirection(value: string): string | null {
  const validDirections = ['long', 'short'];
  const normalizedValue = value?.toLowerCase();
  return validDirections.includes(normalizedValue) ? normalizedValue : null;
}

/**
 * Validates and formats exit reason field values
 * @param value The raw exit reason value
 * @returns Valid exit reason value or null
 */
export function validateExitReason(value: string): string | null {
  const validReasons = ['stop_loss', 'target', 'manual', 'time_based'];
  const normalizedValue = value?.toLowerCase();
  return validReasons.includes(normalizedValue) ? normalizedValue : null;
}

/**
 * Validates and formats entry emotion field values
 * @param value The raw entry emotion value
 * @returns Valid entry emotion value or null
 */
export function validateEntryEmotion(value: string): string | null {
  const validEmotions = ['fear', 'greed', 'fomo', 'revenge', 'neutral', 'confident'];
  const normalizedValue = value?.toLowerCase();
  return validEmotions.includes(normalizedValue) ? normalizedValue : null;
}

/**
 * Validates and formats exit emotion field values
 * @param value The raw exit emotion value
 * @returns Valid exit emotion value or null
 */
export function validateExitEmotion(value: string): string | null {
  const validEmotions = ['satisfied', 'regretful', 'relieved', 'frustrated'];
  const normalizedValue = value?.toLowerCase();
  return validEmotions.includes(normalizedValue) ? normalizedValue : null;
}

/**
 * Validates and formats timeframe field values
 * @param value The raw timeframe value
 * @returns Valid timeframe value or null
 */
export function validateTimeframe(value: string): string | null {
  const validTimeframes = ['1min', '5min', '15min', '1hr'];
  const normalizedValue = value?.toLowerCase();
  return validTimeframes.includes(normalizedValue) ? normalizedValue : null;
}

/**
 * Validates and formats position indicator fields (VWAP or EMA)
 * @param value The raw position value
 * @param fieldName The field name ('vwap_position' or 'ema_position')
 * @returns Valid position value or null
 */
export function validatePositionIndicator(value: string, fieldName: 'vwap_position' | 'ema_position'): string | null {
  const validPositions = fieldName === 'vwap_position' 
    ? ['above_vwap', 'below_vwap'] 
    : ['above_20ema', 'below_20ema'];
  
  const normalizedValue = value?.toLowerCase();
  return validPositions.includes(normalizedValue) ? normalizedValue : null;
}

/**
 * Validates and formats outcome field values
 * @param value The raw outcome value
 * @returns Valid outcome value or default ('breakeven')
 */
export function validateOutcome(value: string): string {
  const validOutcomes = ['profit', 'loss', 'breakeven'];
  const normalizedValue = value?.toLowerCase();
  return validOutcomes.includes(normalizedValue) ? normalizedValue : 'breakeven';
}

/**
 * Validates and formats trade type field values
 * @param value The raw trade type value
 * @returns Valid trade type value or default ('options')
 */
export function validateTradeType(value: string): string {
  const validTypes = ['options', 'stocks', 'futures', 'forex', 'crypto'];
  const normalizedValue = value?.toLowerCase();
  return validTypes.includes(normalizedValue) ? normalizedValue : 'options';
}

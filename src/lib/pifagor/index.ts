/**
 * Главный экспорт модуля квадрата Пифагора
 */

export * from './types';
export * from './config';
export * from './math';
export * from './interpret';

import { PIFAGOR_STRATEGY } from './config';
import { parseDate, computeCountsRaw, computeCountsClassic, buildSquare } from './math';
import type { SquareResult } from './types';

/**
 * Вычисляет квадрат Пифагора для даты в формате DD.MM.YYYY
 */
export function calculatePifagor(dateStr: string, strategy: 'raw' | 'classic' = PIFAGOR_STRATEGY): SquareResult {
  const { d, m, y } = parseDate(dateStr);
  
  const counts = strategy === 'classic' 
    ? computeCountsClassic(d, m, y)
    : computeCountsRaw(d, m, y);
  
  return buildSquare(counts);
}


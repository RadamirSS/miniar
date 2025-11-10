/**
 * Конфигурация модуля квадрата Пифагора
 */

import type { Strategy } from './types';

/**
 * Стратегия расчета квадрата Пифагора
 * - "raw": простая стратегия - только цифры из даты DDMMYYYY
 * - "classic": классическая стратегия Пифагора/Горб с вычислением S1, S2, S3, S4
 */
export const PIFAGOR_STRATEGY: Strategy = "classic";


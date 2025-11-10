/**
 * Математические функции для расчета квадрата Пифагора
 */

import type { Counts, SquareResult } from './types';

/**
 * Парсит строку даты в формате DD.MM.YYYY в объект {d, m, y}
 * @param input - строка даты в формате DD.MM.YYYY
 * @returns объект с полями d, m, y
 * @throws Error если дата невалидна
 */
export function parseDate(input: string): { d: number; m: number; y: number } {
  const trimmed = input.trim();
  const dotPattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = trimmed.match(dotPattern);
  
  if (!match) {
    throw new Error('Неверный формат даты. Используйте DD.MM.YYYY');
  }
  
  const d = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const y = parseInt(match[3], 10);
  
  // Валидация даты
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    throw new Error('Некорректная дата');
  }
  
  // Проверка диапазона года
  if (y < 1900) {
    throw new Error('Год должен быть >= 1900');
  }
  
  const now = new Date();
  if (date > now) {
    throw new Error('Дата не может быть в будущем');
  }
  
  return { d, m, y };
}

/**
 * Подсчитывает сумму цифр числа
 */
function sumDigits(n: number): number {
  let s = 0;
  const str = String(n);
  for (const ch of str) {
    if (/[0-9]/.test(ch)) {
      s += Number(ch);
    }
  }
  return s;
}

/**
 * Извлекает все цифры из числа (игнорируя нули)
 */
function extractDigits(n: number): number[] {
  const digits: number[] = [];
  const str = String(n);
  for (const ch of str) {
    if (/[1-9]/.test(ch)) {
      digits.push(Number(ch));
    }
  }
  return digits;
}

/**
 * Вычисляет counts по стратегии raw (простая)
 * Берёт только цифры из даты рождения DDMMYYYY
 */
export function computeCountsRaw(d: number, m: number, y: number): Counts {
  const counts: Counts = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
    '6': 0, '7': 0, '8': 0, '9': 0
  };
  
  // Формируем строку DDMMYYYY
  const dateStr = `${String(d).padStart(2, '0')}${String(m).padStart(2, '0')}${y}`;
  
  // Подсчитываем цифры (игнорируем 0)
  for (const ch of dateStr) {
    if (ch >= '1' && ch <= '9') {
      counts[ch]++;
    }
  }
  
  return counts;
}

/**
 * Вычисляет counts по стратегии classic (классическая Пифагор/Горб)
 * Алгоритм:
 * - S1 = сумма всех цифр даты
 * - S2 = сумма цифр числа S1
 * - S3 = S1 - 2 × (первая цифра дня рождения)
 * - S4 = сумма цифр числа S3
 * - Итоговый мультимножество = (цифры даты) ∪ (цифры S1) ∪ (цифры S2) ∪ (цифры S3) ∪ (цифры S4)
 */
export function computeCountsClassic(d: number, m: number, y: number): Counts {
  const counts: Counts = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
    '6': 0, '7': 0, '8': 0, '9': 0
  };
  
  // Собираем все цифры для подсчета
  const allDigits: number[] = [];
  
  // 1. Цифры из даты DDMMYYYY
  const dateStr = `${String(d).padStart(2, '0')}${String(m).padStart(2, '0')}${y}`;
  for (const ch of dateStr) {
    if (ch >= '1' && ch <= '9') {
      allDigits.push(Number(ch));
    }
  }
  
  // 2. S1 = сумма всех цифр даты
  const S1 = sumDigits(d) + sumDigits(m) + sumDigits(y);
  allDigits.push(...extractDigits(S1));
  
  // 3. S2 = сумма цифр числа S1
  const S2 = sumDigits(S1);
  allDigits.push(...extractDigits(S2));
  
  // 4. S3 = S1 - 2 × (первая цифра дня рождения)
  const firstDigitOfDay = parseInt(String(d).charAt(0), 10);
  const S3 = S1 - 2 * firstDigitOfDay;
  if (S3 > 0) {
    allDigits.push(...extractDigits(S3));
    
    // 5. S4 = сумма цифр числа S3
    const S4 = sumDigits(S3);
    allDigits.push(...extractDigits(S4));
  }
  
  // Подсчитываем финальные counts
  for (const digit of allDigits) {
    if (digit >= 1 && digit <= 9) {
      counts[String(digit)]++;
    }
  }
  
  return counts;
}

/**
 * Строит полный результат квадрата Пифагора из counts
 * Вычисляет строки, диагонали
 */
export function buildSquare(counts: Counts): SquareResult {
  // Строки
  const r147 = (counts['1'] || 0) + (counts['4'] || 0) + (counts['7'] || 0);
  const r258 = (counts['2'] || 0) + (counts['5'] || 0) + (counts['8'] || 0);
  const r369 = (counts['3'] || 0) + (counts['6'] || 0) + (counts['9'] || 0);
  
  // Диагонали
  const d357 = (counts['3'] || 0) + (counts['5'] || 0) + (counts['7'] || 0);
  const d159 = (counts['1'] || 0) + (counts['5'] || 0) + (counts['9'] || 0);
  
  return {
    counts,
    rows: {
      r147,
      r258,
      r369
    },
    diags: {
      d357,
      d159
    }
  };
}


/**
 * Селекторы интерпретаций из JSON файла pifagor.json
 */

import type { Counts, SquareResult } from './types';
import pifagorData from '@/assets/pifagor.json';

const data = pifagorData as {
  digits: Record<string, { base: string; levels: Record<string, string> }>;
  lines_and_diagonals: Record<string, string>;
  psychotypes: string;
};

/**
 * Выбирает ключ уровня для цифры на основе количества
 * Реализует правила мэппинга из ТЗ (п.7)
 */
export function pickDigitLevelKey(digit: number, qty: number): string {
  if (qty === 0) {
    return digit === 2 ? "Х/1-2" : "X";
  }
  
  // Специальные правила для цифры 2
  if (digit === 2) {
    if (qty === 0 || qty === 1) return "Х/1-2";
    if (qty === 2) return "22";
    if (qty === 3) return "222";
    if (qty === 4 || qty === 5) return "2222/22222";
    if (qty === 6 || qty === 7) return "222222/2222222";
    // >= 8 - используем последний доступный ключ
    return "222222/2222222";
  }
  
  // Для остальных цифр: простой паттерн повторения
  if (qty === 1) {
    return String(digit);
  }
  
  // Для цифр 3, 4, 5, 6, 7, 8, 9: специальные правила для диапазонов
  if ([3, 4, 5, 6, 7, 8, 9].includes(digit)) {
    if (qty === 2) {
      return String(digit).repeat(2);
    }
    if (qty === 3) {
      return String(digit).repeat(3);
    }
    if (qty === 4 || qty === 5) {
      // Для некоторых цифр есть объединенные ключи
      if ([3, 5, 6, 7, 9].includes(digit)) {
        return `${String(digit).repeat(4)}/${String(digit).repeat(5)}`;
      }
      // Для 4 и 8 - только 4 повторения
      return String(digit).repeat(4);
    }
    if (qty >= 6) {
      // Используем последний доступный ключ или максимальный
      if ([3, 5, 6, 7, 9].includes(digit)) {
        return `${String(digit).repeat(4)}/${String(digit).repeat(5)}`;
      }
      return String(digit).repeat(4);
    }
  }
  
  // Для цифры 1: простой паттерн
  if (digit === 1) {
    if (qty === 1) return "1";
    if (qty === 2) return "11";
    if (qty === 3) return "111";
    if (qty === 4) return "1111";
    if (qty === 5) return "11111";
    if (qty === 6) return "111111";
    if (qty === 7) return "1111111";
    if (qty >= 8) return "11111111";
  }
  
  // Fallback: повторяем цифру qty раз
  return String(digit).repeat(Math.min(qty, 8));
}

/**
 * Получает текст интерпретации для цифры
 */
export function getDigitText(digit: number, qty: number): { base: string; level: string } {
  const digitKey = String(digit);
  const digitData = data.digits[digitKey];
  
  if (!digitData) {
    return { base: '', level: '' };
  }
  
  const levelKey = pickDigitLevelKey(digit, qty);
  
  // Пытаемся найти уровень по вычисленному ключу
  let levelText = digitData.levels[levelKey];
  
  // Если не нашли, ищем альтернативные варианты
  if (!levelText) {
    const availableKeys = Object.keys(digitData.levels);
    
    // Для qty === 0 пробуем найти ключ с "X" или "Х"
    if (qty === 0) {
      levelText = digitData.levels["X"] || digitData.levels["Х"] || digitData.levels["Х/1-2"] || '';
    } else {
      // Пробуем найти ближайший ключ
      // Сначала пробуем точное совпадение количества
      const exactMatch = String(digit).repeat(qty);
      if (digitData.levels[exactMatch]) {
        levelText = digitData.levels[exactMatch];
      } else {
        // Ищем ключи с диапазонами или комбинациями
        // Для цифры 2: специальная обработка
        if (digit === 2) {
          if (qty >= 6) levelText = digitData.levels["222222/2222222"] || '';
          else if (qty >= 4) levelText = digitData.levels["2222/22222"] || '';
          else if (qty === 3) levelText = digitData.levels["222"] || '';
          else if (qty === 2) levelText = digitData.levels["22"] || '';
          else levelText = digitData.levels["Х/1-2"] || '';
        } else {
          // Для других цифр: ищем по паттерну
          // Пробуем ключи от большего к меньшему количеству
          for (let i = Math.min(qty, 8); i >= 1; i--) {
            const testKey = String(digit).repeat(i);
            if (digitData.levels[testKey]) {
              levelText = digitData.levels[testKey];
              break;
            }
            // Пробуем комбинированные ключи (например, "3333/33333")
            if (i >= 4 && [3, 5, 6, 7, 9].includes(digit)) {
              const combinedKey = `${String(digit).repeat(4)}/${String(digit).repeat(5)}`;
              if (digitData.levels[combinedKey]) {
                levelText = digitData.levels[combinedKey];
                break;
              }
            }
          }
          // Если ничего не нашли, пробуем "X"
          if (!levelText) {
            levelText = digitData.levels["X"] || digitData.levels["Х"] || '';
          }
        }
      }
    }
  }
  
  const baseText = digitData.base || '';
  const ensuredLevel = levelText || baseText;
  
  return {
    base: baseText,
    level: ensuredLevel
  };
}

/**
 * Получает текст интерпретации для строк и диагоналей
 */
export function getLinesAndDiagsText(sr: SquareResult): Record<string, { qty: number; text: string }> {
  return {
    row_1_4_7: {
      qty: sr.rows.r147,
      text: data.lines_and_diagonals.row_1_4_7 || ''
    },
    row_2_5_8: {
      qty: sr.rows.r258,
      text: data.lines_and_diagonals.row_2_5_8 || ''
    },
    row_3_6_9: {
      qty: sr.rows.r369,
      text: data.lines_and_diagonals.row_3_6_9 || ''
    },
    diag_3_5_7: {
      qty: sr.diags.d357,
      text: data.lines_and_diagonals.diag_3_5_7 || ''
    },
    diag_1_5_9: {
      qty: sr.diags.d159,
      text: data.lines_and_diagonals.diag_1_5_9 || ''
    }
  };
}

/**
 * Получает текст психотипа на основе сравнения count(1) и count(2)
 */
export function getPsychotypeText(counts: Counts): string {
  const count1 = counts['1'] || 0;
  const count2 = counts['2'] || 0;
  
  // Психотип определяется сравнением единиц и двоек
  // Текст всегда один, но логику можно расширить если нужно
  return data.psychotypes || '';
}


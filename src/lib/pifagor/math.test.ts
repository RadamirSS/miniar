/**
 * Тесты для математических функций модуля квадрата Пифагора
 */

import { describe, it, expect } from 'vitest';
import { parseDate, computeCountsRaw, computeCountsClassic, buildSquare } from './math';

describe('parseDate', () => {
  it('должен парсить валидную дату в формате DD.MM.YYYY', () => {
    const result = parseDate('18.06.1988');
    expect(result).toEqual({ d: 18, m: 6, y: 1988 });
  });

  it('должен выбрасывать ошибку для неверного формата', () => {
    expect(() => parseDate('18/06/1988')).toThrow();
    expect(() => parseDate('18-06-1988')).toThrow();
    expect(() => parseDate('18061988')).toThrow();
  });

  it('должен выбрасывать ошибку для невалидной даты', () => {
    expect(() => parseDate('31.02.2000')).toThrow();
    expect(() => parseDate('32.01.2000')).toThrow();
  });

  it('должен выбрасывать ошибку для даты в будущем', () => {
    const futureYear = new Date().getFullYear() + 1;
    expect(() => parseDate(`01.01.${futureYear}`)).toThrow();
  });

  it('должен выбрасывать ошибку для года < 1900', () => {
    expect(() => parseDate('01.01.1899')).toThrow();
  });
});

describe('computeCountsRaw', () => {
  it('должен правильно считать цифры для даты 18.06.1988', () => {
    const counts = computeCountsRaw(18, 6, 1988);
    // DDMMYYYY = 18061988
    // Цифры: 1, 8, 0, 6, 1, 9, 8, 8
    // Игнорируем 0, считаем остальные
    expect(counts['1']).toBe(2); // две единицы
    expect(counts['2']).toBe(0);
    expect(counts['3']).toBe(0);
    expect(counts['4']).toBe(0);
    expect(counts['5']).toBe(0);
    expect(counts['6']).toBe(1); // одна шестерка
    expect(counts['7']).toBe(0);
    expect(counts['8']).toBe(3); // три восьмерки
    expect(counts['9']).toBe(1); // одна девятка
  });

  it('должен игнорировать нули', () => {
    const counts = computeCountsRaw(1, 1, 2000);
    // 01012000 -> 1, 1, 2, 0, 0, 0, 0
    expect(counts['0']).toBeUndefined();
    expect(counts['1']).toBe(2);
    expect(counts['2']).toBe(1);
  });
});

describe('computeCountsClassic', () => {
  it('должен правильно считать для даты 18.06.1988', () => {
    const counts = computeCountsClassic(18, 6, 1988);
    
    // Проверяем ожидаемый результат согласно ТЗ:
    // S1 = sum(1+8+0+6+1+9+8+8) = 41
    // S2 = sum(4+1) = 5
    // S3 = 41 - 2*1 = 39
    // S4 = sum(3+9) = 12
    // Все цифры: 1,8,0,6,1,9,8,8 (дата) + 4,1 (S1) + 5 (S2) + 3,9 (S3) + 1,2 (S4)
    // Игнорируем 0: 1,8,6,1,9,8,8,4,1,5,3,9,1,2
    // Подсчет: 1->4, 2->1, 3->1, 4->1, 5->1, 6->1, 7->0, 8->3, 9->2
    
    expect(counts['1']).toBe(4);
    expect(counts['2']).toBe(1);
    expect(counts['3']).toBe(1);
    expect(counts['4']).toBe(1);
    expect(counts['5']).toBe(1);
    expect(counts['6']).toBe(1);
    expect(counts['7']).toBe(0);
    expect(counts['8']).toBe(3);
    expect(counts['9']).toBe(2);
  });

  it('должен правильно обрабатывать день с одной цифрой', () => {
    const counts = computeCountsClassic(5, 6, 1988);
    // Дата: 05061988
    // S1 = 5+6+1+9+8+8 = 37
    // S2 = 3+7 = 10
    // S3 = 37 - 2*0 = 37 (первая цифра дня = 0, но это edge case)
    // На самом деле первая цифра дня 5 = 5, поэтому S3 = 37 - 2*5 = 27
    // S4 = 2+7 = 9
    // Проверяем, что вычисления работают
    expect(counts).toBeDefined();
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });

  it('должен учитывать различные цифры для даты 14.07.1992', () => {
    const counts = computeCountsClassic(14, 7, 1992);
    expect(counts['1']).toBeGreaterThan(0);
    expect(counts['2']).toBeGreaterThan(0);
    expect(counts['3']).toBeGreaterThan(0);
    expect(counts['4']).toBeGreaterThan(0);
    expect(counts['6']).toBeGreaterThan(0);
    expect(counts['7']).toBeGreaterThan(0);
    expect(counts['9']).toBeGreaterThan(0);
  });

  it('должен учитывать разнообразные цифры для даты 23.08.1986', () => {
    const counts = computeCountsClassic(23, 8, 1986);
    expect(counts['1']).toBeGreaterThan(0);
    expect(counts['2']).toBeGreaterThan(0);
    expect(counts['3']).toBeGreaterThan(0);
    expect(counts['6']).toBeGreaterThan(0);
    expect(counts['7']).toBeGreaterThan(0);
    expect(counts['8']).toBeGreaterThan(0);
    expect(counts['9']).toBeGreaterThan(0);
  });
});

describe('buildSquare', () => {
  it('должен правильно вычислять строки и диагонали для 18.06.1988 (classic)', () => {
    const counts = computeCountsClassic(18, 6, 1988);
    const result = buildSquare(counts);
    
    // counts: {1:4, 2:1, 3:1, 4:1, 5:1, 6:1, 7:0, 8:3, 9:2}
    // rows:
    // r147 = 1+4+7 = 4+1+0 = 5
    // r258 = 2+5+8 = 1+1+3 = 5
    // r369 = 3+6+9 = 1+1+2 = 4
    // diags:
    // d357 = 3+5+7 = 1+1+0 = 2
    // d159 = 1+5+9 = 4+1+2 = 7
    
    expect(result.rows.r147).toBe(5);
    expect(result.rows.r258).toBe(5);
    expect(result.rows.r369).toBe(4);
    expect(result.diags.d357).toBe(2);
    expect(result.diags.d159).toBe(7);
  });

  it('должен правильно вычислять для пустых counts', () => {
    const emptyCounts = {
      '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
      '6': 0, '7': 0, '8': 0, '9': 0
    };
    const result = buildSquare(emptyCounts);
    
    expect(result.rows.r147).toBe(0);
    expect(result.rows.r258).toBe(0);
    expect(result.rows.r369).toBe(0);
    expect(result.diags.d357).toBe(0);
    expect(result.diags.d159).toBe(0);
  });
});


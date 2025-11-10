/**
 * Тесты для функций интерпретации
 */

import { describe, it, expect } from 'vitest';
import { pickDigitLevelKey, getDigitText } from './interpret';

describe('pickDigitLevelKey', () => {
  describe('цифра 1', () => {
    it('должен возвращать "X" для qty = 0', () => {
      expect(pickDigitLevelKey(1, 0)).toBe('X');
    });

    it('должен возвращать правильные ключи для разных количеств', () => {
      expect(pickDigitLevelKey(1, 1)).toBe('1');
      expect(pickDigitLevelKey(1, 2)).toBe('11');
      expect(pickDigitLevelKey(1, 3)).toBe('111');
      expect(pickDigitLevelKey(1, 4)).toBe('1111');
      expect(pickDigitLevelKey(1, 8)).toBe('11111111');
    });
  });

  describe('цифра 2', () => {
    it('должен возвращать "Х/1-2" для qty = 0 или 1', () => {
      expect(pickDigitLevelKey(2, 0)).toBe('Х/1-2');
      expect(pickDigitLevelKey(2, 1)).toBe('Х/1-2');
    });

    it('должен возвращать правильные ключи для разных количеств', () => {
      expect(pickDigitLevelKey(2, 2)).toBe('22');
      expect(pickDigitLevelKey(2, 3)).toBe('222');
      expect(pickDigitLevelKey(2, 4)).toBe('2222/22222');
      expect(pickDigitLevelKey(2, 5)).toBe('2222/22222');
      expect(pickDigitLevelKey(2, 6)).toBe('222222/2222222');
      expect(pickDigitLevelKey(2, 7)).toBe('222222/2222222');
      expect(pickDigitLevelKey(2, 8)).toBe('222222/2222222');
    });
  });

  describe('цифра 3', () => {
    it('должен возвращать "X" для qty = 0', () => {
      expect(pickDigitLevelKey(3, 0)).toBe('X');
    });

    it('должен возвращать правильные ключи', () => {
      expect(pickDigitLevelKey(3, 1)).toBe('3');
      expect(pickDigitLevelKey(3, 2)).toBe('33');
      expect(pickDigitLevelKey(3, 3)).toBe('333');
      expect(pickDigitLevelKey(3, 4)).toBe('3333/33333');
      expect(pickDigitLevelKey(3, 5)).toBe('3333/33333');
    });
  });

  describe('цифра 4', () => {
    it('должен возвращать "X" для qty = 0', () => {
      expect(pickDigitLevelKey(4, 0)).toBe('X');
    });

    it('должен возвращать правильные ключи', () => {
      expect(pickDigitLevelKey(4, 1)).toBe('4');
      expect(pickDigitLevelKey(4, 2)).toBe('44');
      expect(pickDigitLevelKey(4, 3)).toBe('444');
      expect(pickDigitLevelKey(4, 4)).toBe('4444');
    });
  });
});

describe('getDigitText', () => {
  it('должен возвращать base и level для существующей цифры', () => {
    const result = getDigitText(1, 3);
    expect(result.base).toBeTruthy();
    expect(result.level).toBeTruthy();
  });

  it('должен возвращать пустые строки для несуществующей цифры', () => {
    const result = getDigitText(0, 1);
    expect(result.base).toBe('');
    expect(result.level).toBe('');
  });

  it('должен правильно обрабатывать цифру 2 с qty = 0', () => {
    const result = getDigitText(2, 0);
    expect(result.base).toBeTruthy();
    // Должен найти уровень для "Х/1-2"
    expect(result.level).toBeTruthy();
  });

  it('должен правильно обрабатывать цифру 2 с qty = 4', () => {
    const result = getDigitText(2, 4);
    expect(result.base).toBeTruthy();
    // Должен найти уровень для "2222/22222"
    expect(result.level).toBeTruthy();
  });

  it('должен возвращать тексты для цифры 3 с qty = 2', () => {
    const result = getDigitText(3, 2);
    expect(result.base).toBeTruthy();
    expect(result.level).toBeTruthy();
  });

  it('должен подбирать ближайший уровень для цифры 5 с qty = 4', () => {
    const result = getDigitText(5, 4);
    expect(result.base).toBeTruthy();
    expect(result.level).toBeTruthy();
  });
});


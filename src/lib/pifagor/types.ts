/**
 * Типы для модуля квадрата Пифагора
 */

export type Strategy = "raw" | "classic";

export interface Counts {
  [digit: string]: number; // keys: "1".."9"
}

export interface SquareResult {
  counts: Counts;
  rows: {
    r147: number; // row 1-4-7
    r258: number; // row 2-5-8
    r369: number; // row 3-6-9
  };
  diags: {
    d357: number; // diag 3-5-7
    d159: number; // diag 1-5-9
  };
}

export interface Interpretations {
  digits: Record<string, { base: string; levels: Record<string, string> }>;
  lines_and_diagonals: Record<string, string>;
  psychotypes: string;
}


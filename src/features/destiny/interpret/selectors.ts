import type { ArcanaDictionary, ArcanaInterpretation, ZonesDictionary, ZoneInterpretation } from './types'

export const DESTINY_VALUE_LABELS: Record<string, string> = {
  A: 'Аркан дня (личность)',
  B: 'Аркан месяца (отношения)',
  C: 'Аркан года (ресурсы)',
  D: 'Аркан судьбы (путь)',
  M1: 'Мужская линия — потенциал',
  M2: 'Мужская линия — реализация',
  W1: 'Женская линия — потенциал',
  W2: 'Женская линия — реализация',
  T_love: 'Зона любви',
  T_money: 'Зона денег',
  R1: 'Материальная ось — задача',
  R2: 'Материальная ось — результат',
  H1: 'Духовная ось — потенциал',
  H2: 'Духовная ось — баланс'
}

export function getArcanaInterpretation(
  value: number,
  dictionary: ArcanaDictionary
): ArcanaInterpretation | null {
  return dictionary[String(value)] ?? null
}

export function getNodeInterpretation(
  nodeKey: string,
  zones: ZonesDictionary
): ZoneInterpretation | null {
  return zones.nodes[nodeKey] ?? null
}

export function getLineInterpretation(
  key: string,
  zones: ZonesDictionary
): ZoneInterpretation | null {
  return zones.lines[key] ?? null
}

export function getZoneInterpretation(
  key: string,
  zones: ZonesDictionary
): ZoneInterpretation | null {
  return zones.zones[key] ?? null
}



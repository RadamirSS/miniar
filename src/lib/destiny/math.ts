import { parseDOB } from '@/core/date'
import { getDestinyReduction, reduceToArcana } from './format'
import {
  DESTINY_LAYOUT,
  NODE_DEFINITIONS,
  NODE_EXTRA_DEFINITIONS
} from './mapping'
import type {
  DestinyBase,
  DestinyDerived,
  DestinyResult,
  NodeValue,
  ReductionMode
} from './types'

export function computeBase(day: number, month: number, year: number, mode?: ReductionMode): DestinyBase {
  const reduction = mode ?? getDestinyReduction()
  const A = reduceToArcana(day, reduction)
  const B = reduceToArcana(month, reduction)
  const C = reduceToArcana(year, reduction)
  const D = reduceToArcana(day + month + year, reduction)
  return { A, B, C, D }
}

export function computeDerived(base: DestinyBase, mode?: ReductionMode): DestinyDerived {
  const reduction = mode ?? getDestinyReduction()
  const { A, B, C, D } = base

  const M1 = reduceToArcana(A + D, reduction)
  const M2 = reduceToArcana(M1 + A, reduction)
  const W1 = reduceToArcana(B + D, reduction)
  const W2 = reduceToArcana(W1 + B, reduction)
  const T_money = reduceToArcana(C + D, reduction)
  const R2 = reduceToArcana(T_money + C, reduction)
  const H2 = reduceToArcana(M1 + B, reduction)

  const derived: DestinyDerived = {
    M1,
    M2,
    W1,
    W2,
    T_love: W1,
    T_money,
    R1: T_money,
    R2,
    H1: M1,
    H2
  }

  return derived
}

function evalFormula(formula: string, values: Record<string, number>): number {
  const key = formula.trim()
  if (!(key in values)) {
    throw new Error(`Unknown formula key: ${key}`)
  }
  return values[key]
}

const nodeDefinitions = [...NODE_DEFINITIONS, ...NODE_EXTRA_DEFINITIONS]

export function computeDestiny(dateInput: string, mode?: ReductionMode): DestinyResult {
  const parsed = parseDOB(dateInput)
  if (!parsed) {
    throw new Error('Некорректная дата рождения')
  }

  const reduction = mode ?? getDestinyReduction()
  const base = computeBase(parsed.day, parsed.month, parsed.year, reduction)
  const derived = computeDerived(base, reduction)
  const values = { ...base, ...derived }

  const nodes: Record<string, NodeValue> = {}

  for (const spec of nodeDefinitions) {
    const coord = DESTINY_LAYOUT[spec.layout as keyof typeof DESTINY_LAYOUT]
    if (!coord) {
      throw new Error(`Layout coordinate not found for node "${spec.key}"`)
    }
    const value = evalFormula(spec.formula, values)
    nodes[spec.key] = {
      value,
      coord,
      formula: spec.formula,
      label: spec.label,
      icon: spec.icon,
      variant: spec.variant ?? 'neutral',
      radius: spec.radius,
      labelPosition: spec.labelPosition ?? 'auto',
      zIndex: spec.zIndex ?? 0
    }
  }

  return {
    mode: reduction,
    base,
    derived,
    values,
    nodes
  }
}


import type { ReductionMode } from './types'

export const DESTINY_REDUCTION_DEFAULT: ReductionMode = 'digital22'

let currentReduction: ReductionMode = DESTINY_REDUCTION_DEFAULT

export function setDestinyReduction(mode: ReductionMode) {
  currentReduction = mode
}

export function getDestinyReduction(): ReductionMode {
  return currentReduction
}

function sumDigits(value: number): number {
  let total = 0
  const digits = Math.abs(value).toString()
  for (const ch of digits) {
    if (ch >= '0' && ch <= '9') {
      total += Number(ch)
    }
  }
  return total
}

function reduceDigital22(value: number): number {
  let n = Math.abs(Math.trunc(value))
  if (n === 0) return 22
  while (n > 22) {
    n = sumDigits(n)
    if (n === 0) return 22
  }
  return n === 0 ? 22 : n
}

function reduceMod22(value: number): number {
  const n = Math.abs(Math.trunc(value))
  const mod = n % 22
  return mod === 0 ? 22 : mod
}

export function reduceToArcana(value: number, mode: ReductionMode = currentReduction): number {
  if (!Number.isFinite(value)) {
    throw new Error('Value must be a finite number')
  }
  if (value === 0) return 22
  switch (mode) {
    case 'digital22':
      return reduceDigital22(value)
    case 'mod22':
      return reduceMod22(value)
    default:
      return reduceDigital22(value)
  }
}



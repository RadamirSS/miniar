import { beforeEach, describe, expect, it } from 'vitest'
import { reduceToArcana, setDestinyReduction } from './format'
import { computeDestiny } from './math'
import { DESTINY_LAYOUT, NODE_DEFINITIONS, NODE_EXTRA_DEFINITIONS } from './mapping'

describe('reduceToArcana', () => {
  beforeEach(() => {
    setDestinyReduction('digital22')
  })

  it('reduces numbers via digital root to 1..22', () => {
    expect(reduceToArcana(27, 'digital22')).toBe(9)
    expect(reduceToArcana(44, 'digital22')).toBe(8)
    expect(reduceToArcana(22, 'digital22')).toBe(22)
    expect(reduceToArcana(0, 'digital22')).toBe(22)
  })

  it('reduces numbers via mod 22 strategy', () => {
    expect(reduceToArcana(23, 'mod22')).toBe(1)
    expect(reduceToArcana(44, 'mod22')).toBe(22)
    expect(reduceToArcana(0, 'mod22')).toBe(22)
  })
})

describe('computeDestiny', () => {
  beforeEach(() => {
    setDestinyReduction('digital22')
  })

  it('computes expected values for fixture 18.06.1988', () => {
    const result = computeDestiny('18.06.1988')
    expect(result.mode).toBe('digital22')
    expect(result.base).toEqual({ A: 18, B: 6, C: 8, D: 5 })
    expect(result.derived).toEqual({
      M1: 5,
      M2: 5,
      W1: 11,
      W2: 17,
      T_love: 11,
      T_money: 13,
      R1: 13,
      R2: 21,
      H1: 5,
      H2: 11
    })
    expect(result.values).toMatchObject({
      A: 18,
      B: 6,
      C: 8,
      D: 5,
      M1: 5,
      M2: 5,
      W1: 11,
      W2: 17,
      T_love: 11,
      T_money: 13,
      R1: 13,
      R2: 21,
      H1: 5,
      H2: 11
    })

    const allDefinitions = [...NODE_DEFINITIONS, ...NODE_EXTRA_DEFINITIONS]
    for (const definition of allDefinitions) {
      const node = result.nodes[definition.key]
      expect(node).toBeDefined()
      expect(node.value).toBe(result.values[definition.formula])
      expect(node.coord.length).toBe(2)
    }
  })

  it('ensures all layout coordinates are within [0,1]', () => {
    for (const coord of Object.values(DESTINY_LAYOUT)) {
      expect(coord[0]).toBeGreaterThanOrEqual(0)
      expect(coord[0]).toBeLessThanOrEqual(1)
      expect(coord[1]).toBeGreaterThanOrEqual(0)
      expect(coord[1]).toBeLessThanOrEqual(1)
    }
  })

  it('applies provided reduction mode parameter', () => {
    const result = computeDestiny('18.06.1988', 'mod22')
    expect(result.mode).toBe('mod22')
    expect(result.base).toEqual({ A: 18, B: 6, C: 8, D: 10 })
    expect(result.derived).toEqual({
      M1: 6,
      M2: 2,
      W1: 16,
      W2: 22,
      T_love: 16,
      T_money: 18,
      R1: 18,
      R2: 4,
      H1: 6,
      H2: 12
    })
  })
})



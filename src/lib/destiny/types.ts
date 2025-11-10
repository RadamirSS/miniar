export type ReductionMode = 'digital22' | 'mod22'

export interface DestinyBase {
  A: number
  B: number
  C: number
  D: number
}

export interface DestinyDerived {
  M1: number
  M2: number
  W1: number
  W2: number
  T_love: number
  T_money: number
  R1: number
  R2: number
  H1: number
  H2: number
}

export type NodeVariant = 'base' | 'derived' | 'neutral' | 'energy'

export type NodeLabelPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto'

export interface NodeSpec {
  formula: string
  label?: string
  icon?: 'heart' | 'dollar'
  variant?: NodeVariant
  radius?: number
  layout?: string
  labelPosition?: NodeLabelPosition
  zIndex?: number
}

export interface NodeDefinition extends NodeSpec {
  key: string
  layout: string
}

export interface NodeValue {
  value: number
  coord: readonly [number, number]
  formula: string
  label?: string
  icon?: NodeSpec['icon']
  variant: NodeVariant
  radius?: number
  labelPosition: NodeLabelPosition
  zIndex: number
}

export interface DestinyResult {
  mode: ReductionMode
  base: DestinyBase
  derived: DestinyDerived
  values: Record<string, number>
  nodes: Record<string, NodeValue>
}




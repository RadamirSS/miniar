import type { NodeDefinition, NodeVariant } from './types'

export const DESTINY_LAYOUT = {
  center: [0.5, 0.5],
  topOuter: [0.5, 0.06],
  topRightOuter: [0.78, 0.18],
  rightOuter: [0.94, 0.5],
  bottomRightOuter: [0.78, 0.82],
  bottomOuter: [0.5, 0.94],
  bottomLeftOuter: [0.22, 0.82],
  leftOuter: [0.06, 0.5],
  topLeftOuter: [0.22, 0.18],
  topInner: [0.5, 0.22],
  rightInner: [0.78, 0.5],
  bottomInner: [0.5, 0.78],
  leftInner: [0.22, 0.5],
  maleLower: [0.2, 0.68],
  femaleLower: [0.8, 0.68],
  maleLineTip: [0.18, 0.24],
  femaleLineTip: [0.82, 0.24],
  lovePoint: [0.62, 0.58],
  loveGuide: [0.66, 0.52],
  moneyPoint: [0.58, 0.72],
  moneyGuide: [0.54, 0.76],
  centerNorth: [0.5, 0.34],
  centerSouth: [0.5, 0.66],
  centerWest: [0.34, 0.5],
  centerEast: [0.66, 0.5],
  energyDownMid: [0.5, 0.84],
  energyDownTip: [0.5, 0.97],
  energyRightMid: [0.86, 0.58],
  energyRightTip: [0.93, 0.72]
} as const

export type DestinyLayoutKey = keyof typeof DESTINY_LAYOUT

const BASE_FORMULAS = ['A', 'B', 'C', 'D'] as const
const DERIVED_FORMULAS = [
  'M1',
  'M2',
  'W1',
  'W2',
  'T_love',
  'T_money',
  'R1',
  'R2',
  'H1',
  'H2'
] as const

export const BASE_FORMULAS_SET = new Set<string>(BASE_FORMULAS)
export const DERIVED_FORMULAS_SET = new Set<string>(DERIVED_FORMULAS)

const defaultVariant = (formula: string): NodeVariant => {
  if (BASE_FORMULAS_SET.has(formula)) return 'base'
  if (DERIVED_FORMULAS_SET.has(formula)) return 'derived'
  return 'neutral'
}

const defineNode = (
  def: Omit<NodeDefinition, 'variant'> & { variant?: NodeVariant }
): NodeDefinition => ({
  ...def,
  variant: def.variant ?? defaultVariant(def.formula)
})

export const NODE_DEFINITIONS: NodeDefinition[] = [
  defineNode({
    key: 'center',
    formula: 'D',
    label: 'Путь / Судьба',
    layout: 'center',
    radius: 88,
    variant: 'base',
    labelPosition: 'bottom',
    zIndex: 5
  }),
  defineNode({
    key: 'topOuter',
    formula: 'H1',
    label: '20 лет',
    layout: 'topOuter',
    radius: 46,
    labelPosition: 'top',
    variant: 'derived',
    zIndex: 4
  }),
  defineNode({
    key: 'rightOuter',
    formula: 'B',
    label: '40 лет',
    layout: 'rightOuter',
    radius: 46,
    labelPosition: 'right',
    zIndex: 4
  }),
  defineNode({
    key: 'bottomOuter',
    formula: 'R1',
    label: '60 лет',
    layout: 'bottomOuter',
    radius: 46,
    labelPosition: 'bottom',
    variant: 'derived',
    zIndex: 4
  }),
  defineNode({
    key: 'leftOuter',
    formula: 'A',
    label: '0 лет',
    layout: 'leftOuter',
    radius: 46,
    labelPosition: 'left',
    zIndex: 4
  }),
  defineNode({
    key: 'topInner',
    formula: 'H2',
    layout: 'topInner',
    radius: 36,
    labelPosition: 'top',
    variant: 'derived',
    zIndex: 3
  }),
  defineNode({
    key: 'rightInner',
    formula: 'W1',
    layout: 'rightInner',
    radius: 32,
    labelPosition: 'right',
    variant: 'derived',
    zIndex: 3
  }),
  defineNode({
    key: 'bottomInner',
    formula: 'R2',
    layout: 'bottomInner',
    radius: 32,
    labelPosition: 'bottom',
    variant: 'derived',
    zIndex: 3
  }),
  defineNode({
    key: 'leftInner',
    formula: 'M1',
    layout: 'leftInner',
    radius: 32,
    labelPosition: 'left',
    variant: 'derived',
    zIndex: 3
  }),
  defineNode({
    key: 'maleLower',
    formula: 'M2',
    layout: 'maleLower',
    radius: 28,
    labelPosition: 'bottom',
    variant: 'derived',
    zIndex: 2
  }),
  defineNode({
    key: 'femaleLower',
    formula: 'W2',
    layout: 'femaleLower',
    radius: 28,
    labelPosition: 'bottom',
    variant: 'derived',
    zIndex: 2
  }),
  defineNode({
    key: 'lovePoint',
    formula: 'T_love',
    layout: 'lovePoint',
    radius: 24,
    icon: 'heart',
    labelPosition: 'auto',
    variant: 'derived',
    zIndex: 2
  }),
  defineNode({
    key: 'moneyPoint',
    formula: 'T_money',
    layout: 'moneyPoint',
    radius: 24,
    icon: 'dollar',
    labelPosition: 'auto',
    variant: 'derived',
    zIndex: 2
  })
]

export const NODE_EXTRA_DEFINITIONS: NodeDefinition[] = [
  defineNode({
    key: 'maleTip',
    formula: 'M1',
    layout: 'maleLineTip',
    radius: 22,
    labelPosition: 'auto',
    variant: 'derived',
    zIndex: 1
  }),
  defineNode({
    key: 'femaleTip',
    formula: 'W1',
    layout: 'femaleLineTip',
    radius: 22,
    labelPosition: 'auto',
    variant: 'derived',
    zIndex: 1
  }),
  defineNode({
    key: 'centerNorth',
    formula: 'H1',
    layout: 'centerNorth',
    radius: 24,
    labelPosition: 'top',
    variant: 'derived',
    zIndex: 2
  }),
  defineNode({
    key: 'centerSouth',
    formula: 'C',
    layout: 'centerSouth',
    radius: 30,
    labelPosition: 'bottom',
    variant: 'base',
    zIndex: 2
  }),
  defineNode({
    key: 'centerWest',
    formula: 'A',
    layout: 'centerWest',
    radius: 22,
    labelPosition: 'left',
    variant: 'neutral',
    zIndex: 1
  }),
  defineNode({
    key: 'centerEast',
    formula: 'B',
    layout: 'centerEast',
    radius: 22,
    labelPosition: 'right',
    variant: 'neutral',
    zIndex: 1
  }),
  defineNode({
    key: 'loveGuideNode',
    formula: 'T_love',
    layout: 'loveGuide',
    radius: 18,
    labelPosition: 'auto',
    variant: 'derived',
    zIndex: 1
  }),
  defineNode({
    key: 'moneyGuideNode',
    formula: 'T_money',
    layout: 'moneyGuide',
    radius: 18,
    labelPosition: 'auto',
    variant: 'derived',
    zIndex: 1
  }),
  defineNode({
    key: 'energyDownNode',
    formula: 'R2',
    layout: 'energyDownMid',
    radius: 20,
    labelPosition: 'auto',
    variant: 'energy',
    zIndex: 1
  }),
  defineNode({
    key: 'energyRightNode',
    formula: 'W2',
    layout: 'energyRightMid',
    radius: 20,
    labelPosition: 'auto',
    variant: 'energy',
    zIndex: 1
  })
]

export interface DestinyEdge {
  key: string
  points: DestinyLayoutKey[]
  strokeWidth?: number
  dasharray?: string
  color?: string
  opacity?: number
  close?: boolean
  fill?: string
  layer?: 'grid' | 'accent' | 'guide'
}

export const DESTINY_EDGES: DestinyEdge[] = [
  {
    key: 'outer-ring',
    points: [
      'topOuter',
      'topRightOuter',
      'rightOuter',
      'bottomRightOuter',
      'bottomOuter',
      'bottomLeftOuter',
      'leftOuter',
      'topLeftOuter'
    ],
    close: true,
    strokeWidth: 2.2,
    color: 'rgba(148, 163, 184, 0.4)',
    fill: 'rgba(139, 92, 246, 0.05)',
    layer: 'grid'
  },
  {
    key: 'inner-square',
    points: ['topInner', 'rightInner', 'bottomInner', 'leftInner'],
    close: true,
    strokeWidth: 2,
    color: 'rgba(148, 163, 184, 0.6)',
    layer: 'grid'
  },
  {
    key: 'center-horizontal',
    points: ['leftOuter', 'rightOuter'],
    strokeWidth: 2,
    color: 'rgba(148, 163, 184, 0.45)',
    layer: 'grid'
  },
  {
    key: 'center-vertical',
    points: ['topOuter', 'bottomOuter'],
    strokeWidth: 2,
    color: 'rgba(148, 163, 184, 0.45)',
    layer: 'grid'
  },
  {
    key: 'inner-horizontal',
    points: ['leftInner', 'rightInner'],
    strokeWidth: 1.6,
    dasharray: '10 10',
    color: 'rgba(148, 163, 184, 0.35)',
    layer: 'guide'
  },
  {
    key: 'inner-vertical',
    points: ['topInner', 'bottomInner'],
    strokeWidth: 1.6,
    dasharray: '10 10',
    color: 'rgba(148, 163, 184, 0.35)',
    layer: 'guide'
  },
  {
    key: 'male-diagonal',
    points: ['leftOuter', 'topInner', 'femaleLower'],
    strokeWidth: 2.5,
    color: 'rgba(99, 179, 237, 0.8)',
    layer: 'accent'
  },
  {
    key: 'female-diagonal',
    points: ['rightOuter', 'topInner', 'maleLower'],
    strokeWidth: 2.5,
    color: 'rgba(236, 72, 153, 0.8)',
    layer: 'accent'
  },
  {
    key: 'love-guide',
    points: ['topInner', 'lovePoint'],
    strokeWidth: 2,
    dasharray: '6 10',
    color: 'rgba(236, 72, 153, 0.65)',
    layer: 'guide'
  },
  {
    key: 'money-guide',
    points: ['bottomInner', 'moneyPoint'],
    strokeWidth: 2,
    dasharray: '6 10',
    color: 'rgba(74, 222, 128, 0.65)',
    layer: 'guide'
  }
]

export interface EnergyPointSpec {
  formula: string
  layout: DestinyLayoutKey
  variant?: NodeVariant
  radius?: number
}

export interface EnergyFlowSpec {
  key: string
  from: DestinyLayoutKey
  to: DestinyLayoutKey
  color: string
  strokeWidth: number
  points: EnergyPointSpec[]
}

export const ENERGY_FLOWS: EnergyFlowSpec[] = [
  {
    key: 'center-to-earth',
    from: 'center',
    to: 'energyDownTip',
    color: 'rgba(59, 130, 246, 0.8)',
    strokeWidth: 3,
    points: [
      { formula: 'R2', layout: 'energyDownMid', variant: 'energy', radius: 18 },
      { formula: 'T_money', layout: 'moneyPoint', variant: 'derived', radius: 20 }
    ]
  },
  {
    key: 'mind-to-action',
    from: 'topInner',
    to: 'energyRightTip',
    color: 'rgba(236, 72, 153, 0.8)',
    strokeWidth: 3,
    points: [
      { formula: 'H2', layout: 'topInner', variant: 'derived', radius: 16 },
      { formula: 'W2', layout: 'energyRightMid', variant: 'energy', radius: 18 },
      { formula: 'T_love', layout: 'lovePoint', variant: 'derived', radius: 20 }
    ]
  }
]



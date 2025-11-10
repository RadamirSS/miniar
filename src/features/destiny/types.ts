export type DestinyPoint = {
  x: number
  y: number
}

export type DestinyCoreNumber = {
  id: string
  value: number
  calculated: boolean
  x: number
  y: number
  label?: string
}

export type DestinyEnergyLine = {
  id: string
  points: DestinyPoint[]
  dashed?: boolean
}

export type DestinyPerimeterAge = {
  age: number
  angle: number
}

export type DestinyLabel = DestinyPoint & {
  text: string
}

export interface DestinyData {
  coreNumbers: DestinyCoreNumber[]
  energyLines: DestinyEnergyLine[]
  perimeterAges: DestinyPerimeterAge[]
  labels?: DestinyLabel[]
}



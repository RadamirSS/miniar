export interface ArcanaInterpretation {
  title: string
  text: string
}

export type ArcanaDictionary = Record<string, ArcanaInterpretation>

export interface ZoneInterpretation {
  title: string
  text: string
}

export interface ZonesDictionary {
  nodes: Record<string, ZoneInterpretation>
  lines: Record<string, ZoneInterpretation>
  zones: Record<string, ZoneInterpretation>
}



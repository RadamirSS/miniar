import { useMemo } from 'react'
import arcanaData from '@/assets/destiny/arcana.json'
import zonesData from '@/assets/destiny/zones.json'
import type { ArcanaDictionary, ZonesDictionary } from './types'

export function useDestinyInterpretations() {
  return useMemo<{ arcana: ArcanaDictionary; zones: ZonesDictionary }>(() => {
    return {
      arcana: arcanaData as ArcanaDictionary,
      zones: zonesData as ZonesDictionary
    }
  }, [])
}



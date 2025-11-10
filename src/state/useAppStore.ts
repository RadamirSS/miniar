import { create } from 'zustand'

export type DOB = { day: number; month: number; year: number } | null

type State = {
  dob: DOB
  setDOB: (d: DOB) => void
  cache: Record<string, any>
  setCache: (k: string, v: any) => void
}

export const useAppStore = create<State>((set) => ({
  dob: null,
  setDOB: (dob) => set({ dob }),
  cache: {},
  setCache: (k, v) => set(s => ({ cache: { ...s.cache, [k]: v } }))
}))

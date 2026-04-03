/**
 * Zustand store for application state
 */
import { create } from 'zustand'
import { AppState, SignalRecord, ReconstructionResult } from '../types'

interface StoreState extends AppState {
  // Actions
  setCurrentData: (data: SignalRecord) => void
  setReconstruction: (result: ReconstructionResult) => void
  setSelectedLead: (lead: string | null) => void
  setTimeWindow: (start: number | null, end: number | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSimulationParams: (angle: number, magnitude: number) => void
  reset: () => void
}

const initialState: AppState = {
  currentData: null,
  reconstruction: null,
  selectedLead: null,
  timeWindowStart: null,
  timeWindowEnd: null,
  isLoading: false,
  error: null,
  simulationAngle: 45,
  simulationMagnitude: 1.0,
}

export const useStore = create<StoreState>((set) => ({
  ...initialState,
  
  setCurrentData: (data: SignalRecord) => set({ currentData: data, error: null }),
  
  setReconstruction: (result: ReconstructionResult) => set({ reconstruction: result }),
  
  setSelectedLead: (lead: string | null) => set({ selectedLead: lead }),
  
  setTimeWindow: (start: number | null, end: number | null) => set({
    timeWindowStart: start,
    timeWindowEnd: end,
  }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  setSimulationParams: (angle: number, magnitude: number) => set({
    simulationAngle: angle,
    simulationMagnitude: magnitude,
  }),
  
  reset: () => set(initialState),
}))

/**
 * Type definitions for ECG data structures
 */

export interface LeadSignal {
  leadName: string
  samples: number[]
  unit: string
  samplingRateHz: number
}

export interface SignalRecord {
  sourceType: 'waveform' | 'summary' | 'synthetic'
  samplingRateHz: number
  units: string
  leads: Record<string, number[]>
  availableLeads: string[]
  timeAxis?: number[]
}

export interface ReconstructionResult {
  canRenderEinthoven: boolean
  canEstimateFrontalVector: boolean
  confidence: number
  vectorAngleDeg?: number
  vectorMagnitude?: number
  projectedValues: Record<string, number>
  observedValues: Record<string, number>
  residualError?: number
  notes: string[]
  teachingEnabled?: boolean
  teachingDynamic?: boolean
  teachingHeartRateBpm?: number
  teachingBeatPeriodMs?: number
  teachingPhaseMs?: number
  teachingGlobalTimeMs?: number
  teachingComponentTimesMs?: Record<string, number>
  aqrsHistoryDeg?: number[]
}

export interface DemoMetadata {
  id: string
  name: string
  description: string
  leads: string[]
}

export interface AppState {
  // Data
  currentData: SignalRecord | null
  reconstruction: ReconstructionResult | null
  
  // UI
  selectedLead: string | null
  timeWindowStart: number | null
  timeWindowEnd: number | null
  isLoading: boolean
  error: string | null
  
  // Teaching mode playback control
  teachingIsPlaying: boolean
  teachingManualTimeMs: number | null
  
  // Simulation
  simulationAngle: number
  simulationMagnitude: number
}

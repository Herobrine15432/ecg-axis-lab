/**
 * Custom hooks for ECG app
 */
import { useCallback, useState } from 'react'
import { useStore } from '../store'
import api from '../lib/api'
import { SignalRecord } from '../types'

/**
 * Hook to load demo data and perform reconstruction
 */
export function useLoadDemo() {
  const { setCurrentData, setReconstruction, setLoading, setError } = useStore()
  const [isLoading, setIsLoading] = useState(false)

  const loadDemo = useCallback(async (demoId: string) => {
    setIsLoading(true)
    setLoading(true)
    try {
      const demoData = await api.getDemo(demoId)
      
      const signalRecord: SignalRecord = {
        sourceType: 'synthetic',
        samplingRateHz: demoData.sampling_rate_hz,
        units: 'mV',
        leads: demoData.leads,
        availableLeads: Object.keys(demoData.leads),
      }
      
      setCurrentData(signalRecord)
      
      // Perform reconstruction
      try {
        const reconstruction = await api.reconstructFrontal(
          demoData.leads,
          demoData.sampling_rate_hz
        )
        setReconstruction(reconstruction)
      } catch (err) {
        console.error('Reconstruction failed:', err)
        setError('Failed to perform geometric reconstruction')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to load demo: ${errorMsg}`)
      console.error(err)
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }, [setCurrentData, setReconstruction, setLoading, setError])

  return { loadDemo, isLoading }
}

/**
 * Hook to perform simulation
 */
export function useSimulation() {
  const { setCurrentData, setReconstruction, setLoading, setError } = useStore()
  const [isLoading, setIsLoading] = useState(false)

  const runSimulation = useCallback(
    async (angle: number, magnitude: number, leads?: string[], noise: number = 0) => {
      setIsLoading(true)
      setLoading(true)
      try {
        const result = await api.simulateECG(angle, magnitude, leads, noise)
        
        const signalRecord: SignalRecord = {
          sourceType: 'synthetic',
          samplingRateHz: result.sampling_rate_hz,
          units: 'mV',
          leads: result.synthetic_leads,
          availableLeads: result.leads_simulated,
        }
        
        setCurrentData(signalRecord)
        
        // Perform reconstruction
        try {
          const reconstruction = await api.reconstructFromSummary({
            // Use first sample as proxy for now
            ...Object.fromEntries(
              Object.entries(result.synthetic_leads).map(([lead, samples]) => [
                lead,
                (samples as number[]).reduce((a, b) => a + b, 0) / (samples as number[]).length,
              ])
            ),
          })
          setReconstruction(reconstruction)
        } catch (err) {
          console.error('Reconstruction failed:', err)
          setError('Failed to perform geometric reconstruction')
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(`Simulation failed: ${errorMsg}`)
        console.error(err)
      } finally {
        setIsLoading(false)
        setLoading(false)
      }
    },
    [setCurrentData, setReconstruction, setLoading, setError]
  )

  return { runSimulation, isLoading }
}

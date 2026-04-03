/**
 * API client for communicating with backend
 */
import axios from 'axios'
import {
  ReconstructionResult,
  DemoMetadata,
} from '../types'

const API_BASE = '/api'

const apiClient = axios.create({
  baseURL: API_BASE,
})

export const api = {
  async simulateECG(
    vectorAngleDeg: number,
    vectorMagnitude: number = 1.0,
    leadsToDisplay?: string[],
    noiseLevel: number = 0
  ) {
    const response = await apiClient.post('/simulate', {
      vector_angle_deg: vectorAngleDeg,
      vector_magnitude: vectorMagnitude,
      leads_to_display: leadsToDisplay || [
        'I', 'II', 'III', 'aVR', 'aVL', 'aVF'
      ],
      noise_level: noiseLevel,
    })
    return response.data
  },

  async reconstructFrontal(leads: Record<string, number[]>, samplingRate: number = 500) {
    const response = await apiClient.post('/reconstruct/frontal', {
      leads,
      sampling_rate_hz: samplingRate,
    })
    return response.data as ReconstructionResult
  },

  async reconstructFromSummary(leads: Record<string, number>, metric: string = 'signed_area') {
    const response = await apiClient.post('/reconstruct/summary', {
      leads,
      summary_metric: metric,
    })
    return response.data as ReconstructionResult
  },

  async listDemos() {
    const response = await apiClient.get('/demos')
    return response.data.demos as DemoMetadata[]
  },

  async getDemo(demoId: string) {
    const response = await apiClient.get(`/demos/${demoId}`)
    return response.data
  },
}

export default api

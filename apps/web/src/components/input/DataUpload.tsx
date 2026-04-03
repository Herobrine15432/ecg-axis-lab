import React, { useState } from 'react'
import api from '../../lib/api'
import { useStore } from '../../store'
import { SignalRecord } from '../../types'

const ALIASES: Record<string, string> = {
  AVR: 'aVR',
  AVL: 'aVL',
  AVF: 'aVF',
}

const VALID_LEADS = new Set([
  'I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6',
])

function normalizeLeadName(raw: string): string | null {
  const compact = raw.trim().replace(/\s+/g, '')
  const upper = compact.toUpperCase()
  if (ALIASES[upper]) return ALIASES[upper]
  if (VALID_LEADS.has(upper)) return upper
  return null
}

function parseCsvLeads(csvText: string, fallbackLead: string): Record<string, number[]> {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length < 2) {
    throw new Error('CSV is empty or has no data rows')
  }

  const headers = lines[0].split(',').map((h) => h.trim())
  const timeIdx = headers.findIndex((h) => ['time', 'time_ms', 'time_sec'].includes(h.toLowerCase()))

  const leadColumns: Array<{ idx: number; name: string }> = []
  headers.forEach((h, idx) => {
    if (idx === timeIdx) return
    const normalized = normalizeLeadName(h)
    if (normalized) {
      leadColumns.push({ idx, name: normalized })
    }
  })

  if (leadColumns.length === 0 && headers.length === 1) {
    const singleName = normalizeLeadName(fallbackLead) || 'II'
    leadColumns.push({ idx: 0, name: singleName })
  }

  if (leadColumns.length === 0) {
    throw new Error('No recognized lead columns found in CSV')
  }

  const leads: Record<string, number[]> = {}
  leadColumns.forEach((col) => {
    leads[col.name] = []
  })

  for (let rowIdx = 1; rowIdx < lines.length; rowIdx++) {
    const cols = lines[rowIdx].split(',').map((c) => c.trim())
    leadColumns.forEach((col) => {
      const value = Number(cols[col.idx])
      if (!Number.isNaN(value) && Number.isFinite(value)) {
        leads[col.name].push(value)
      }
    })
  }

  Object.keys(leads).forEach((lead) => {
    if (leads[lead].length === 0) {
      delete leads[lead]
    }
  })

  if (Object.keys(leads).length === 0) {
    throw new Error('No valid numeric samples found in CSV')
  }

  return leads
}

export const DataUpload: React.FC = () => {
  const [samplingRate, setSamplingRate] = useState(500)
  const [fallbackLead, setFallbackLead] = useState('II')
  const [isReading, setIsReading] = useState(false)
  const { setCurrentData, setReconstruction, setError, setLoading } = useStore()

  const onFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setIsReading(true)
    setError(null)

    try {
      const text = await file.text()
      let leads: Record<string, number[]> = {}
      let sourceType: SignalRecord['sourceType'] = 'waveform'

      if (file.name.toLowerCase().endsWith('.json')) {
        const data = JSON.parse(text)
        if (!data.leads || typeof data.leads !== 'object') {
          throw new Error('Invalid JSON: missing leads field')
        }

        const firstValue = Object.values(data.leads)[0]
        if (Array.isArray(firstValue)) {
          Object.entries(data.leads).forEach(([name, samples]) => {
            const normalized = normalizeLeadName(name)
            if (normalized && Array.isArray(samples)) {
              leads[normalized] = samples.map((v) => Number(v)).filter((v) => Number.isFinite(v))
            }
          })
          if (data.sampling_rate_hz && Number.isFinite(Number(data.sampling_rate_hz))) {
            setSamplingRate(Number(data.sampling_rate_hz))
          }
        } else {
          sourceType = 'summary'
          const summary: Record<string, number> = {}
          Object.entries(data.leads).forEach(([name, value]) => {
            const normalized = normalizeLeadName(name)
            const numeric = Number(value)
            if (normalized && Number.isFinite(numeric)) {
              summary[normalized] = numeric
            }
          })

          if (Object.keys(summary).length === 0) {
            throw new Error('Invalid summary JSON: no recognized leads')
          }

          const reconstruction = await api.reconstructFromSummary(summary)
          setReconstruction(reconstruction)
          setCurrentData({
            sourceType,
            samplingRateHz: samplingRate,
            units: 'mV',
            leads: {},
            availableLeads: Object.keys(summary),
          })
          return
        }
      } else {
        leads = parseCsvLeads(text, fallbackLead)
      }

      if (Object.keys(leads).length === 0) {
        throw new Error('No valid leads found in file')
      }

      const record: SignalRecord = {
        sourceType,
        samplingRateHz: samplingRate,
        units: 'mV',
        leads,
        availableLeads: Object.keys(leads),
      }

      setCurrentData(record)
      const reconstruction = await api.reconstructFrontal(leads, samplingRate)
      setReconstruction(reconstruction)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error while loading file'
      setError(message)
    } finally {
      setLoading(false)
      setIsReading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Upload your data</h2>

      <div className="space-y-3">
        <label className="block text-xs text-gray-600">
          CSV or JSON file
          <input
            type="file"
            accept=".csv,.json"
            onChange={onFileSelected}
            className="mt-1 block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-ecg-50 file:px-3 file:py-2 file:text-ecg-700"
          />
        </label>

        <label className="block text-xs text-gray-600">
          Sampling rate (Hz)
          <input
            type="number"
            min={50}
            max={2000}
            value={samplingRate}
            onChange={(e) => setSamplingRate(Number(e.target.value) || 500)}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>

        <label className="block text-xs text-gray-600">
          Fallback lead (single-column CSV)
          <input
            type="text"
            value={fallbackLead}
            onChange={(e) => setFallbackLead(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>

        <p className="text-xs text-gray-500">
          Supports single/multi-lead CSV, waveform JSON, and summary JSON.
        </p>

        {isReading && <p className="text-xs text-ecg-700">Processing file...</p>}
      </div>
    </div>
  )
}

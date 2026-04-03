import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store'
import Plot from 'react-plotly.js'

const MONITOR_PLAYHEAD_FRACTION = 0.6

export const SignalViewer: React.FC = () => {
  const { currentData, reconstruction, selectedLead, setSelectedLead, teachingIsPlaying, setTeachingIsPlaying, setTeachingManualTimeMs, teachingManualTimeMs } = useStore()
  const [viewMode, setViewMode] = useState<'focus' | 'all'>('focus')

  // All hooks must be called unconditionally, before any early returns
  useEffect(() => {
    if (currentData && !selectedLead && currentData.availableLeads.length > 0) {
      setSelectedLead(currentData.availableLeads[0])
    }
  }, [currentData?.availableLeads, selectedLead, setSelectedLead, currentData])

  const spacing = 1.6

  const leadsToShow = useMemo(() => {
    if (!currentData) return []
    if (viewMode === 'focus' && selectedLead && currentData.availableLeads.includes(selectedLead)) {
      return [selectedLead]
    }
    return currentData.availableLeads
  }, [currentData, selectedLead, viewMode])

  // Early return after all hooks
  if (!currentData || currentData.availableLeads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200 h-96 flex items-center justify-center">
        <p className="text-gray-500">No signal data to display</p>
      </div>
    )
  }

  const traces = leadsToShow.map((leadName, index) => {
    const samples = currentData.leads[leadName] || []
    const x = Array.from({ length: samples.length }, (_, i) => 
      (i / currentData.samplingRateHz) * 1000 // Convert to milliseconds
    )
    const offset = leadsToShow.length > 1 ? index * spacing : 0
    const y = samples.map((sample) => sample + offset)
    
    return {
      x,
      y,
      name: leadsToShow.length > 1 ? `${leadName} (offset ${offset.toFixed(1)} mV)` : leadName,
      type: 'scatter' as const,
      mode: 'lines' as const,
      line: { width: viewMode === 'focus' ? 2.2 : 1.3 },
    }
  })

  const xMax = traces.length > 0 && traces[0].x.length > 0
    ? Number(traces[0].x[traces[0].x.length - 1])
    : 0

  const layout = {
    title: 'ECG Monitor',
    xaxis: { 
      title: 'Time (ms)',
      zeroline: false,
      showgrid: true,
      gridwidth: 1,
      gridcolor: '#e5e7eb',
      autorange: false,
      range: [0, xMax],
    },
    yaxis: { 
      title: leadsToShow.length > 1 ? 'Amplitude (mV, offset view)' : 'Amplitude (mV)',
      zeroline: false,
      showgrid: true,
      gridwidth: 1,
      gridcolor: '#e5e7eb',
    },
    showlegend: true,
    height: 460,
    margin: { b: 40, l: 60, r: 20, t: 40 },
    hovermode: 'closest' as const,
    shapes: [] as Array<Record<string, unknown>>,
    annotations: [] as Array<Record<string, unknown>>,
  }

  // Teaching mode: add fixed playhead and controls
  if (reconstruction?.teachingEnabled && viewMode === 'focus') {
    // Fixed playhead position (60% of the original waveform width)
    const playheadX = xMax * MONITOR_PLAYHEAD_FRACTION
    layout.shapes.push({
      type: 'line',
      x0: playheadX,
      x1: playheadX,
      yref: 'paper',
      y0: 0,
      y1: 1,
      line: { color: '#ef4444', width: 3 },
    })
    layout.annotations.push({
      x: playheadX,
      y: 1.08,
      yref: 'paper',
      text: '◄ NOW',
      showarrow: false,
      font: { size: 11, color: '#ef4444', family: 'monospace' },
    })
  }

  const timelineMs = reconstruction?.teachingGlobalTimeMs ?? teachingManualTimeMs ?? 0
  const timelineMaxMs = Math.max(10000, Math.ceil(xMax))

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">Signal Viewer</h2>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setViewMode('focus')}
            className={`px-2 py-1 rounded border ${viewMode === 'focus' ? 'bg-ecg-600 text-white border-ecg-600' : 'bg-white border-gray-300'}`}
          >
            Focused lead
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-2 py-1 rounded border ${viewMode === 'all' ? 'bg-ecg-600 text-white border-ecg-600' : 'bg-white border-gray-300'}`}
          >
            All leads
          </button>
          <select
            value={selectedLead || ''}
            onChange={(e) => setSelectedLead(e.target.value || null)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {currentData.availableLeads.map((lead) => (
              <option key={lead} value={lead}>{lead}</option>
            ))}
          </select>
        </div>
      </div>

      {reconstruction?.teachingEnabled && viewMode === 'focus' && (
        <>
          <p className="text-xs text-gray-600 mb-2">
            ECG Monitor mode: signal scrolls left, playhead stays fixed. Use Play/Pause and slider below to control playback.
          </p>
          <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded border border-gray-200">
            <button
              onClick={() => setTeachingIsPlaying(!teachingIsPlaying)}
              className="px-3 py-1 bg-ecg-600 text-white rounded hover:bg-ecg-700 text-sm font-medium"
            >
              {teachingIsPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <input
              type="range"
              min="0"
              max={timelineMaxMs}
              value={timelineMs % timelineMaxMs}
              onChange={(e) => {
                setTeachingIsPlaying(false)
                setTeachingManualTimeMs(Number(e.target.value))
              }}
              className="flex-1 cursor-pointer"
            />
            <span className="text-xs text-gray-600 min-w-fit">
              {(timelineMs % timelineMaxMs).toFixed(0)} ms
            </span>
          </div>
        </>
      )}
      
      {!reconstruction?.teachingEnabled && (
        <p className="text-xs text-gray-600 mb-2">
          Enable Teaching Lab (left panel) to get interactive ECG monitor controls.
        </p>
      )}

      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true }}
      />
    </div>
  )
}

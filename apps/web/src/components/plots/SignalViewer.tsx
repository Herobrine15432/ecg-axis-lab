import React from 'react'
import { useStore } from '../../store'
import Plot from 'react-plotly.js'

export const SignalViewer: React.FC = () => {
  const { currentData } = useStore()

  if (!currentData || currentData.availableLeads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200 h-96 flex items-center justify-center">
        <p className="text-gray-500">No signal data to display</p>
      </div>
    )
  }

  // Prepare data for Plotly
  const multipleLeads = currentData.availableLeads.length > 1
  const spacing = 2.0

  const traces = currentData.availableLeads.map((leadName, index) => {
    const samples = currentData.leads[leadName] || []
    const x = Array.from({ length: samples.length }, (_, i) => 
      (i / currentData.samplingRateHz) * 1000 // Convert to milliseconds
    )
    const offset = multipleLeads ? index * spacing : 0
    const y = samples.map((sample) => sample + offset)
    
    return {
      x,
      y,
      name: multipleLeads ? `${leadName} (offset ${offset.toFixed(1)} mV)` : leadName,
      type: 'scatter' as const,
      mode: 'lines' as const,
      line: { width: 1.5 },
    }
  })

  const layout = {
    title: 'ECG Waveforms',
    xaxis: { title: 'Time (ms)' },
    yaxis: { title: multipleLeads ? 'Amplitude (mV, offset view)' : 'Amplitude (mV)' },
    showlegend: true,
    height: 460,
    margin: { b: 40, l: 60, r: 20, t: 40 },
    hovermode: 'x unified' as const,
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Signal Viewer</h2>
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true }}
      />
    </div>
  )
}

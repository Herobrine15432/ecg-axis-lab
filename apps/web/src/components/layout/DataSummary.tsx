import React from 'react'
import { useStore } from '../../store'

export const DataSummary: React.FC = () => {
  const { currentData, reconstruction } = useStore()

  if (!currentData) {
    return (
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Data Summary</h2>
        <p className="text-gray-500 text-sm">No data loaded</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Data Summary</h2>

      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium">Source:</span>
          <span className="ml-2 text-gray-700">
            {currentData.sourceType.charAt(0).toUpperCase() + currentData.sourceType.slice(1)}
          </span>
        </div>

        <div>
          <span className="font-medium">Available Leads:</span>
          <span className="ml-2 text-gray-700">
            {currentData.availableLeads.join(', ')}
          </span>
        </div>

        <div>
          <span className="font-medium">Sampling Rate:</span>
          <span className="ml-2 text-gray-700">
            {currentData.samplingRateHz} Hz
          </span>
        </div>

        {reconstruction && (
          <>
            <hr className="my-2" />
            <div>
              <span className="font-medium">Reconstruction:</span>
            </div>
            {reconstruction.canRenderEinthoven && (
              <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
                ✓ Einthoven triangle available
              </div>
            )}
            {reconstruction.canEstimateFrontalVector && (
              <div className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
                ✓ Frontal vector available
                {reconstruction.vectorAngleDeg !== undefined && (
                  <div className="mt-1">
                    AQRS: {reconstruction.vectorAngleDeg.toFixed(1)}° | 
                    Magnitude: {reconstruction.vectorMagnitude?.toFixed(2)}
                  </div>
                )}
              </div>
            )}
            <div className="text-xs bg-slate-50 p-2 rounded border border-slate-200">
              <p className="font-medium text-slate-700">What is AQRS?</p>
              <p className="text-slate-600">
                AQRS is the mean QRS axis in the frontal plane. In the geometry panel it is the red vector.
              </p>
              {reconstruction.teachingEnabled && reconstruction.teachingPhaseMs !== undefined && (
                <p className="text-slate-600 mt-1">
                  Current beat phase: {reconstruction.teachingPhaseMs.toFixed(0)} ms
                  {reconstruction.teachingBeatPeriodMs ? ` / ${reconstruction.teachingBeatPeriodMs.toFixed(0)} ms` : ''}
                </p>
              )}
            </div>
            {reconstruction.notes.length > 0 && (
              <div className="text-xs space-y-1">
                {reconstruction.notes.map((note, i) => (
                  <p key={i} className="text-gray-600">• {note}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

import React from 'react'
import { useStore } from '../../store'

const LEAD_ANGLES: Record<string, number> = {
  'I': 0,
  'aVL': 60,
  'aVF': -90,
  'III': -60,
  'II': -30,
  'aVR': 120,
}

export const FrontalPlaneGeometry: React.FC = () => {
  const { currentData, reconstruction } = useStore()

  if (!currentData || !reconstruction) {
    return (
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200 h-96 flex items-center justify-center">
        <p className="text-gray-500">No geometry data to display</p>
      </div>
    )
  }

  // SVG dimensions
  const size = 300
  const center = size / 2
  const radius = 100

  const leadPoint = (leadName: string) => {
    const angle = LEAD_ANGLES[leadName]
    if (angle === undefined) return null
    const rad = ((angle - 90) * Math.PI) / 180
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    }
  }

  // Draw axes for available leads
  const renderLeadAxis = (leadName: string) => {
    const angle = LEAD_ANGLES[leadName]
    if (angle === undefined) return null

    const rad = ((angle - 90) * Math.PI) / 180 // Convert to SVG coordinates
    const x2 = center + radius * Math.cos(rad)
    const y2 = center + radius * Math.sin(rad)

    const isAvailable = currentData.availableLeads.includes(leadName)
    const strokeColor = isAvailable ? '#0284c7' : '#d1d5db'
    const opacity = isAvailable ? 1 : 0.3

    return (
      <g key={leadName}>
        {/* Axis line */}
        <line
          x1={center}
          y1={center}
          x2={x2}
          y2={y2}
          stroke={strokeColor}
          strokeWidth="2"
          opacity={opacity}
        />
        {/* Lead label */}
        <text
          x={center + (radius + 20) * Math.cos(rad)}
          y={center + (radius + 20) * Math.sin(rad)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fontWeight="bold"
          fill={strokeColor}
          opacity={opacity}
        >
          {leadName}
        </text>
      </g>
    )
  }

  // Draw the vector if available
  const vectorElement = reconstruction.vectorAngleDeg !== undefined && 
    reconstruction.vectorMagnitude !== undefined ? (
      <g>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
          </marker>
        </defs>
        {/* Vector arrow */}
        <line
          x1={center}
          y1={center}
          x2={center + radius * 0.7 * Math.cos((reconstruction.vectorAngleDeg - 90) * Math.PI / 180)}
          y2={center + radius * 0.7 * Math.sin((reconstruction.vectorAngleDeg - 90) * Math.PI / 180)}
          stroke="#ef4444"
          strokeWidth="2.5"
          markerEnd="url(#arrowhead)"
        />
      </g>
    ) : null

  const pI = leadPoint('I')
  const pII = leadPoint('II')
  const pIII = leadPoint('III')
  const showEinthoven = reconstruction.canRenderEinthoven && pI && pII && pIII

  const ra = { x: center - 92, y: center - 58 }
  const la = { x: center + 92, y: center - 58 }
  const ll = { x: center, y: center + 96 }
  const c = {
    x: (ra.x + la.x + ll.x) / 3,
    y: (ra.y + la.y + ll.y) / 3,
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Frontal Plane Geometry</h2>
      
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="bg-gray-50 rounded border border-gray-200">
          {/* Center circle */}
          <circle cx={center} cy={center} r={3} fill="#000" />
          
          {/* Reference circle */}
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Cardinal directions */}
          <text x={center + radius + 8} y={center + 4} textAnchor="start" fontSize="10" fill="#999">E</text>
          <text x={center - 12} y={center - radius - 8} textAnchor="end" fontSize="10" fill="#999">N</text>
          <text x={center - radius - 8} y={center + 4} textAnchor="end" fontSize="10" fill="#999">W</text>
          <text x={center + 4} y={center + radius + 16} textAnchor="start" fontSize="10" fill="#999">S</text>
          
          {/* Lead axes */}
          {['I', 'II', 'III', 'aVR', 'aVL', 'aVF'].map((lead) => renderLeadAxis(lead))}

          {/* Einthoven triangle (limb-electrode view) */}
          {showEinthoven && (
            <g>
              <polygon
                points={`${ra.x},${ra.y} ${la.x},${la.y} ${ll.x},${ll.y}`}
                fill="rgba(2, 132, 199, 0.10)"
                stroke="#1d4ed8"
                strokeWidth="3"
              />

              {/* Limb leads I, II, III */}
              <line x1={ra.x} y1={ra.y} x2={la.x} y2={la.y} stroke="#334155" strokeWidth="2" />
              <line x1={ra.x} y1={ra.y} x2={ll.x} y2={ll.y} stroke="#334155" strokeWidth="2" />
              <line x1={la.x} y1={la.y} x2={ll.x} y2={ll.y} stroke="#334155" strokeWidth="2" />

              {/* Augmented leads from center */}
              <line x1={c.x} y1={c.y} x2={ra.x} y2={ra.y} stroke="#64748b" strokeWidth="1.8" strokeDasharray="3 3" />
              <line x1={c.x} y1={c.y} x2={la.x} y2={la.y} stroke="#64748b" strokeWidth="1.8" strokeDasharray="3 3" />
              <line x1={c.x} y1={c.y} x2={ll.x} y2={ll.y} stroke="#64748b" strokeWidth="1.8" strokeDasharray="3 3" />

              {/* Limb nodes */}
              <circle cx={ra.x} cy={ra.y} r={8} fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
              <circle cx={la.x} cy={la.y} r={8} fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
              <circle cx={ll.x} cy={ll.y} r={8} fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />

              <text x={ra.x - 42} y={ra.y - 10} fontSize="10" fill="#1e293b" fontWeight="600">RA (-)</text>
              <text x={la.x + 10} y={la.y - 10} fontSize="10" fill="#1e293b" fontWeight="600">LA (+)</text>
              <text x={ll.x - 16} y={ll.y + 20} fontSize="10" fill="#1e293b" fontWeight="600">LL (+)</text>

              <text x={(ra.x + la.x) / 2 - 8} y={ra.y - 6} fontSize="10" fill="#0f172a" fontWeight="700">I</text>
              <text x={(ra.x + ll.x) / 2 - 12} y={(ra.y + ll.y) / 2} fontSize="10" fill="#0f172a" fontWeight="700">II</text>
              <text x={(la.x + ll.x) / 2 + 4} y={(la.y + ll.y) / 2} fontSize="10" fill="#0f172a" fontWeight="700">III</text>

              <text x={(c.x + ra.x) / 2 - 18} y={(c.y + ra.y) / 2 - 4} fontSize="9" fill="#334155" fontWeight="700">aVR</text>
              <text x={(c.x + la.x) / 2 + 6} y={(c.y + la.y) / 2 - 4} fontSize="9" fill="#334155" fontWeight="700">aVL</text>
              <text x={(c.x + ll.x) / 2 + 6} y={(c.y + ll.y) / 2 + 10} fontSize="9" fill="#334155" fontWeight="700">aVF</text>
            </g>
          )}
          
          {/* Vector */}
          {vectorElement}
        </svg>

        <div className="mt-4 text-sm">
          {showEinthoven && (
            <p className="text-xs text-ecg-700 mb-2 font-medium">Einthoven triangle is active (I, II, III)</p>
          )}
          {reconstruction.vectorAngleDeg !== undefined && (
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-xs text-gray-600">Angle</div>
                <div className="font-semibold text-ecg-600">
                  {reconstruction.vectorAngleDeg.toFixed(1)}°
                </div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-xs text-gray-600">Magnitude</div>
                <div className="font-semibold text-purple-600">
                  {reconstruction.vectorMagnitude?.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

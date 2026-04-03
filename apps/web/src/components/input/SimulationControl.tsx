import React, { useState } from 'react'
import { useSimulation } from '../../hooks'

export const SimulationControl: React.FC = () => {
  const { runSimulation, isLoading } = useSimulation()
  const [angle, setAngle] = useState(45)
  const [magnitude, setMagnitude] = useState(1.0)
  const [noise, setNoise] = useState(0)

  const handleSimulate = async () => {
    await runSimulation(angle, magnitude, undefined, noise)
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Simulation Mode</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Vector Angle: {angle}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Magnitude: {magnitude.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={magnitude}
            onChange={(e) => setMagnitude(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Noise Level: {noise.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={handleSimulate}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-ecg-600 text-white rounded hover:bg-ecg-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Simulating...' : 'Generate ECG'}
        </button>
      </div>
    </div>
  )
}

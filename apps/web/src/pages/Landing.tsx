import React from 'react'

export const LandingPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ecg-900 to-ecg-600 text-white">
      {/* Hero section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">ECG Axis Lab</h1>
        <p className="text-xl text-ecg-50 mb-8 max-w-2xl mx-auto">
          A visual-first web application for exploring ECG lead geometry, 
          frontal-plane projections, and the Einthoven triangle.
        </p>
        
        <div className="mb-12">
          <button
            onClick={onEnterApp}
            className="px-8 py-3 bg-white text-ecg-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Enter App
          </button>
        </div>

        {/* Feature summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-2">Signal Visualization</h3>
            <p className="text-sm text-ecg-50">
              View ECG waveforms from single leads to full 12-lead recordings
            </p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
            <div className="text-2xl mb-2">🧭</div>
            <h3 className="font-semibold mb-2">Geometry Explorer</h3>
            <p className="text-sm text-ecg-50">
              Interactive visualization of lead axes and Einthoven triangle
            </p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-semibold mb-2">Learning Mode</h3>
            <p className="text-sm text-ecg-50">
              Simulate ECG from vector parameters to understand projections
            </p>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white text-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="text-ecg-600 mr-3">✓</span>
                Multiple Input Formats
              </h3>
              <p className="text-gray-700 text-sm">
                CSV waveforms, JSON structured data, and summary metrics
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="text-ecg-600 mr-3">✓</span>
                Adaptive Visualization
              </h3>
              <p className="text-gray-700 text-sm">
                Renders the best geometry view based on available leads
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="text-ecg-600 mr-3">✓</span>
                Built-in Demos
              </h3>
              <p className="text-gray-700 text-sm">
                Learn with curated example datasets
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="text-ecg-600 mr-3">✓</span>
                Simulation Mode
              </h3>
              <p className="text-gray-700 text-sm">
                Generate synthetic ECG from vector parameters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-4xl mx-auto mt-8 rounded">
        <div className="flex">
          <div className="flex-shrink-0 text-yellow-400 text-xl">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <strong>Not a diagnostic tool.</strong> ECG Axis Lab is designed for visual exploration, 
              learning, and signal understanding. It does not classify rhythm, provide diagnoses, or 
              replace professional medical interpretation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

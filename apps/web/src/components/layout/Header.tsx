import React from 'react'

export const Header: React.FC = () => {
  return (
    <header className="bg-ecg-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold">ECG Axis Lab</h1>
        <p className="text-ecg-50 text-sm mt-1">
          Visual exploration of ECG lead geometry and frontal-plane projections
        </p>
      </div>
    </header>
  )
}

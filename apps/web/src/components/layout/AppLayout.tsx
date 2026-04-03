import React from 'react'
import { Header } from '../layout/Header'
import { DataUpload } from '../input/DataUpload'
import { DemoSelector } from '../input/DemoSelector'
import { SimulationControl } from '../input/SimulationControl'
import { TeachingLab } from '../input/TeachingLab'
import { SignalViewer } from '../plots/SignalViewer'
import { FrontalPlaneGeometry } from '../geometry/FrontalPlaneGeometry'
import { DataSummary } from '../layout/DataSummary'
import { useStore } from '../../store'

export const AppLayout: React.FC = () => {
  const { error, isLoading } = useStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mt-4 max-w-7xl mx-auto rounded">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar: Controls */}
          <div className="lg:col-span-3 space-y-4">
            <DataUpload />
            <DemoSelector />
            <TeachingLab />
            <SimulationControl />
            <DataSummary />
          </div>

          {/* Main content: Visualizations */}
          <div className="lg:col-span-9 space-y-4">
            <SignalViewer />
            <FrontalPlaneGeometry />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ecg-600 mx-auto mb-4" />
            <p className="text-gray-700">Processing...</p>
          </div>
        </div>
      )}
    </div>
  )
}

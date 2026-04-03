import React, { useEffect, useState } from 'react'
import { useLoadDemo } from '../../hooks'
import { useStore } from '../../store'
import api from '../../lib/api'
import { DemoMetadata } from '../../types'

export const DemoSelector: React.FC = () => {
  const [demos, setDemos] = useState<DemoMetadata[]>([])
  const [loading, setLoading] = useState(false)
  const { setLoading: setGlobalLoading } = useStore()
  const { loadDemo } = useLoadDemo()

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const demoList = await api.listDemos()
        setDemos(demoList)
      } catch (err) {
        console.error('Failed to load demos:', err)
      }
    }
    fetchDemos()
  }, [])

  const handleLoadDemo = (demoId: string) => {
    setLoading(true)
    setGlobalLoading(true)
    loadDemo(demoId).finally(() => {
      setLoading(false)
      setGlobalLoading(false)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Demo Datasets</h2>
      <div className="grid grid-cols-1 gap-2">
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => handleLoadDemo(demo.id)}
            disabled={loading}
            className="text-left p-3 rounded border border-ecg-200 hover:bg-ecg-50 hover:border-ecg-600 transition-colors disabled:opacity-50"
          >
            <div className="font-medium text-sm">{demo.name}</div>
            <div className="text-xs text-gray-600">{demo.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

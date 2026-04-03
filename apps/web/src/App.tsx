import React, { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './pages/Landing'

export const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'landing' | 'app'>('landing')

  if (appMode === 'landing') {
    return <LandingPage onEnterApp={() => setAppMode('app')} />
  }

  return <AppLayout />
}

export default App

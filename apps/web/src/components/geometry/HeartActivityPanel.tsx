import React from 'react'
import { useStore } from '../../store'

type CardiacStage = 'baseline' | 'p-wave' | 'qrs' | 't-wave'

function getCardiacStage(phaseMs: number, times: Record<string, number>): CardiacStage {
  const p = times.P ?? 180
  const q = times.Q ?? 340
  const s = times.S ?? 390
  const t = times.T ?? 580

  if (phaseMs >= p - 30 && phaseMs <= p + 40) return 'p-wave'
  if (phaseMs >= q - 25 && phaseMs <= s + 20) return 'qrs'
  if (phaseMs >= t - 60 && phaseMs <= t + 80) return 't-wave'
  return 'baseline'
}

export const HeartActivityPanel: React.FC = () => {
  const { reconstruction } = useStore()

  const phase = reconstruction?.teachingPhaseMs
  const beatPeriod = reconstruction?.teachingBeatPeriodMs
  const times = reconstruction?.teachingComponentTimesMs

  if (!reconstruction?.teachingEnabled || phase === undefined || !times) {
    return (
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <h3 className="text-sm font-semibold mb-2">Heart Activity</h3>
        <p className="text-xs text-gray-500">
          Enable the teaching waveform generator to see live cardiac-cycle activity.
        </p>
      </div>
    )
  }

  const stage = getCardiacStage(phase, times)

  const stageText: Record<CardiacStage, string> = {
    baseline: 'Electrical baseline: no dominant wave right now.',
    'p-wave': 'P wave: atrial depolarization is occurring.',
    qrs: 'QRS complex: ventricular depolarization is occurring.',
    't-wave': 'T wave: ventricular repolarization is occurring.',
  }

  const colorByStage: Record<CardiacStage, string> = {
    baseline: '#94a3b8',
    'p-wave': '#16a34a',
    qrs: '#ef4444',
    't-wave': '#7c3aed',
  }

  const pulseScale = stage === 'qrs' ? 1.18 : stage === 'p-wave' || stage === 't-wave' ? 1.08 : 1.0

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3 className="text-sm font-semibold mb-2">Heart Activity</h3>
      <div className="flex items-center gap-4">
        <svg width="120" height="110" viewBox="0 0 120 110" className="shrink-0">
          <g transform={`translate(60 56) scale(${pulseScale}) translate(-60 -56)`}>
            <path
              d="M60 96 C 20 70, 6 45, 20 26 C 30 12, 48 16, 60 30 C 72 16, 90 12, 100 26 C 114 45, 100 70, 60 96 Z"
              fill={colorByStage[stage]}
              opacity="0.85"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        <div className="text-xs text-gray-700 space-y-1">
          <p><span className="font-semibold">Current stage:</span> {stage.toUpperCase()}</p>
          <p>{stageText[stage]}</p>
          <p>
            <span className="font-semibold">Cycle time:</span> {phase.toFixed(0)} ms
            {beatPeriod ? ` / ${beatPeriod.toFixed(0)} ms` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

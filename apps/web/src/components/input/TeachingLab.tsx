import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../../store'
import { ReconstructionResult, SignalRecord } from '../../types'

const FRONTAL_ANGLES: Record<string, number> = {
  I: 0,
  II: -30,
  III: -60,
  aVR: 120,
  aVL: 60,
  aVF: -90,
}

const PRECORDIAL_PHASE: Record<string, number> = {
  V1: -35,
  V2: -20,
  V3: -5,
  V4: 10,
  V5: 20,
  V6: 30,
}

const AVAILABLE_LEADS = [
  'I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6',
]

const MONITOR_PLAYHEAD_FRACTION = 0.6

type ComponentConfig = {
  pAmp: number
  qAmp: number
  rAmp: number
  sAmp: number
  tAmp: number
}

function gaussian(x: number, mu: number, sigma: number): number {
  return Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2))
}

function projectionForLead(lead: string, angleDeg: number, magnitude: number): number {
  if (lead in FRONTAL_ANGLES) {
    const d = (angleDeg - FRONTAL_ANGLES[lead]) * Math.PI / 180
    return magnitude * Math.cos(d)
  }

  const phase = PRECORDIAL_PHASE[lead] ?? 0
  const d = (angleDeg + phase) * Math.PI / 180
  return 0.8 * magnitude * Math.cos(d)
}

function generateLeadSamples(
  lead: string,
  fs: number,
  sampleCount: number,
  hr: number,
  vectorAngleDeg: number,
  vectorMagnitude: number,
  config: ComponentConfig,
  phaseShiftSec: number,
  noise: number,
): number[] {
  const beatPeriod = 60 / hr
  const proj = projectionForLead(lead, vectorAngleDeg, vectorMagnitude)
  const out: number[] = []

  for (let i = 0; i < sampleCount; i++) {
    const t = i / fs + phaseShiftSec
    const beatT = ((t % beatPeriod) + beatPeriod) % beatPeriod

    const p = config.pAmp * gaussian(beatT, 0.18, 0.018)
    const q = -Math.abs(config.qAmp) * gaussian(beatT, 0.34, 0.008)
    const r = config.rAmp * gaussian(beatT, 0.36, 0.010)
    const s = -Math.abs(config.sAmp) * gaussian(beatT, 0.39, 0.010)
    const tw = config.tAmp * gaussian(beatT, 0.58, 0.040)

    const baseline = 0.02 * Math.sin(2 * Math.PI * 0.33 * t)
    const rand = noise > 0 ? (Math.random() * 2 - 1) * noise : 0

    out.push(proj * (p + q + r + s + tw) + baseline + rand)
  }

  return out
}

export const TeachingLab: React.FC = () => {
  const {
    setCurrentData,
    setReconstruction,
    teachingIsPlaying,
    teachingManualTimeMs,
    setTeachingManualTimeMs,
  } = useStore()

  const [enabled, setEnabled] = useState(false)
  const [hr, setHr] = useState(72)
  const [baseAngle, setBaseAngle] = useState(-20)
  const [angleSwing, setAngleSwing] = useState(20)
  const [magnitude, setMagnitude] = useState(1.0)
  const [noise, setNoise] = useState(0.005)
  const [selectedLeads, setSelectedLeads] = useState<string[]>(['I', 'II', 'III', 'aVR', 'aVL', 'aVF'])

  const [pAmp, setPAmp] = useState(0.08)
  const [qAmp, setQAmp] = useState(0.12)
  const [rAmp, setRAmp] = useState(1.00)
  const [sAmp, setSAmp] = useState(0.22)
  const [tAmp, setTAmp] = useState(0.32)

  const [globalTimeMs, setGlobalTimeMs] = useState(0)
  const [aqrsHistoryDeg, setAqrsHistoryDeg] = useState<number[]>([])

  // Use refs to track timing without re-renders
  const startTimeRef = useRef<number | null>(null)
  const rafIdRef = useRef<number | null>(null)

  // Animation loop using requestAnimationFrame for smooth, synchronized timing
  useEffect(() => {
    if (!enabled || !teachingIsPlaying) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      startTimeRef.current = null
      return
    }

    startTimeRef.current = Date.now()
    const resumeBaseMs = teachingManualTimeMs ?? globalTimeMs

    if (teachingManualTimeMs !== null) {
      setTeachingManualTimeMs(null)
    }

    const animate = () => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now())
      setGlobalTimeMs(resumeBaseMs + elapsed)
      rafIdRef.current = requestAnimationFrame(animate)
    }

    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [
    enabled,
    setTeachingManualTimeMs,
    teachingIsPlaying,
    teachingManualTimeMs,
  ])

  useEffect(() => {
    if (teachingManualTimeMs !== null) {
      setGlobalTimeMs(teachingManualTimeMs)
    }
  }, [teachingManualTimeMs])

  const componentConfig = useMemo<ComponentConfig>(() => ({
    pAmp,
    qAmp,
    rAmp,
    sAmp,
    tAmp,
  }), [pAmp, qAmp, rAmp, sAmp, tAmp])

  useEffect(() => {
    if (!enabled) {
      setAqrsHistoryDeg([])
      return
    }

    const dynamicAngle = baseAngle + angleSwing * Math.sin((globalTimeMs / 1000) * 0.2)
    setAqrsHistoryDeg((prev) => [...prev, dynamicAngle].slice(-40))
  }, [angleSwing, baseAngle, enabled, globalTimeMs])

  useEffect(() => {
    if (!enabled) return
    if (selectedLeads.length === 0) return

    // Use manual time if user is dragging, otherwise use animated time
    const currentTimeMs = teachingManualTimeMs !== null ? teachingManualTimeMs : globalTimeMs

    const fs = 500
    const sampleCount = 1200
    const beatPeriodMs = (60 / hr) * 1000
    const beatPeriodSec = beatPeriodMs / 1000
    // Keep NOW aligned with the fixed playhead used by the monitor.
    const monitorWindowSec = sampleCount / fs
    const playheadOffsetSec = monitorWindowSec * MONITOR_PLAYHEAD_FRACTION
    const phaseShiftSec = ((currentTimeMs / 1000) - playheadOffsetSec) % beatPeriodSec
    const beatPhaseMs = ((currentTimeMs) % beatPeriodMs + beatPeriodMs) % beatPeriodMs
    const dynamicAngle = baseAngle + angleSwing * Math.sin((currentTimeMs / 1000) * 0.2)

    const leads: Record<string, number[]> = {}
    selectedLeads.forEach((lead) => {
      leads[lead] = generateLeadSamples(
        lead,
        fs,
        sampleCount,
        hr,
        dynamicAngle,
        magnitude,
        componentConfig,
        phaseShiftSec,
        noise,
      )
    })

    const signal: SignalRecord = {
      sourceType: 'synthetic',
      samplingRateHz: fs,
      units: 'mV',
      leads,
      availableLeads: selectedLeads,
    }

    const frontal = selectedLeads.filter((lead) => lead in FRONTAL_ANGLES)
    const canRenderEinthoven = ['I', 'II', 'III'].every((lead) => selectedLeads.includes(lead))
    const canEstimate = frontal.length >= 2

    const observedValues: Record<string, number> = {}
    frontal.forEach((lead) => {
      const samples = leads[lead]
      observedValues[lead] = samples.reduce((a, b) => a + b, 0) / Math.max(samples.length, 1)
    })

    const projectedValues: Record<string, number> = {}
    frontal.forEach((lead) => {
      projectedValues[lead] = projectionForLead(lead, dynamicAngle, magnitude)
    })

    const reconstruction: ReconstructionResult = {
      canRenderEinthoven,
      canEstimateFrontalVector: canEstimate,
      confidence: 0.9,
      vectorAngleDeg: canEstimate ? dynamicAngle : undefined,
      vectorMagnitude: canEstimate ? magnitude : undefined,
      projectedValues,
      observedValues,
      residualError: 0,
      teachingEnabled: true,
      teachingDynamic: angleSwing !== 0,
      teachingHeartRateBpm: hr,
      teachingBeatPeriodMs: beatPeriodMs,
      teachingPhaseMs: beatPhaseMs,
      teachingGlobalTimeMs: currentTimeMs,
      teachingComponentTimesMs: {
        P: 180,
        Q: 340,
        R: 360,
        S: 390,
        T: 580,
      },
      aqrsHistoryDeg,
      notes: [
        'Teaching mode: generated from explicit P/Q/R/S/T components.',
        `AQRS is the red frontal vector. Current AQRS: ${dynamicAngle.toFixed(1)}°`,
        angleSwing !== 0 ? 'Dynamic mode active: frontal vector angle oscillates over time.' : 'Static mode: fixed frontal vector.',
      ],
    }

    setCurrentData(signal)
    setReconstruction(reconstruction)
  }, [
    angleSwing,
    baseAngle,
    componentConfig,
    enabled,
    globalTimeMs,
    hr,
    magnitude,
    noise,
    selectedLeads,
    setCurrentData,
    setReconstruction,
    teachingManualTimeMs,
    aqrsHistoryDeg,
  ])

  const toggleLead = (lead: string) => {
    setSelectedLeads((prev) => {
      if (prev.includes(lead)) return prev.filter((x) => x !== lead)
      return [...prev, lead]
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">Teaching Lab</h2>
      <p className="text-xs text-gray-600 mb-3">
        Manipulate P, Q, R, S, and T components and watch how lead projections and geometry change.
      </p>

      <label className="inline-flex items-center gap-2 text-xs mb-2">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Enable teaching waveform generator
      </label>

      <div className="space-y-3 text-sm">
        <label className="block">
          <span className="text-xs text-gray-700">Heart rate: {hr} bpm</span>
          <input type="range" min="40" max="160" value={hr} onChange={(e) => setHr(Number(e.target.value))} className="w-full" />
        </label>

        <label className="block">
          <span className="text-xs text-gray-700">Base vector angle: {baseAngle.toFixed(0)}°</span>
          <input type="range" min="-180" max="180" value={baseAngle} onChange={(e) => setBaseAngle(Number(e.target.value))} className="w-full" />
        </label>

        <label className="block">
          <span className="text-xs text-gray-700">Angle swing (dynamic): {angleSwing.toFixed(0)}°</span>
          <input type="range" min="0" max="90" value={angleSwing} onChange={(e) => setAngleSwing(Number(e.target.value))} className="w-full" />
        </label>

        <label className="block">
          <span className="text-xs text-gray-700">Vector magnitude: {magnitude.toFixed(2)}</span>
          <input type="range" min="0.3" max="2.0" step="0.05" value={magnitude} onChange={(e) => setMagnitude(Number(e.target.value))} className="w-full" />
        </label>

        <label className="block">
          <span className="text-xs text-gray-700">Noise: {noise.toFixed(3)}</span>
          <input type="range" min="0" max="0.05" step="0.001" value={noise} onChange={(e) => setNoise(Number(e.target.value))} className="w-full" />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-xs text-gray-700">P: {pAmp.toFixed(2)}</span>
            <input type="range" min="0" max="0.2" step="0.01" value={pAmp} onChange={(e) => setPAmp(Number(e.target.value))} className="w-full" />
          </label>
          <label className="block">
            <span className="text-xs text-gray-700">Q: {qAmp.toFixed(2)}</span>
            <input type="range" min="0.02" max="0.3" step="0.01" value={qAmp} onChange={(e) => setQAmp(Number(e.target.value))} className="w-full" />
          </label>
          <label className="block">
            <span className="text-xs text-gray-700">R: {rAmp.toFixed(2)}</span>
            <input type="range" min="0.2" max="1.6" step="0.02" value={rAmp} onChange={(e) => setRAmp(Number(e.target.value))} className="w-full" />
          </label>
          <label className="block">
            <span className="text-xs text-gray-700">S: {sAmp.toFixed(2)}</span>
            <input type="range" min="0.05" max="0.4" step="0.01" value={sAmp} onChange={(e) => setSAmp(Number(e.target.value))} className="w-full" />
          </label>
          <label className="block col-span-2">
            <span className="text-xs text-gray-700">T: {tAmp.toFixed(2)}</span>
            <input type="range" min="0.05" max="0.6" step="0.01" value={tAmp} onChange={(e) => setTAmp(Number(e.target.value))} className="w-full" />
          </label>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Displayed leads</p>
          <div className="grid grid-cols-3 gap-1 text-xs">
            {AVAILABLE_LEADS.map((lead) => (
              <label key={lead} className="inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead)}
                  onChange={() => toggleLead(lead)}
                />
                {lead}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded bg-blue-50 border border-blue-200 p-2 text-xs text-blue-800">
          P = atrial depolarization, QRS = ventricular depolarization, T = ventricular repolarization.
          Increase R to amplify the main ventricular component; increase angle swing to visualize axis dynamics.
        </div>

        {!enabled && (
          <p className="text-xs text-gray-500">
            Teaching generator is currently off. You can still use demos or upload your own files.
          </p>
        )}
      </div>
    </div>
  )
}

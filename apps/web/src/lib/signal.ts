/**
 * Utility functions for ECG signal processing
 */

/**
 * Calculate signed area under a curve (for summary metric)
 */
export function calculateSignedArea(samples: number[], samplingRate: number = 500): number {
  if (samples.length === 0) return 0
  
  // Trapezoidal integration
  let area = 0
  const dt = 1.0 / samplingRate
  
  for (let i = 0; i < samples.length - 1; i++) {
    area += ((samples[i] + samples[i + 1]) / 2) * dt
  }
  
  return area
}

/**
 * Calculate net amplitude
 */
export function calculateNetAmplitude(samples: number[]): number {
  if (samples.length === 0) return 0
  return Math.max(...samples) - Math.min(...samples)
}

/**
 * Find QRS window using simple amplitude threshold
 */
export function findQRSWindow(
  samples: number[],
  thresholdPercent: number = 20
): [number, number] {
  if (samples.length === 0) return [0, 0]
  
  const max = Math.max(...samples)
  const min = Math.min(...samples)
  const range = max - min
  const threshold = Math.abs(range) * (thresholdPercent / 100)
  
  let start = 0
  let end = samples.length - 1
  
  // Find first sample above threshold
  for (let i = 0; i < samples.length; i++) {
    if (Math.abs(samples[i]) > threshold) {
      start = i
      break
    }
  }
  
  // Find last sample above threshold
  for (let i = samples.length - 1; i >= 0; i--) {
    if (Math.abs(samples[i]) > threshold) {
      end = i
      break
    }
  }
  
  return [start, end]
}

/**
 * Extract samples within time window
 */
export function extractTimeWindow(
  samples: number[],
  windowStart: number,
  windowEnd: number
): number[] {
  return samples.slice(windowStart, windowEnd + 1)
}

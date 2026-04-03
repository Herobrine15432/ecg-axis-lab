# Input Formats

## Supported Input Formats

### 1. CSV Single-Lead Waveform

Comma-separated data with optional time axis.

#### Format A: With Time Column
```csv
time_ms,signal_mV
0,0.02
2,0.03
4,0.05
```

#### Format B: Without Time (Implicit Indexing)
```csv
signal_mV
0.02
0.03
0.05
```

#### Format C: Named Lead
```csv
time_ms,II
0,0.02
2,0.03
4,0.05
```

**Metadata Required (UI):**
- Lead name (if not in header)
- Sampling rate (Hz)
- Units (mV, µV, etc.)
- Time axis unit (ms, sec)

---

### 2. CSV Wide Multi-Lead Waveform

Multiple leads as columns, one row per time point.

```csv
time_ms,I,II,III,aVR,aVL,aVF,V1,V2,V3,V4,V5,V6
0,0.01,0.03,0.02,-0.01,0.00,0.02,0.01,0.02,0.03,0.04,0.05,0.04
2,0.02,0.04,0.02,-0.01,0.01,0.03,0.01,0.03,0.04,0.05,0.06,0.05
4,0.03,0.05,0.02,-0.02,0.02,0.04,0.02,0.04,0.05,0.06,0.07,0.06
```

**Optional:**
- Time column (inferred from row count if absent)
- Any subset of the 12 standard leads
- Different column order

---

### 3. JSON Structured Waveform

Explicit structure with sampling rate and lead data.

```json
{
  "sampling_rate_hz": 500,
  "units": "mV",
  "leads": {
    "I": [0.01, 0.02, 0.01, ...],
    "II": [0.03, 0.04, 0.03, ...],
    "aVF": [0.02, 0.03, 0.02, ...]
  }
}
```

**Required Fields:**
- `leads` (object): Dictionary of lead name → samples array

**Optional Fields:**
- `sampling_rate_hz` (number, default: 500)
- `units` (string, default: "mV")
- `time_axis` (array): Explicit time points (optional)

---

### 4. JSON Summary Input

Pre-computed metrics per lead (for fast reconstruction without raw waveforms).

```json
{
  "summary_type": "signed_area",
  "units": "mV·ms",
  "leads": {
    "I": 0.62,
    "II": 1.01,
    "III": 0.39,
    "aVR": -0.51,
    "aVL": 0.12,
    "aVF": 0.64
  }
}
```

**Required Fields:**
- `leads` (object): Dictionary of lead name → scalar value

**Optional Fields:**
- `summary_type` (string): "signed_area", "net_amplitude", "peak_amplitude" (default: "signed_area")
- `units` (string, default: "mV·ms")

---

## Valid Lead Names

### Supported Names (Normalized)
- **Bipolar (Standard):** I, II, III
- **Augmented (Unipolar Limb):** aVR, aVL, aVF
- **Precordial:** V1, V2, V3, V4, V5, V6

### Aliases (Auto-Mapped to Standard)
- aVR can also be written as avR, AVR, av_R (case-insensitive, whitespace-agnostic)
- Similarly for other leads

### Unknown Leads
- Leads not in the standard list are silently skipped
- A warning is displayed if > 50% of input leads are unrecognized

---

## Sampling Rates

### Standard Rates
- 250 Hz (common in portable devices)
- 500 Hz (standard hospital equipment)
- 1000 Hz (high-frequency acquisition)

### Custom Rates
- Any positive integer is accepted
- App adapts time axis accordingly
- Default if not specified: 500 Hz

---

## Summary Metrics

### Definitions

**Signed Area** (default):
$$\text{Area} = \sum_{i=0}^{n-1} \frac{y_i + y_{i+1}}{2} \times \Delta t$$

Used for: Vector estimation, capturing net electrical impulse

**Net Amplitude**:
$$\text{Amplitude} = \max(y) - \min(y)$$

Used for: Simple magnitude measure, less sensitive to shape

**Peak Amplitude**:
$$\text{Peak} = \max(|y|)$$

Used for: Single dominant feature extraction

---

## Built-in Demo Data

### Demo 1: Single Lead
- Lead: II only
- Samples: 500 @ 500 Hz (1 second)
- Source: Synthetic

### Demo 2: Einthoven Triangle
- Leads: I, II, III
- Samples: 500 @ 500 Hz
- Features: Relationship demonstration

### Demo 3: Frontal Six
- Leads: I, II, III, aVR, aVL, aVF
- Samples: 500 @ 500 Hz
- Features: Hexaxial geometry

### Demo 4: Full Twelve
- Leads: All 12 standard
- Samples: 500 @ 500 Hz
- Features: Complete ECG representation

### Demo 5: Synthetic
- Parametric generation on-the-fly
- User-controlled vector angle and magnitude

---

## Validation Rules

1. **All leads must have same sample count**
   - If not, truncate to minimum

2. **Lead names must be recognized**
   - Unknown leads are skipped with warning

3. **Sampling rate must be positive**
   - Default to 500 Hz if missing

4. **Sample values must be numeric**
   - Non-numeric entries cause parsing error

5. **At least one lead required**
   - Empty input is rejected

---

## Error Handling

### Recoverable Errors (Continue with Available Data)
- Unknown lead names (skip silently or warn)
- Missing optional fields (use defaults)
- Mismatched lead lengths (truncate to min)

### Fatal Errors (Reject Input)
- No leads provided
- Invalid JSON/CSV syntax
- All leads unrecognized
- Sampling rate ≤ 0

---

## Example Workflows

### Scenario 1: Upload CSV from Device
1. Export ECG as CSV from device
2. Drag into app
3. App detects columns: `time, I, II, III, aVR, aVL, aVF, V1, ...`
4. App auto-detects sampling rate from time column
5. Reconstruction performed on all frontal leads
6. Visualization displayed

### Scenario 2: Enter Summary Metrics Manually
1. User has only summary data from another source
2. Selects "Summary Input" mode
3. Enters lead names and values
4. Selects metric type (signed area, etc.)
5. Reconstruction performed
6. Visualization displayed

### Scenario 3: Use Simulation
1. No data needed
2. User sets vector parameters
3. Synthetic waveforms generated
4. Projections computed and displayed
5. User can vary angle/magnitude in real-time

---

## Rate Limits & Constraints

- **Max samples per lead:** 100,000 (>100 sec @ 1000 Hz)
- **Max leads:** 12 (standard ECG)
- **Max JSON size:** 10 MB

If exceeded, rejection with clear error message.

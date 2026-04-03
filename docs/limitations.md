# Limitations and Constraints

ECG Axis Lab is a **visualization and learning tool**, not a clinical system. This document outlines its limitations.

## Scope Limitations

### What This Tool Does NOT Do

1. **Not a diagnostic system**
   - Does not classify rhythm (normal sinus, AFib, etc.)
   - Does not detect pathology (MI, LVH, etc.)
   - Does not provide axis categories (normal, left deviation, etc.)
   - Does not provide medical decision support

2. **Not a production ECG reader**
   - No real-time monitoring
   - No integration with hospital records
   - No audit trail or regulatory compliance
   - Not validated for clinical use

3. **Not a signal processing toolkit**
   - No automatic beat detection
   - No P/QRS/T delineation
   - No artifact removal or filtering
   - No noise reduction

4. **Not PDF/image capable**
   - Cannot scan or OCR ECG documents
   - Only accepts tabular data formats

## Mathematical Limitations

1. **Single-point projection**
   - Uses one summary value per lead (e.g., signed area)
   - Does not track temporal evolution of the vector during the QRS
   - Assumes "average" vector over the window

2. **2D geometry only**
   - Frontal plane only (0°, ±90°, 180°)
   - Ignores anterior-posterior depth (sagittal plane)
   - Precordial leads shown as context, not geometry

3. **Linear model**
   - No saturation curves
   - No amplitude normalization
   - Direct scalar projection onto lead axes

4. **Simplified Einthoven**
   - Assumes perfect 60° triangle
   - No accounting for anatomical variation
   - No body habitus correction

## Data Limitations

1. **Sample format only**
   - Requires numeric time-series data
   - Cannot infer from image or PDF
   - Cannot parse unstructured text reports

2. **No lead validation**
   - Trusts user-provided lead labels
   - Cannot confirm lead placement quality
   - No detection of swapped or reversed leads

3. **No preprocessing**
   - User must provide clean data
   - No automatic baseline drift removal
   - No 60 Hz filter or high-frequency rejection

4. **Implicit assumptions**
   - Assumes valid lead placements (standard positions)
   - Assumes normal electrical axis range concept (not enforced)
   - Assumes data is normalized to typical mV scale

## Confidence Limitations

1. **Confidence score is heuristic**
   - Based on number of leads and residual error
   - Not validated against clinical gold standard
   - Should not be interpreted as clinical accuracy

2. **Single-window estimate**
   - Uses one averaged value per lead
   - Does not consider beat-to-beat variation
   - Does not track temporal evolution

3. **Residual-based confidence**
   - Low residual does not guarantee correct vector
   - May fit noise as well as signal
   - Not a measure of clinical relevance

## Input Data Issues

1. **No quality assessment**
   - Does not detect poor recording quality
   - Does not identify excessive noise
   - Does not detect lead disconnection

2. **Limited error handling**
   - Silently skips unknown leads
   - Truncates mismatched lead lengths
   - May produce nonsensical results from bad inputs

3. **No delineation**
   - Cannot identify QRS window automatically
   - Requires user to crop to QRS window (future feature)
   - May include T wave or other components if not specified

## Visualization Limitations

1. **Static displays**
   - No beat-to-beat animation
   - No loop display (Lissajous patterns)
   - No 3D rotation

2. **Limited geometric rendering**
   - SVG-based, not GPU-accelerated
   - No interactive 3D projection
   - No point cloud or density visualization

3. **No comparative features**
   - Cannot overlay multiple ECGs
   - Cannot show before/after
   - Cannot track changes over time

## Performance Limitations

1. **Sample count**
   - Optimized for ~500-5000 samples per lead
   - High sample counts (>100k) may be slow
   - No streaming or windowed processing

2. **Number of leads**
   - Supports up to 12 leads (standard ECG)
   - Not tested with >12 leads
   - Geometry rendering limited to 6 frontal leads

3. **Computational precision**
   - Double-precision floating-point
   - ~15-17 significant digits
   - Sufficient for medical ranges

## Future Improvements (Post-MVP)

- Automatic QRS window detection
- Beat delineation and classification
- Precordial plane visualization
- Time-series animation (vector evolution)
- Multi-patient comparison
- Advanced noise/artifact filtering
- Lead validity checking
- Clinical validation studies

## Recommended Use Cases

✓ Learning and teaching ECG concepts
✓ Exploring geometric relationships
✓ Understanding lead projections
✓ Simulation and parameter study
✓ Signal visualization and inspection
✓ Research and pedagogy

## Not Recommended For

✗ Clinical diagnosis
✗ Patient monitoring
✗ Decision support
✗ Regulatory or compliance purposes
✗ Automated diagnosis systems
✗ Real-time cardiac monitoring

## Always Remember

**This tool is for exploration and learning, not clinical care.**

If interpreting real patient ECGs:
- Always involve qualified healthcare professionals
- Follow established clinical protocols
- Use FDA-cleared or hospital-validated systems
- Do not rely solely on ECG Axis Lab output

---

*For questions or to report issues with this tool's behavior, please open an issue on GitHub.*

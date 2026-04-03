# Product Specification

## Overview

ECG Axis Lab is a visual-first web application for exploring ECG lead geometry and frontal-plane projections. It is designed for **educational purposes, learning, and transparent signal exploration**—not for clinical diagnosis.

## Core Philosophy

1. **Transparent**: All mathematics are simple, documented, and inspectable
2. **Visual**: Focus on geometric relationships and spatial understanding
3. **Adaptive**: Responds gracefully to available lead data
4. **Non-diagnostic**: Never classifies, diagnoses, or makes clinical recommendations
5. **Learner-focused**: Includes simulation and teaching modes

## Main Capabilities by Input Level

### Level 1: Single Lead
- Waveform viewer
- Single-axis projection
- Optional beat/QRS selection
- No multi-lead geometry

### Level 2: Two Frontal Leads
- Both waveforms displayed
- Both lead axes shown
- Limited 2D vector estimate (marked as partial)

### Level 3: Three Bipolar Leads (I, II, III)
- Einthoven triangle rendering
- Triple-lead projection relationships
- Frontal vector estimate

### Level 4: Six Frontal Leads
- Hexaxial reference system
- Full frontal-plane geometry
- Robust vector estimation
- Projection comparison

### Level 5: Full 12-Lead ECG
- All waveforms viewable
- Geometry focus remains on frontal leads
- Precordial context

## MVP Feature Set

### Essential
- [x] Signal waveform visualization (Plotly)
- [x] CSV/JSON upload and parsing
- [x] Normalized lead handling
- [x] Frontal-plane vector estimation (least-squares)
- [x] Einthoven triangle detection
- [x] Adaptive geometry rendering (SVG)
- [x] Built-in demo data
- [x] Simulation mode
- [x] Data summary panel

### Nice to Have (Future)
- [ ] Drag-and-drop CSV upload
- [ ] Advanced preprocessing pipelines
- [ ] Export functionality
- [ ] Beat annotation
- [ ] Time-series animation
- [ ] Multi-patient comparison
- [ ] Offline mode

### Out of Scope
- PDF/image parsing
- Delineation algorithms
- Diagnostic classifiers
- Clinical validation

## User Workflows

### Workflow 1: Explore a Demo
1. User lands on homepage
2. Clicks "Enter App"
3. Selects a demo from sidebar
4. Waveforms and geometry displayed
5. Modifies simulation parameters
6. Observes changed projections

### Workflow 2: Upload Own Data
1. User uploads CSV or JSON file
2. System auto-detects leads
3. Reconstruction computed
4. Results displayed
5. User can manipulate via simulation mode

### Workflow 3: Learn via Simulation
1. User sets vector angle (slider)
2. User sets magnitude (slider)
3. Specifies which leads to show
4. Synthetic ECG generated
5. Geometric projection visualized
6. User understands lead-vector relationship

## Non-Goals

- Rhythm classification (normal sinus, atrial fib, etc.)
- Axis categories ("normal", "left deviation", etc.)
- Pathology labels ("posterior MI", "LVH", etc.)
- Machine learning predictions
- Clinical decision support
- Real-time monitoring
- Integration with hospital systems

## Success Criteria for MVP

1. **Robustness**: Handles single lead to 12-lead inputs without crashing
2. **Clarity**: UI is intuitive; controls are obvious
3. **Accuracy**: Vector estimates match synthetic ground truth within tolerance
4. **Speed**: User interactions < 500ms latency
5. **Usability**: New user can load demo and adjust parameters in < 30 seconds
6. **Documentation**: Code is well-commented; API is self-documenting

## Performance Targets

- Page load: < 2 seconds
- Waveform rendering (500-1000 samples): < 100ms
- Vector reconstruction: < 50ms
- Simulation generation: < 100ms
- JSON parsing: < 50ms

## Data Privacy & Security

- No data sent to third parties
- All APIs CORS-enabled for localhost development
- No authentication required (educational tool)
- No data persistence (client-side session only)
- No analytics or tracking

## Accessibility

- Clean, readable typography
- High-contrast color scheme
- Keyboard navigation support (future)
- Semantic HTML

## Browser Support

- Modern Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile-responsive design (optional for MVP)

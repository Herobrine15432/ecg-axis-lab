# ECG Axis Lab

A visual-first web application for exploring ECG lead geometry, frontal-plane projections, and the Einthoven triangle. This is an educational and exploratory tool focused on geometric visualization—not a diagnostic system.

## Features

- **Signal Visualization**: View ECG waveforms from single leads to full 12-lead recordings
- **Lead Geometry**: Explore lead axes and their spatial relationships in the frontal plane
- **Einthoven Triangle**: Visualize the relationship between bipolar and limb leads
- **Frontal Vector Estimation**: Estimate the mean frontal-plane vector from available leads
- **Simulation Mode**: Generate synthetic ECG waveforms from vector parameters to learn projection concepts
- **Multiple Input Formats**: CSV, JSON waveforms, and pre-computed summary metrics
- **Adaptive Visualization**: Renders the best geometric view based on available leads
- **Built-in Demos**: Learn with curated example datasets

## Supported Input Formats

### Phase 1 (MVP)

- **CSV single-lead waveform**: Time-value pairs, optionally with metadata
- **CSV wide multi-lead waveform**: Multiple columns per lead
- **JSON structured waveform**: Sampling rate, units, and lead data
- **JSON summary input**: Pre-computed metrics (signed area, net amplitude) per lead
- **Built-in demos**: Curated example datasets
- **Simulation mode**: Generate synthetic data from vector parameters

### Phase 2 (Future)

- JSON long-format waveform data
- Additional preprocessing pipelines

## Not Implemented (Out of MVP Scope)

- Image/PDF ECG parsing
- Rhythm classification
- Diagnostic interpretation
- Medical decision support
- Heavy signal processing pipelines (delineation, beat detection, etc.)

## Tech Stack

### Backend
- **Python 3.11**
- **FastAPI** - Web framework
- **NumPy/SciPy** - Numerical and scientific computing
- **Pandas** - Data manipulation
- **Pydantic** - Data validation
- **pytest** - Testing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Plotly.js** - Waveform visualization
- **Zustand** - State management
- **Axios** - HTTP client

### Environment Management
- **Miniconda** (backend)
- **npm** (frontend)

## Project Structure

```
ecg-axis-lab/
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  │  ├─ input/
│  │  │  │  ├─ plots/
│  │  │  │  ├─ geometry/
│  │  │  │  └─ layout/
│  │  │  ├─ pages/
│  │  │  ├─ hooks/
│  │  │  ├─ store/
│  │  │  ├─ lib/
│  │  │  ├─ types/
│  │  │  └─ styles/
│  │  └─ public/
│  └─ api/
│     ├─ app/
│     │  ├─ api/
│     │  ├─ core/
│     │  ├─ models/
│     │  ├─ services/
│     │  └─ utils/
│     ├─ tests/
│     └─ environment.yml
├─ data/
│  ├─ demos/
│  │  ├─ single_lead/
│  │  ├─ einthoven/
│  │  ├─ frontal_six/
│  │  ├─ full_twelve/
│  │  └─ synthetic/
│  └─ fixtures/
├─ docs/
├─ notebooks/
├─ .github/
├─ README.md
└─ LICENSE
```

## Local Setup

### Prerequisites

- Python 3.11+ with Miniconda
- Node.js 18+ and npm
- Git

### Backend Setup

1. Create conda environment:
```bash
cd apps/api
conda env create -f environment.yml
conda activate ecg-axis-lab
```

2. Run tests:
```bash
pytest tests/
```

3. Start API server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Frontend Setup

1. Install dependencies:
```bash
cd apps/web
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

3. Build for production:
```bash
npm run build
```

## Running Together

For full local development:

**Terminal 1 (Backend):**
```bash
cd apps/api
conda activate ecg-axis-lab
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd apps/web
npm run dev
```

Then open `http://localhost:5173` in your browser.

## API Endpoints

### Core Endpoints

- **POST** `/api/reconstruct/frontal` - Reconstruct frontal geometry from waveforms
- **POST** `/api/reconstruct/summary` - Reconstruct from pre-computed metrics
- **POST** `/api/simulate` - Generate synthetic ECG from vector parameters
- **GET** `/api/demos` - List available demo datasets
- **GET** `/api/demos/{demo_id}` - Load a specific demo

### Utility Endpoints

- **GET** `/` - API info
- **GET** `/health` - Health check
- **POST** `/api/parse/csv-waveform` - Parse CSV waveform
- **POST** `/api/parse/json-waveform` - Parse JSON waveform

Full interactive API documentation available at `/docs`

## Methodology

### Data Model

The backend uses a unified internal data model:

- **SignalRecord**: Complete ECG with multiple leads, sampling rate, and metadata
- **LeadSignal**: Single lead data with unit and orientation information
- **LeadSummary**: Pre-computed metric (signed area, amplitude, etc.)
- **ReconstructionResult**: Geometry output with confidence and notes

### Supported Leads

**Standard 12-lead:**
- Bipolar: I, II, III
- Augmented: aVR, aVL, aVF
- Precordial: V1, V2, V3, V4, V5, V6

**Geometry focus:** Frontal leads (I, II, III, aVR, aVL, aVF)

### Vector Estimation

The application estimates a frontal-plane vector from lead projections using least-squares fitting:

$$\text{projection} = \text{magnitude} \times \cos(\text{vector angle} - \text{lead angle})$$

This approach is transparent and fully documented in the code.

### Graceful Degradation

- **1 lead**: Single-axis projection view
- **2+ frontal leads**: Partial 2D vector estimate (marked as limited)
- **3 bipolar leads (I, II, III)**: Einthoven triangle rendering
- **6 frontal leads**: Full hexaxial geometric view
- **12 leads**: All waveforms plus frontal-plane focus

## Supported Use Cases

✓ Visual exploration of ECG geometry
✓ Learning and teaching ECG concepts
✓ Understanding lead projections
✓ Comparing observation with geometric reconstruction
✓ Simulation and synthetic ECG generation

✗ Diagnostic interpretation
✗ Rhythm classification
✗ Pathology detection
✗ Clinical decision support

## Screenshots

[Screenshots to be added]

## Limitations

1. **No delineation**: Does not automatically identify P, QRS, T waves
2. **Simple preprocessing**: Basic signed-area metric; no artifact removal
3. **Frontal-plane only**: Precordial leads shown as context, not core geometry
4. **No temporal dynamics**: Visualization assumes steady-state projections
5. **Educational focus**: Not validated for clinical use

See `docs/limitations.md` for detailed constraints.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Submit a pull request

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Disclaimer

**This is not a diagnostic tool.** ECG Axis Lab is designed for visual exploration, learning, and signal understanding. It does not:
- Classify rhythm or axis
- Provide medical diagnoses
- Replace professional ECG interpretation
- Make clinical recommendations

Always consult qualified healthcare professionals for clinical ECG interpretation.

## References

- Einthoven, W., Fahr, G., & de Waart, A. (1913). "Über die Richtung und die Manifest. der Potentialschwankungen im menschlichen Herzen"
- Goldberger, A. L. (1949). "Unipolar Lead AVR, AVL, AVF"
- Wagner, G. S. (2011). Marriott's Practical Electrocardiography, 12th Edition

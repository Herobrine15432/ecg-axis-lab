# Development Guide

## Getting Started

### Quick Start (5 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/ecg-axis-lab.git
cd ecg-axis-lab

# Terminal 1: Backend
cd apps/api
conda env create -f environment.yml
conda activate ecg-axis-lab
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd apps/web
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Project Structure Overview

### Backend Structure (`apps/api/`)

```
app/
├─ main.py              # FastAPI entry point
├─ api/
│  └─ routes.py         # REST API endpoints
├─ core/
│  ├─ config.py         # Settings and configuration
│  ├─ constants.py      # Lead definitions, angles, etc.
│  └─ __init__.py
├─ models/
│  ├─ schemas.py        # Pydantic models
│  └─ __init__.py
├─ services/
│  ├─ geometry.py       # Vector estimation, reconstruction
│  ├─ simulation.py     # Synthetic ECG generation
│  ├─ parsing.py        # CSV/JSON parsing
│  └─ __init__.py
└─ utils/
   ├─ lead_validator.py # Lead name validation
   └─ __init__.py

tests/
├─ test_geometry.py     # Geometry logic tests
├─ test_parsing.py      # Parsing logic tests
├─ test_simulation.py   # Simulation logic tests
└─ conftest.py          # Pytest configuration
```

### Frontend Structure (`apps/web/`)

```
src/
├─ main.tsx             # Entry point
├─ App.tsx              # Root component
├─ index.html           # HTML template
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx
│  │  ├─ AppLayout.tsx
│  │  └─ DataSummary.tsx
│  ├─ input/
│  │  ├─ DemoSelector.tsx
│  │  └─ SimulationControl.tsx
│  ├─ plots/
│  │  └─ SignalViewer.tsx
│  └─ geometry/
│     └─ FrontalPlaneGeometry.tsx
├─ pages/
│  └─ Landing.tsx       # Landing page
├─ hooks/
│  └─ index.ts          # Custom hooks
├─ store/
│  └─ index.ts          # Zustand store
├─ lib/
│  ├─ api.ts            # API client
│  └─ signal.ts         # Signal utilities
├─ types/
│  └─ index.ts          # TypeScript types
└─ styles/
   └─ globals.css       # Global styles
```

## Running Tests

### Backend Tests

```bash
cd apps/api
conda activate ecg-axis-lab
pytest tests/ -v
pytest tests/ -v --cov=app  # With coverage
```

### Frontend Tests (Future)

```bash
cd apps/web
npm test
```

## API Documentation

Once the backend is running, visit:
- **Interactive API docs:** `http://localhost:8000/docs`
- **Alternative docs:** `http://localhost:8000/redoc`

## Adding a New Feature

### Example: Add a new reconstruction method

1. **Add logic to backend service:**
   ```python
   # apps/api/app/services/geometry.py
   def new_reconstruction_method(lead_values):
       # Implementation
       pass
   ```

2. **Add API endpoint:**
   ```python
   # apps/api/app/api/routes.py
   @router.post("/reconstruct/new-method")
   async def reconstruct_new(request: SummaryUploadRequest):
       result = new_reconstruction_method(request.leads)
       return result.model_dump()
   ```

3. **Test it:**
   ```python
   # apps/api/tests/test_geometry.py
   def test_new_reconstruction_method():
       result = new_reconstruction_method({"I": 0.5, "II": 0.8})
       assert result is not None
   ```

4. **Call from frontend:**
   ```typescript
   // apps/web/src/lib/api.ts
   async newReconstruct(leads) {
       const response = await apiClient.post('/reconstruct/new-method', { leads })
       return response.data
   }
   ```

## Code Style

### Python
- Follow PEP 8
- Use type hints
- Docstrings for all public functions
- Tests required for new functions

### TypeScript/React
- Use functional components with hooks
- Type all props and return values
- Use Tailwind classes for styling
- Prefer composition over inheritance

## Debugging

### Backend Debugging

```python
# Add print statements (shown in terminal)
print(f"Debug: {variable}")

# Or use Python debugger
import pdb; pdb.set_trace()
```

### Frontend Debugging

- Open browser DevTools (F12)
- Use React Developer Tools extension
- Check console for errors
- Use `console.log()` for debugging

## Common Tasks

### Add a new demo dataset

1. Create JSON file in `data/demos/{demo_id}/demo.json`
2. Include leads, sampling rate, and metadata
3. Backend auto-discovers via `/api/demos` endpoint

### Update lead angles

```python
# apps/api/app/core/constants.py
LEAD_ANGLES_DEG = {
    "I": 0.0,
    "II": -30.0,
    # ...
}
```

### Modify the Frontal Plane visualization

```typescript
// apps/web/src/components/geometry/FrontalPlaneGeometry.tsx
// Adjust SVG rendering, colors, lead positioning
```

### Add new API endpoint

1. Create route in `apps/api/app/api/routes.py`
2. Add request/response schema if needed
3. Implement business logic in services
4. Add tests
5. Update React API client (`apps/web/src/lib/api.ts`)
6. Create UI component to use it

## Troubleshooting

### "Module not found" errors (Backend)

```bash
cd apps/api
python -m pip install -e .
# or re-create environment
conda env remove -n ecg-axis-lab
conda env create -f environment.yml
conda activate ecg-axis-lab
```

### "Cannot find module" (Frontend)

```bash
cd apps/web
rm -rf node_modules package-lock.json
npm install
```

### Port already in use

```bash
# Backend (8000)
uvicorn app.main:app --reload --port 8001

# Frontend (5173)
npm run dev -- --port 5174
```

### CORS errors

Check `apps/api/app/core/config.py`:
```python
CORS_ORIGINS = ["http://localhost:5173", ...]
```

## Performance Profiling

### Backend Profiling

```python
import cProfile
import pstats

pr = cProfile.Profile()
pr.enable()
# ... code to profile ...
pr.disable()
ps = pstats.Stats(pr)
ps.print_stats()
```

### Frontend Profiling

Use React Profiler in DevTools or Chrome Performance tab.

## Release Checklist

- [ ] All tests pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Version bumped in setup files
- [ ] CHANGELOG entry added
- [ ] Built frontend (`npm run build`)
- [ ] Tag created in git

## Getting Help

- Check existing GitHub issues
- Read inline code comments
- Review test cases for examples
- Consult documentation in `docs/` directory

## Next Steps (Post-MVP)

- [ ] Automated beat detection
- [ ] P/QRS/T delineation
- [ ] Time-series animation
- [ ] 3D frontal-plane visualization
- [ ] Multi-patient comparison
- [ ] Advanced filtering options
- [ ] Export to PDF/PNG
- [ ] Collaborative features

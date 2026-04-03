# Installation Guide

This guide walks you through setting up ECG Axis Lab for development or local deployment.

## Prerequisites

Before starting, ensure you have:

1. **Python 3.11 or later** with Miniconda
   - Download: https://docs.conda.io/en/latest/miniconda.html
   - Check: `python --version`

2. **Node.js 18+ and npm**
   - Download: https://nodejs.org/
   - Check: `node --version` and `npm --version`

3. **Git**
   - Download: https://git-scm.com/
   - Check: `git --version`

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/herobrine15432/ecg-axis-lab.git
cd ecg-axis-lab
```

Note: this repository is highly experimental and may receive infrequent updates.

### 2. Backend Setup

```bash
# Navigate to backend directory
cd apps/api

# Create conda environment from environment.yml
conda env create -f environment.yml

# Activate environment
conda activate ecg-axis-lab

# Verify installation
python -c "import fastapi; print(f'FastAPI {fastapi.__version__} installed')"
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from repo root)
cd apps/web

# Install dependencies via npm
npm install

# Verify installation
npm list react react-dom  # Should show versions
```

## Running the Application

### Terminal 1: Start Backend

```bash
cd apps/api
conda activate ecg-axis-lab
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**Access points:**
- API Health: http://localhost:8000/health
- Interactive Docs: http://localhost:8000/docs
- API Root: http://localhost:8000/

### Terminal 2: Start Frontend

```bash
cd apps/web
npm run dev
```

You should see:
```
VITE v5.0.8 ready in XXX ms

Local: http://localhost:5173/
```

### Open in Browser

Visit: **http://localhost:5173/**

You should see the ECG Axis Lab landing page.

## Verification Checklist

- [ ] Backend API running on port 8000
- [ ] Frontend running on port 5173
- [ ] Browser loads http://localhost:5173 without errors
- [ ] "Enter App" button works
- [ ] Demo selector shows demo options
- [ ] Clicking a demo loads data
- [ ] Browser DevTools console shows no errors

## Running Tests

### Backend Tests

```bash
cd apps/api
conda activate ecg-axis-lab
pytest tests/ -v
```

Expected output:
```
tests/test_geometry.py::test_project_vector_to_lead PASSED
tests/test_geometry.py::test_estimate_frontal_vector PASSED
...
```

### Run with Coverage Report

```bash
cd apps/api
pytest tests/ --cov=app --cov-report=html
# Coverage report in htmlcov/index.html
```

## Troubleshooting

### Issue: "conda: command not found"

**Solution:**
- Install Miniconda: https://docs.conda.io/en/latest/miniconda.html
- Or use pip with venv:
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

### Issue: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
```bash
conda activate ecg-axis-lab
conda install -c conda-forge fastapi uvicorn
```

### Issue: "npm ERR! code ERESOLVE"

**Solution:**
```bash
cd apps/web
npm install --legacy-peer-deps
```

### Issue: "Port 8000 already in use"

**Solution:**
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
# Update frontend proxy in vite.config.ts
```

### Issue: "Cannot GET /" (404 on frontend)

**Solution:**
- Ensure backend is running on port 8000
- Check CORS settings in `apps/api/app/core/config.py`
- Verify frontend proxy in `apps/web/vite.config.ts`

### Issue: CORS error in browser console

**Solution:**
Add your frontend URL to `CORS_ORIGINS` in backend config:
```python
# apps/api/app/core/config.py
CORS_ORIGINS = ["http://localhost:5173", "http://localhost:3000"]
```

### Issue: "TypeError: Cannot read property 'length' of undefined"

**Solution:**
- Ensure backend `/api/demos` endpoint is responding
- Check browser DevTools Network tab
- Verify API client URL in frontend

## Environment Variables

### Frontend (`apps/web/.env`)

```env
VITE_API_URL=http://localhost:8000
```

### Backend (`apps/api/.env`)

```env
DEBUG=True
API_TITLE=ECG Axis Lab API
API_VERSION=0.1.0
CORS_ORIGINS=["http://localhost:5173"]
```

## Next Steps

1. **Read the Documentation:**
   - [Product Specification](docs/product-spec.md)
   - [Input Formats](docs/input-formats.md)
   - [Mathematical Model](docs/math-model.md)
   - [Limitations](docs/limitations.md)

2. **Explore the Code:**
   - [Development Guide](DEVELOPMENT.md)
   - Backend: `apps/api/app/`
   - Frontend: `apps/web/src/`

3. **Try Some Demos:**
   - Load demo datasets from the UI
   - Adjust simulation parameters
   - Explore the geometry visualization

4. **Try Your Own Data:**
   - Prepare CSV or JSON file with ECG data
   - Upload via the UI (future feature)
   - Or manually call API endpoints via Swagger docs

## Production Deployment

For production use, see deployment guides in `docs/` (future).

## Support

- **Bug reports:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Documentation:** See `docs/` directory

## License

MIT License - see [LICENSE](LICENSE) file.

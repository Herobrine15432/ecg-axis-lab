# Quick Start Guide

Get ECG Axis Lab running in 5 minutes.

## Prerequisites

- Python 3.11+ with Miniconda installed
- Node.js 18+ installed
- Git

## One-Command Setup (Bash/Zsh)

```bash
# Clone and setup everything
git clone https://github.com/herobrine15432/ecg-axis-lab.git && cd ecg-axis-lab
cd apps/api
conda env create -f environment.yml -y
cd ../web
npm install
```

Note: this repository is highly experimental and may receive infrequent updates.

## Start the Application

**Terminal 1 (Backend):**
```bash
cd apps/api
conda activate ecg-axis-lab
uvicorn app.main:app --reload
```

Expected output:
```
Uvicorn running on http://127.0.0.1:8000
```

**Terminal 2 (Frontend):**
```bash
cd apps/web
npm run dev
```

Expected output:
```
Local: http://localhost:5173/
```

## Test Installation

**Backend:** Open http://localhost:8000/docs
- Should see Swagger API documentation

**Frontend:** Open http://localhost:5173
- Should see ECG Axis Lab landing page
- Click "Enter App"
- Click any demo
- Should load data and display visualization

## Common Errors & Quick Fixes

| Error | Fix |
|-------|-----|
| `conda: command not found` | Install Miniconda: https://docs.conda.io/en/latest/miniconda.html |
| Port 8000 in use | Change: `--port 8001` |
| `npm: command not found` | Install Node.js: https://nodejs.org/ |
| CORS error in browser | Ensure backend running on port 8000 |
| Module not found | `cd apps/api && pip install -e .` or re-create conda env |

## Next Steps

1. **Read Documentation:**
   - [Installation Guide](INSTALLATION.md) - Detailed setup
   - [Development Guide](DEVELOPMENT.md) - Code structure
   - [API Docs](http://localhost:8000/docs) - Live API docs

2. **Try Features:**
   - Load demo datasets
   - Adjust simulation parameters
   - Explore geometry visualization

3. **Run Tests:**
   ```bash
   cd apps/api
   pytest tests/ -v
   ```

4. **Deploy:**
   - See deployment docs (future)

## Project Files Map

| What | Where |
|------|-------|
| Backend code | `apps/api/app/` |
| Frontend code | `apps/web/src/` |
| Documentation | `docs/` |
| Demo data | `data/demos/` |
| Tests | `apps/api/tests/` |
| Setup | `apps/*/environment.yml`, `apps/web/package.json` |

## Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /docs` | Interactive API docs |
| `GET /health` | Health check |
| `POST /api/simulate` | Generate synthetic ECG |
| `GET /api/demos` | List demos |
| `GET /api/demos/{id}` | Load demo data |
| `POST /api/reconstruct/frontal` | Vector reconstruction |

## Support

- Setup issues: See [INSTALLATION.md](INSTALLATION.md)
- Development: See [DEVELOPMENT.md](DEVELOPMENT.md)
- Math: See [docs/math-model.md](docs/math-model.md)
- Issues: GitHub Issues
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)

---

Ready to go. Questions? Check the documentation or open an issue.

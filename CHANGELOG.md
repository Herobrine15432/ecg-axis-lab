# Changelog

All notable changes to ECG Axis Lab will be documented in this file.

## [0.1.0] - 2026-04-03

### Added (MVP Release)

#### Backend
- FastAPI application with CORS support
- Lead geometry and vector estimation algorithms
- ECG signal simulation from vector parameters
- CSV/JSON waveform and summary data parsing
- Lead name validation and normalization
- Frontal-plane vector estimation via least-squares
- Einthoven triangle detection
- Built-in demo data endpoints
- Comprehensive API documentation (Swagger)
- Unit tests for geometry, parsing, and simulation modules

#### Frontend
- React application with TypeScript
- Vite build system with hot reload
- Tailwind CSS styling
- Zustand store for state management
- Plotly.js waveform visualization
- SVG-based frontal plane geometry visualization
- Landing page with feature overview
- Demo selector with auto-loading
- Simulation control with real-time parameters
- Data summary and reconstruction results display
- API client with error handling
- Responsive layout
- Teaching monitor mode with fixed reference grid
- Playback controls (play/pause/scrub) and fixed NOW marker

#### Documentation
- Comprehensive README with setup instructions
- Product specification document
- Input formats guide
- Mathematical model documentation
- Limitations and constraints document
- Installation and setup guide
- Development guide and troubleshooting
- Contributing guidelines
- MIT License

#### Infrastructure
- GitHub Actions CI/CD workflow
- .gitignore for Python and Node.js
- Environment configuration templates
- Conda environment.yml for backend
- npm package.json for frontend
- TypeScript configuration

### Core Features

- ✓ Single-lead waveform visualization
- ✓ Multi-lead ECG support (up to 12 leads)
- ✓ Adaptive geometry based on available leads
- ✓ Einthoven triangle rendering (I, II, III)
- ✓ Hexaxial frontal-plane geometry (six leads)
- ✓ Vector estimation from lead projections
- ✓ Synthetic ECG generation
- ✓ Interactive simulation mode
- ✓ Data summary and reconstruction results
- ✓ Built-in demo datasets
- ✓ Non-diagnostic, educational focus

### Limitations

- No automatic beat detection
- No P/QRS/T delineation
- No PDF/image ECG parsing
- 2D geometry (frontal plane only)
- Simple preprocessing (no advanced filtering)
- Temporal animation is educational/synthetic only (not physiologic modeling)

### Known Issues

- Mobile layout not yet optimized
- No file upload UI (API-only)
- No export functionality
- Limited error messages for invalid data

### Repository Lifecycle Note

- This repository is intentionally experimental.
- Backward compatibility is not guaranteed between versions.
- Ongoing updates may be infrequent.

[0.1.0]: https://github.com/herobrine15432/ecg-axis-lab/releases/tag/v0.1.0

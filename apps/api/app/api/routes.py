"""API routes for data upload and processing."""
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    WaveformUploadRequest,
    SummaryUploadRequest,
    SimulationRequest,
    SimulationResponse,
)
from app.services.geometry import reconstruct_frontal
from app.services.simulation import simulate_ecg
from app.services.parsing import parse_csv_waveform, parse_json_structured
from app.utils.lead_validator import validate_leads

router = APIRouter(prefix="/api", tags=["ecg"])

DEMO_BASE_DIR = Path(__file__).resolve().parents[4] / "data" / "demos"


@router.post("/reconstruct/frontal")
async def reconstruct_frontal_endpoint(request: WaveformUploadRequest):
    """Reconstruct frontal-plane geometry from lead measurements."""
    try:
        if not validate_leads(request.leads):
            raise HTTPException(status_code=400, detail="Invalid lead names")
        
        # For waveform data, use signed area as summary metric
        lead_summaries = {}
        for lead_name, samples in request.leads.items():
            # Simple signed area calculation
            if len(samples) > 1:
                signed_area = sum(samples) * (1.0 / request.sampling_rate_hz)
                lead_summaries[lead_name] = signed_area
            else:
                lead_summaries[lead_name] = float(samples[0]) if samples else 0.0
        
        result = reconstruct_frontal(lead_summaries)
        return result.model_dump()
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/reconstruct/summary")
async def reconstruct_from_summary(request: SummaryUploadRequest):
    """Reconstruct from pre-computed lead summaries."""
    try:
        if not validate_leads(request.leads):
            raise HTTPException(status_code=400, detail="Invalid lead names")
        
        result = reconstruct_frontal(request.leads)
        return result.model_dump()
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/simulate")
async def simulate_endpoint(request: SimulationRequest) -> dict:
    """Generate synthetic ECG waveforms from vector parameters."""
    try:
        synthetic_leads = simulate_ecg(
            vector_angle_deg=request.vector_angle_deg,
            vector_magnitude=request.vector_magnitude,
            leads_to_display=request.leads_to_display,
            noise_level=request.noise_level,
        )
        
        response = SimulationResponse(
            synthetic_leads=synthetic_leads,
            vector_angle_deg=request.vector_angle_deg,
            vector_magnitude=request.vector_magnitude,
            leads_simulated=list(synthetic_leads.keys()),
        )
        return response.model_dump()
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/demos")
async def list_demos():
    """List available demo datasets."""
    demos = [
        {
            "id": "single_lead",
            "name": "Single Lead Demo",
            "description": "Demonstrates visualization of a single ECG lead",
            "leads": ["II"],
        },
        {
            "id": "einthoven",
            "name": "Einthoven Triangle Demo",
            "description": "Shows the three standard bipolar leads and Einthoven triangle",
            "leads": ["I", "II", "III"],
        },
        {
            "id": "frontal_six",
            "name": "Frontal Six Leads Demo",
            "description": "Complete frontal plane with hexaxial system",
            "leads": ["I", "II", "III", "aVR", "aVL", "aVF"],
        },
        {
            "id": "full_twelve",
            "name": "Full 12-Lead Demo",
            "description": "Complete ECG with all 12 standard leads",
            "leads": [
                "I", "II", "III", "aVR", "aVL", "aVF",
                "V1", "V2", "V3", "V4", "V5", "V6"
            ],
        },
        {
            "id": "synthetic",
            "name": "Synthetic Demo",
            "description": "Generated from simulation parameters",
            "leads": ["I", "II", "III", "aVR", "aVL", "aVF"],
        },
    ]
    return {"demos": demos}


@router.get("/demos/{demo_id}")
async def get_demo(demo_id: str):
    """Load a specific demo dataset."""
    demo_configs = {
        "single_lead": {
            "vector_angle_deg": -30.0,
            "vector_magnitude": 1.0,
            "leads_to_display": ["II"],
        },
        "einthoven": {
            "vector_angle_deg": -45.0,
            "vector_magnitude": 1.1,
            "leads_to_display": ["I", "II", "III"],
        },
        "frontal_six": {
            "vector_angle_deg": -30.0,
            "vector_magnitude": 1.1,
            "leads_to_display": ["I", "II", "III", "aVR", "aVL", "aVF"],
        },
        "full_twelve": {
            "vector_angle_deg": -20.0,
            "vector_magnitude": 1.2,
            "leads_to_display": [
                "I", "II", "III", "aVR", "aVL", "aVF",
                "V1", "V2", "V3", "V4", "V5", "V6",
            ],
        },
        "synthetic": {
            "vector_angle_deg": 45.0,
            "vector_magnitude": 1.2,
            "leads_to_display": ["I", "II", "III", "aVR", "aVL", "aVF"],
        },
    }

    if demo_id in demo_configs:
        cfg = demo_configs[demo_id]
        synthetic = simulate_ecg(
            vector_angle_deg=cfg["vector_angle_deg"],
            vector_magnitude=cfg["vector_magnitude"],
            leads_to_display=cfg["leads_to_display"],
            num_samples=1500,
            sampling_rate_hz=500,
            noise_level=0.005,
        )
        return {
            "demo_id": demo_id,
            "leads": synthetic,
            "sampling_rate_hz": 500,
            "vector_angle_deg": cfg["vector_angle_deg"],
            "vector_magnitude": cfg["vector_magnitude"],
        }

    demo_file = DEMO_BASE_DIR / demo_id / "demo.json"
    if demo_file.exists():
        with demo_file.open("r", encoding="utf-8") as f:
            return json.load(f)
    
    raise HTTPException(status_code=404, detail=f"Demo {demo_id} not found")


@router.post("/parse/csv-waveform")
async def parse_csv(csv_content: str):
    """Parse and validate CSV waveform data."""
    try:
        result = parse_csv_waveform(csv_content)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/parse/json-waveform")
async def parse_json_waveform(json_content: str):
    """Parse and validate JSON waveform data."""
    try:
        result = parse_json_structured(json_content)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

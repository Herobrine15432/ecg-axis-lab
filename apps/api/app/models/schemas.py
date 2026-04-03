"""Pydantic schemas for request/response bodies."""
from typing import Optional
from pydantic import BaseModel, Field


class LeadSignal(BaseModel):
    """A single lead's signal data."""

    lead_name: str
    samples: list[float]
    unit: str = "mV"
    sampling_rate_hz: int = 500


class SignalRecord(BaseModel):
    """Complete ECG signal record with multiple leads."""

    source_type: str  # "waveform", "summary", or "synthetic"
    sampling_rate_hz: int = 500
    units: str = "mV"
    leads: dict[str, list[float]]  # e.g., {"I": [...], "II": [...]}
    available_leads: list[str]
    time_axis: Optional[list[float]] = None


class LeadSummary(BaseModel):
    """Summary metric for a single lead."""

    lead_name: str
    value: float
    summary_metric: str = "signed_area"
    unit: str = "mV·ms"


class ReconstructionResult(BaseModel):
    """Result of a frontal-plane reconstruction."""

    can_render_einthoven: bool
    can_estimate_frontal_vector: bool
    confidence: float
    vector_angle_deg: Optional[float] = None
    vector_magnitude: Optional[float] = None
    projected_values: dict[str, float] = {}
    observed_values: dict[str, float] = {}
    residual_error: Optional[float] = None
    notes: list[str] = []


class WaveformUploadRequest(BaseModel):
    """Request for uploading waveform data."""

    leads: dict[str, list[float]]
    sampling_rate_hz: int = 500
    units: str = "mV"
    leading_lead_name: Optional[str] = None


class SummaryUploadRequest(BaseModel):
    """Request for uploading summary data."""

    leads: dict[str, float]
    summary_metric: str = "signed_area"
    units: str = "mV·ms"


class SimulationRequest(BaseModel):
    """Request for ECG simulation."""

    vector_angle_deg: float
    vector_magnitude: float = 1.0
    noise_level: float = 0.0
    leads_to_display: list[str] = Field(
        default=["I", "II", "III", "aVR", "aVL", "aVF"]
    )


class SimulationResponse(BaseModel):
    """Response from ECG simulation."""

    synthetic_leads: dict[str, list[float]]
    vector_angle_deg: float
    vector_magnitude: float
    leads_simulated: list[str]
    sampling_rate_hz: int = 500

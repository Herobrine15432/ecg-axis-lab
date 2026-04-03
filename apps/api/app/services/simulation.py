"""ECG data simulation and synthesis."""
import math
import numpy as np
from app.core.constants import LEAD_ANGLES_DEG
from app.services.geometry import project_vector_to_lead


PRECORDIAL_PHASE_DEG = {
    "V1": -35.0,
    "V2": -20.0,
    "V3": -5.0,
    "V4": 10.0,
    "V5": 20.0,
    "V6": 30.0,
}


def generate_synthetic_lead(
    lead_name: str,
    vector_angle_deg: float,
    vector_magnitude: float,
    num_samples: int = 500,
    sampling_rate_hz: int = 500,
    noise_level: float = 0.0,
) -> list[float]:
    """Generate synthetic ECG waveform for a lead based on vector parameters.
    
    Creates a QRS-like complex by projecting the vector onto the lead axis,
    then adding a simple temporal envelope.
    
    Args:
        lead_name: Lead name
        vector_angle_deg: QRS vector angle in degrees
        vector_magnitude: QRS vector magnitude
        num_samples: Number of time samples
        sampling_rate_hz: Sampling rate
        noise_level: Gaussian noise std dev
        
    Returns:
        List of signal samples
    """
    if lead_name in LEAD_ANGLES_DEG:
        projection = project_vector_to_lead(
            vector_angle_deg, vector_magnitude, lead_name
        )
    else:
        # Precordial fallback for non-frontal leads in demos and simulation mode.
        phase = PRECORDIAL_PHASE_DEG.get(lead_name, 0.0)
        projection = vector_magnitude * math.cos(math.radians(vector_angle_deg + phase)) * 0.8

    times = np.arange(num_samples) / sampling_rate_hz
    hr_bpm = 72.0
    beat_period = 60.0 / hr_bpm
    beat_phase = np.mod(times, beat_period)

    # Simple synthetic beat: P + QRS + T using Gaussian components.
    p_wave = 0.08 * np.exp(-((beat_phase - 0.18) ** 2) / (2 * 0.018**2))
    q_wave = -0.12 * np.exp(-((beat_phase - 0.34) ** 2) / (2 * 0.008**2))
    r_wave = 1.00 * np.exp(-((beat_phase - 0.36) ** 2) / (2 * 0.010**2))
    s_wave = -0.22 * np.exp(-((beat_phase - 0.39) ** 2) / (2 * 0.010**2))
    t_wave = 0.32 * np.exp(-((beat_phase - 0.58) ** 2) / (2 * 0.040**2))

    beat_template = p_wave + q_wave + r_wave + s_wave + t_wave
    beat_template = beat_template - np.mean(beat_template)

    baseline = 0.02 * np.sin(2 * np.pi * 0.33 * times)
    signal = projection * beat_template + baseline

    if noise_level > 0:
        noise = np.random.normal(0, noise_level, num_samples)
        signal = signal + noise

    return signal.tolist()


def simulate_ecg(
    vector_angle_deg: float,
    vector_magnitude: float = 1.0,
    leads_to_display: list[str] | None = None,
    num_samples: int = 500,
    sampling_rate_hz: int = 500,
    noise_level: float = 0.0,
) -> dict[str, list[float]]:
    """Simulate a full or partial ECG based on vector parameters.
    
    Args:
        vector_angle_deg: QRS vector angle
        vector_magnitude: QRS vector magnitude
        leads_to_display: Which leads to generate (default: all frontal)
        num_samples: Samples per lead
        sampling_rate_hz: Sampling rate
        noise_level: Noise standard deviation
        
    Returns:
        Dictionary {lead_name: samples}
    """
    if leads_to_display is None:
        leads_to_display = list(LEAD_ANGLES_DEG.keys())
    
    synthetic_leads = {}
    for lead_name in leads_to_display:
        synthetic_leads[lead_name] = generate_synthetic_lead(
            lead_name,
            vector_angle_deg,
            vector_magnitude,
            num_samples,
            sampling_rate_hz,
            noise_level,
        )
    
    return synthetic_leads

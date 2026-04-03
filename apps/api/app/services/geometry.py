"""ECG geometry and reconstruction logic."""
import math
import numpy as np
from app.core.constants import LEAD_ANGLES_DEG, BIPOLAR_LEADS, AUGMENTED_LEADS
from app.models.schemas import ReconstructionResult


def project_vector_to_lead(
    vector_angle_deg: float, vector_magnitude: float, lead_name: str
) -> float:
    """Project a 2D vector onto a lead axis.
    
    Args:
        vector_angle_deg: Vector angle in degrees (0° = positive I)
        vector_magnitude: Vector magnitude
        lead_name: Name of the lead
        
    Returns:
        Projected value on that lead
    """
    if lead_name not in LEAD_ANGLES_DEG:
        raise ValueError(f"Unknown lead: {lead_name}")
    
    lead_angle_deg = LEAD_ANGLES_DEG[lead_name]
    angle_diff_rad = math.radians(vector_angle_deg - lead_angle_deg)
    projection = vector_magnitude * math.cos(angle_diff_rad)
    return projection


def estimate_frontal_vector_from_leads(
    lead_values: dict[str, float],
) -> tuple[float, float, float]:
    """Estimate frontal-plane vector from lead projections.
    
    Least-squares fit of a vector that best matches observed projections.
    
    Args:
        lead_values: Dictionary of {lead_name: measured_value}
        
    Returns:
        (angle_deg, magnitude, residual_error)
    """
    # Build system of equations: each lead gives one projection estimate
    available_leads = list(lead_values.keys())
    n_equations = len(available_leads)
    
    if n_equations < 2:
        raise ValueError("Need at least 2 leads for vector estimation")
    
    # Set up least-squares problem
    # For each lead: projection = magnitude * cos(vector_angle - lead_angle)
    # Reparameterize: magnitude * cos(angle) = x, magnitude * sin(angle) = y
    # Then: projection = x * cos(lead_angle) + y * sin(lead_angle)
    
    A = np.zeros((n_equations, 2))
    b = np.zeros(n_equations)
    
    for i, lead_name in enumerate(available_leads):
        lead_angle_rad = math.radians(LEAD_ANGLES_DEG[lead_name])
        A[i, 0] = math.cos(lead_angle_rad)  # coefficient for x (mag*cos(angle))
        A[i, 1] = math.sin(lead_angle_rad)  # coefficient for y (mag*sin(angle))
        b[i] = lead_values[lead_name]
    
    # Solve least-squares
    try:
        result, residuals, _, _ = np.linalg.lstsq(A, b, rcond=None)
    except np.linalg.LinAlgError:
        raise ValueError("Cannot solve for vector from these leads")
    
    x, y = result
    magnitude = math.sqrt(x**2 + y**2)
    angle_rad = math.atan2(y, x)
    angle_deg = math.degrees(angle_rad)
    
    # Normalize angle to [0, 360)
    if angle_deg < 0:
        angle_deg += 360
    
    # Calculate residual error
    residual_error = float(np.sum(residuals)) if len(residuals) > 0 else 0.0
    
    return angle_deg, magnitude, residual_error


def can_render_einthoven(available_leads: list[str]) -> bool:
    """Check if we have the bipolar leads needed for Einthoven triangle."""
    required = {"I", "II", "III"}
    return required.issubset(set(available_leads))


def can_estimate_frontal_vector(available_leads: list[str]) -> bool:
    """Check if we can estimate a frontal-plane vector."""
    frontal = {"I", "II", "III", "aVR", "aVL", "aVF"}
    available_frontal = set(available_leads) & frontal
    return len(available_frontal) >= 2


def reconstruct_frontal(
    lead_values: dict[str, float],
) -> ReconstructionResult:
    """Reconstruct frontal-plane geometry from lead measurements.
    
    Args:
        lead_values: Dictionary of {lead_name: summary_value}
        
    Returns:
        ReconstructionResult with geometry information
    """
    available_leads = list(lead_values.keys())
    notes = []
    
    can_einthoven = can_render_einthoven(available_leads)
    if can_einthoven:
        notes.append("Einthoven triangle available (I, II, III)")
    
    can_vector = can_estimate_frontal_vector(available_leads)
    confidence = 0.0
    vector_angle = None
    vector_magnitude = None
    residual_error = None
    
    if can_vector:
        try:
            # Use all available frontal leads for best estimate
            frontal_values = {
                lead: val
                for lead, val in lead_values.items()
                if lead in {"I", "II", "III", "aVR", "aVL", "aVF"}
            }
            vector_angle, vector_magnitude, residual_error = (
                estimate_frontal_vector_from_leads(frontal_values)
            )
            # Confidence based on number of leads and residual
            n_leads = len(frontal_values)
            confidence = min(0.95, 0.6 + (n_leads - 2) * 0.1)
            notes.append(
                f"Vector estimated from {n_leads} frontal leads (confidence: {confidence:.1%})"
            )
        except ValueError as e:
            notes.append(f"Vector estimation failed: {str(e)}")
    
    # Compute projected values if we have a vector
    projected_values = {}
    if vector_angle is not None and vector_magnitude is not None:
        for lead in available_leads:
            if lead in LEAD_ANGLES_DEG:
                proj = project_vector_to_lead(
                    vector_angle, vector_magnitude, lead
                )
                projected_values[lead] = proj
    
    return ReconstructionResult(
        can_render_einthoven=can_einthoven,
        can_estimate_frontal_vector=can_vector,
        confidence=confidence if can_vector else 0.0,
        vector_angle_deg=vector_angle,
        vector_magnitude=vector_magnitude,
        projected_values=projected_values,
        observed_values=lead_values,
        residual_error=residual_error,
        notes=notes,
    )

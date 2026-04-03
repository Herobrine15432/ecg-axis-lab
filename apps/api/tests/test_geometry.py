"""Tests for geometry module."""
import pytest
from app.services.geometry import (
    project_vector_to_lead,
    estimate_frontal_vector_from_leads,
    can_render_einthoven,
    can_estimate_frontal_vector,
    reconstruct_frontal,
)


def test_project_vector_to_lead():
    """Test vector projection onto leads."""
    # Vector at 0°, magnitude 1.0 should project fully onto lead I
    proj_i = project_vector_to_lead(0, 1.0, "I")
    assert abs(proj_i - 1.0) < 0.01
    
    # Same vector should project to zero on aVF (perpendicular)
    proj_avf = project_vector_to_lead(0, 1.0, "aVF")
    assert abs(proj_avf) < 0.01


def test_estimate_frontal_vector():
    """Test vector estimation from lead projections."""
    # Create a known vector and project it
    vector_angle = 45.0
    vector_magnitude = 1.5
    
    # Get projections on known leads
    lead_values = {
        "I": project_vector_to_lead(vector_angle, vector_magnitude, "I"),
        "II": project_vector_to_lead(vector_angle, vector_magnitude, "II"),
        "aVF": project_vector_to_lead(vector_angle, vector_magnitude, "aVF"),
    }
    
    # Estimate vector
    est_angle, est_mag, residual = estimate_frontal_vector_from_leads(lead_values)
    
    # Should recover original parameters
    assert abs(est_angle - vector_angle) < 5.0  # Allow some tolerance
    assert abs(est_mag - vector_magnitude) < 0.1
    assert residual < 0.1


def test_can_render_einthoven():
    """Test Einthoven triangle detection."""
    assert can_render_einthoven(["I", "II", "III"])
    assert not can_render_einthoven(["I", "II"])
    assert can_render_einthoven(["I", "II", "III", "aVR"])


def test_can_estimate_frontal_vector():
    """Test frontal vector estimation capability."""
    assert can_estimate_frontal_vector(["I", "II"])
    assert can_estimate_frontal_vector(["I", "II", "III", "aVR", "aVL", "aVF"])
    assert not can_estimate_frontal_vector(["I"])
    assert not can_estimate_frontal_vector(["V1", "V2"])


def test_reconstruct_frontal():
    """Test full reconstruction pipeline."""
    lead_values = {
        "I": 0.5,
        "II": 0.8,
        "aVF": 0.6,
    }
    
    result = reconstruct_frontal(lead_values)
    
    assert result.can_estimate_frontal_vector
    assert result.vector_angle_deg is not None
    assert result.vector_magnitude is not None
    assert len(result.notes) > 0

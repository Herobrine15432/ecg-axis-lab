"""Tests for simulation module."""
import pytest
from app.services.simulation import generate_synthetic_lead, simulate_ecg


def test_generate_synthetic_lead():
    """Test synthetic lead generation."""
    samples = generate_synthetic_lead(
        "I",
        vector_angle_deg=0,
        vector_magnitude=1.0,
        num_samples=100,
        sampling_rate_hz=500,
        noise_level=0,
    )
    
    assert len(samples) == 100
    assert isinstance(samples[0], float)
    # Lead I with 0° vector should have positive projection
    assert max(samples) > 0


def test_simulate_ecg_full():
    """Test full simulation."""
    synthetic = simulate_ecg(
        vector_angle_deg=45,
        vector_magnitude=1.2,
        leads_to_display=["I", "II", "III"],
        num_samples=500,
        noise_level=0,
    )
    
    assert "I" in synthetic
    assert "II" in synthetic
    assert "III" in synthetic
    assert len(synthetic["I"]) == 500


def test_simulate_ecg_with_noise():
    """Test simulation with noise."""
    synthetic = simulate_ecg(
        vector_angle_deg=90,
        vector_magnitude=1.0,
        leads_to_display=["aVF"],
        num_samples=100,
        noise_level=0.1,
    )
    
    assert "aVF" in synthetic
    assert len(synthetic["aVF"]) == 100

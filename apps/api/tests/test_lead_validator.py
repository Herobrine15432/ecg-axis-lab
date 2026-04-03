"""Lead validator tests."""
import pytest
from app.utils.lead_validator import normalize_lead_name, validate_leads, get_lead_angle_deg


def test_normalize_lead_name():
    """Test lead name normalization."""
    assert normalize_lead_name(" I ") == "I"
    assert normalize_lead_name("ii") == "II"
    assert normalize_lead_name("aVR") == "aVR"
    assert normalize_lead_name("avl") == "aVL"


def test_normalize_lead_name_invalid():
    """Test invalid lead names."""
    with pytest.raises(ValueError):
        normalize_lead_name("X")
    
    with pytest.raises(ValueError):
        normalize_lead_name("V10")


def test_validate_leads():
    """Test lead validation."""
    assert validate_leads(["I", "II", "III"])
    assert validate_leads({"I": [], "II": []})
    assert not validate_leads(["I", "INVALID"])


def test_get_lead_angle():
    """Test lead angle retrieval."""
    assert get_lead_angle_deg("I") == 0.0
    assert get_lead_angle_deg("II") == -30.0
    assert get_lead_angle_deg("aVF") == -90.0

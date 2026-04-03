"""Test for parsing module."""
import pytest
from app.services.parsing import (
    parse_csv_waveform,
    parse_json_structured,
    parse_json_summary,
)


def test_parse_csv_waveform_with_time():
    """Test CSV parsing with time column."""
    csv_data = """time_ms,I,II
0,0.01,0.02
1,0.02,0.03
2,0.03,0.04"""
    
    result = parse_csv_waveform(csv_data)
    
    assert "I" in result["leads"]
    assert "II" in result["leads"]
    assert len(result["leads"]["I"]) == 3
    assert result["has_time_axis"] is True


def test_parse_csv_waveform_without_time():
    """Test CSV parsing without time column."""
    csv_data = """I,II,III
0.01,0.02,0.03
0.02,0.03,0.04"""
    
    result = parse_csv_waveform(csv_data)
    
    assert "I" in result["leads"]
    assert len(result["leads"]["I"]) == 2


def test_parse_json_structured():
    """Test structured JSON parsing."""
    json_data = """{
        "sampling_rate_hz": 500,
        "units": "mV",
        "leads": {
            "I": [0.01, 0.02, 0.03],
            "II": [0.02, 0.03, 0.04]
        }
    }"""
    
    result = parse_json_structured(json_data)
    
    assert result["sampling_rate_hz"] == 500
    assert len(result["leads"]["I"]) == 3


def test_parse_json_summary():
    """Test summary JSON parsing."""
    json_data = """{
        "summary_type": "signed_area",
        "leads": {
            "I": 0.62,
            "II": 1.01,
            "aVF": 0.39
        }
    }"""
    
    result = parse_json_summary(json_data)
    
    assert result["summary_metric"] == "signed_area"
    assert result["leads"]["I"] == 0.62


def test_parse_json_summary_unknown_metric():
    """Test summary JSON with unknown metric type."""
    json_data = """{
        "summary_type": "unknown_metric",
        "leads": {"I": 0.5}
    }"""
    
    with pytest.raises(ValueError):
        parse_json_summary(json_data)

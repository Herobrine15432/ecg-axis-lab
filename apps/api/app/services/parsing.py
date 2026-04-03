"""ECG data parsing and validation."""
import io
import csv
import json
from app.utils.lead_validator import normalize_lead_name
from app.core.constants import SUMMARY_METRICS


def parse_csv_waveform(csv_content: str) -> dict:
    """Parse multi-column CSV waveform data.
    
    Expected formats:
    1. With time: time_ms,I,II,III,...
    2. Without time: I,II,III,...
    
    Args:
        csv_content: Raw CSV string
        
    Returns:
        {
            'leads': {lead_name: [samples]},
            'has_time_axis': bool,
            'num_samples': int
        }
    """
    reader = csv.DictReader(io.StringIO(csv_content))
    if not reader.fieldnames:
        raise ValueError("Empty CSV or unable to parse header")
    
    rows = list(reader)
    if not rows:
        raise ValueError("No data rows in CSV")
    
    # Identify lead columns (non-time columns)
    fieldnames = reader.fieldnames
    time_col = None
    lead_cols = []
    
    for col in fieldnames:
        col_lower = col.strip().lower()
        if col_lower in {"time", "time_ms", "time_sec"}:
            time_col = col
        else:
            lead_cols.append(col)
    
    # Parse leads
    leads = {}
    for lead_col in lead_cols:
        try:
            normalized_name = normalize_lead_name(lead_col)
            samples = []
            for row in rows:
                try:
                    val = float(row[lead_col])
                    samples.append(val)
                except (ValueError, KeyError):
                    pass
            if samples:
                leads[normalized_name] = samples
        except ValueError:
            # Skip unknown leads
            pass
    
    if not leads:
        raise ValueError("No valid lead data found in CSV")
    
    # All leads should have same length
    lengths = [len(samples) for samples in leads.values()]
    if len(set(lengths)) > 1:
        raise ValueError("All leads must have same number of samples")
    
    return {
        "leads": leads,
        "has_time_axis": time_col is not None,
        "num_samples": lengths[0] if lengths else 0,
    }


def parse_json_structured(json_content: str) -> dict:
    """Parse structured JSON waveform input.
    
    Expected format:
    {
        "sampling_rate_hz": 500,
        "units": "mV",
        "leads": {
            "I": [0.01, 0.02, ...],
            "II": [0.03, 0.04, ...]
        }
    }
    
    Args:
        json_content: Raw JSON string
        
    Returns:
        Normalized data dict
    """
    data = json.loads(json_content)
    
    leads = data.get("leads", {})
    if not leads:
        raise ValueError("No leads found in JSON")
    
    # Normalize lead names
    normalized_leads = {}
    for lead_name, samples in leads.items():
        try:
            norm_name = normalize_lead_name(lead_name)
            normalized_leads[norm_name] = samples
        except ValueError:
            # Skip unknown leads
            pass
    
    if not normalized_leads:
        raise ValueError("No valid leads found after normalization")
    
    return {
        "leads": normalized_leads,
        "sampling_rate_hz": data.get("sampling_rate_hz", 500),
        "units": data.get("units", "mV"),
    }


def parse_json_summary(json_content: str) -> dict:
    """Parse summary JSON input.
    
    Expected format:
    {
        "summary_type": "signed_area",
        "units": "mV·ms",
        "leads": {
            "I": 0.62,
            "II": 1.01,
            "aVF": 0.39
        }
    }
    
    Args:
        json_content: Raw JSON string
        
    Returns:
        Normalized data dict
    """
    data = json.loads(json_content)
    
    leads = data.get("leads", {})
    if not leads:
        raise ValueError("No leads found in JSON summary")
    
    # Normalize lead names
    normalized_leads = {}
    for lead_name, value in leads.items():
        try:
            norm_name = normalize_lead_name(lead_name)
            normalized_leads[norm_name] = float(value)
        except ValueError:
            # Skip unknown leads
            pass
    
    if not normalized_leads:
        raise ValueError("No valid leads found after normalization")
    
    summary_type = data.get("summary_type", "signed_area")
    if summary_type not in SUMMARY_METRICS:
        raise ValueError(f"Unknown summary metric: {summary_type}")
    
    return {
        "leads": normalized_leads,
        "summary_metric": summary_type,
        "units": data.get("units", "mV·ms"),
    }

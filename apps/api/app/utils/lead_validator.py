"""Lead name validation and normalization."""
from app.core.constants import ALL_STANDARD_LEADS, LEAD_ANGLES_DEG


def normalize_lead_name(name: str) -> str:
    """Normalize lead name to standard format.
    
    Args:
        name: Raw lead name (may have spaces, case variations)
        
    Returns:
        Standardized lead name
        
    Raises:
        ValueError: If lead name is not recognized
    """
    normalized = name.strip().replace(" ", "")
    upper = normalized.upper()

    # Preserve canonical mixed-case names for augmented leads.
    aliases = {
        "AVR": "aVR",
        "AVL": "aVL",
        "AVF": "aVF",
    }

    if upper in aliases:
        return aliases[upper]

    if upper in ALL_STANDARD_LEADS:
        return upper
    
    raise ValueError(f"Unknown lead name: {name}. Valid leads: {ALL_STANDARD_LEADS}")


def get_lead_angle_deg(lead_name: str) -> float:
    """Get the standard frontal-plane angle for a lead.
    
    Args:
        lead_name: Standardized lead name
        
    Returns:
        Angle in degrees from horizontal (+ counter-clockwise)
    """
    if lead_name not in LEAD_ANGLES_DEG:
        raise ValueError(f"No angle defined for lead: {lead_name}")
    return LEAD_ANGLES_DEG[lead_name]


def validate_leads(leads: dict | list) -> bool:
    """Check if provided leads are valid.
    
    Args:
        leads: Dictionary or list of lead names
        
    Returns:
        True if all leads are valid
    """
    if isinstance(leads, dict):
        lead_names = leads.keys()
    else:
        lead_names = leads
    
    return all(name in ALL_STANDARD_LEADS for name in lead_names)

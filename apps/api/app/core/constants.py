"""Application constants."""

# Valid lead names
BIPOLAR_LEADS = {"I", "II", "III"}
AUGMENTED_LEADS = {"aVR", "aVL", "aVF"}
PRECORDIAL_LEADS = {"V1", "V2", "V3", "V4", "V5", "V6"}
ALL_STANDARD_LEADS = BIPOLAR_LEADS | AUGMENTED_LEADS | PRECORDIAL_LEADS
FRONTAL_LEADS = BIPOLAR_LEADS | AUGMENTED_LEADS

# Lead axes in degrees (from horizontal, measured counter-clockwise in frontal plane)
# Standard hexaxial reference system
LEAD_ANGLES_DEG = {
    "I": 0.0,
    "aVL": 60.0,
    "aVF": -90.0,
    "III": -60.0,
    "II": -30.0,
    "aVR": 120.0,
}

# Standard sampling rates (Hz)
STANDARD_SAMPLING_RATES = {250, 500, 1000}
DEFAULT_SAMPLING_RATE = 500

# Summary metrics
SUMMARY_METRICS = {"signed_area", "net_amplitude", "peak_amplitude"}
DEFAULT_SUMMARY_METRIC = "signed_area"

# Source types
SOURCE_TYPES = {"waveform", "summary", "synthetic"}

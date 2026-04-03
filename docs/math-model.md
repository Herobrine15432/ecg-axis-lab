# Mathematical Model

## Overview

ECG Axis Lab uses a simple, transparent geometric model based on standard ECG theory. All mathematics are linear and deterministic—no machine learning or black boxes.

## Coordinate System

### Frontal Plane
- **Horizontal axis (±I direction):** Left (-) to Right (+)
- **Vertical axis (±aVF direction):** Down (-) to Up (+)
- **Standard orientation:** Lead I points to 0°, aVF points to -90°

### Lead Angles (Hexaxial Reference System)

| Lead | Angle (°) |
|------|-----------|
| I    | 0°        |
| II   | -30°      |
| III  | -60°      |
| aVF  | -90°      |
| aVL  | 60°       |
| aVR  | 120°      |

All angles measured counter-clockwise from the positive x-axis (rightward direction).

## Vector Representation

A 2D cardiac vector in the frontal plane is represented as:

$$\vec{V} = (V_x, V_y) = (M \cos \theta, M \sin \theta)$$

Where:
- $M$ = **Magnitude** (amplitude of the vector)
- $\theta$ = **Angle** (direction, in degrees from 0° = rightward)

In polar coordinates:
$$M = \sqrt{V_x^2 + V_y^2}$$
$$\theta = \arctan2(V_y, V_x)$$

## Lead Projection

A lead's measured value is the **projection** of the vector onto that lead's axis:

$$\text{Lead}_i = M \cos(\theta - \theta_i)$$

Where:
- $M$ = Vector magnitude
- $\theta$ = Vector angle
- $\theta_i$ = Lead i's angle (from table above)

### Example

Vector at 45° with magnitude 1.0:
- Projection on Lead I (0°): $1.0 \cos(45° - 0°) = 0.707$ mV
- Projection on Lead II (-30°): $1.0 \cos(45° - (-30°)) = 0.259$ mV
- Projection on aVF (-90°): $1.0 \cos(45° - (-90°)) ≈ 0.707$ mV

## Vector Estimation from Multiple Leads

Given measured projections on $n$ leads, we estimate the vector using **least-squares fitting**.

### Setup

For each lead $i$, we have:
$$P_i = M \cos(\theta - \theta_i) = M \cos \theta \cos \theta_i + M \sin \theta \sin \theta_i$$

Define:
- $x = M \cos \theta$
- $y = M \sin \theta$

Then:
$$P_i = x \cos \theta_i + y \sin \theta_i$$

This is linear in $x$ and $y$.

### Solution

Build the matrix equation:
$$\begin{bmatrix}
\cos \theta_1 & \sin \theta_1 \\
\cos \theta_2 & \sin \theta_2 \\
\vdots & \vdots \\
\cos \theta_n & \sin \theta_n
\end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
=
\begin{bmatrix} P_1 \\ P_2 \\ \vdots \\ P_n \end{bmatrix}$$

Solve using least-squares:
$$\begin{bmatrix} x \\ y \end{bmatrix} = (A^T A)^{-1} A^T P$$

Then recover:
$$M = \sqrt{x^2 + y^2}$$
$$\theta = \arctan2(y, x)$$

### Residual Error

The residual quantifies fit quality:
$$\text{Residual} = \|A \begin{bmatrix} x \\ y \end{bmatrix} - P \|_2^2$$

Smaller residual = better fit.

### Confidence Estimation

Confidence based on:
1. **Number of leads:** More leads = higher confidence
2. **Residual error:** Smaller residual = higher confidence
3. **Computation:**
   $$\text{Confidence} = \min\left(0.95, 0.6 + 0.15 \times (n_{\text{leads}} - 2)\right)$$

## Summary Metrics

### Signed Area (Default)

Trapezoidal integration of the waveform:

$$\text{Area} = \sum_{i=0}^{n-2} \frac{y_i + y_{i+1}}{2} \times \Delta t$$

Where $\Delta t = 1 / f_s$ and $f_s$ is the sampling rate.

**Use:** Captures net electrical impulse direction and magnitude
**Sensitivity:** Both amplitude and polarity

### Net Amplitude

$$\text{Amplitude} = \max(y) - \min(y)$$

**Use:** Simple magnitude measure
**Sensitivity:** Only amplitude, not sign

### Peak Amplitude

$$\text{Peak} = \max(|y|)$$

**Use:** Dominant feature extraction
**Sensitivity:** Only absolute maximum

## Einthoven's Equations

When all three bipolar leads are present, they satisfy Kirchhoff's voltage law:

$$I + III = II$$

This relationship defines the **Einthoven triangle**:
- Leads I, II, III form a loop
- Any two leads can be used to estimate the third
- The triangle's geometry reveals the vector direction

## Limitations of the Model

1. **Static projection:** Assumes instantaneous, not time-averaged
2. **2D only:** Ignores anterior-posterior (sagittal) plane
3. **Linear:** No saturation, nonlinearity, or filtering
4. **No temporal info:** Single value per lead, not waveform dynamics
5. **Assumes Einthoven:** Uses standard 60° triangle geometry (simplified)

## Validation Approach

- **Synthetic ground truth:** Generate vector → compute projections → estimate vector
- **Tolerance:** Estimated angle within 5° of input, magnitude within 10%
- **Known data:** Compare projections of estimated vector with observed leads

## References

- Einthoven, W. (1913). Über die Richtung und die Manifestationen der Potentialaschwankungen im menschlichen Herzen
- Goldberger, A. L. (1949). Unipolar Lead Avre, AVL, AVF
- Wagner, G. S. (2011). Marriott's Practical Electrocardiography, 12th Edition

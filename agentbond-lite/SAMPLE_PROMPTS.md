# Sample Prompts and Outputs

These prompts are designed for a short, clear hackathon demo.

## 1. Governance Intelligence

### Prompt

`Review the token design, treasury controls, and upgrade risks. Produce a short report with concrete recommendations.`

### Expected Output Shape

- Summary
  - `Treasury and upgrade controls are still too concentrated for a confident launch.`
- Key findings
  - `Treasury permissions are concentrated in too few hands.`
  - `Upgrade authority can move too quickly without enough review delay.`
  - `Token design is understandable, but governance guardrails remain weak.`
- Recommendation
  - `REVISE`
- Confidence
  - `78.0%`

### Sample Verdict JSON

```json
{
  "version": "1",
  "mode": "governance",
  "recommendation": "REVISE",
  "confidence_bps": 7800,
  "summary": "Treasury and upgrade controls are still too concentrated for a confident launch.",
  "key_findings": [
    "Treasury permissions are concentrated in too few hands.",
    "Upgrade authority can move too quickly without enough review delay.",
    "Token design is understandable, but governance guardrails remain weak."
  ]
}
```

## 2. Token + Crowd Read

### Prompt

`Review the token utility, liquidity setup, admin permissions, and crowd expectations. Produce a short report with concrete recommendations.`

### Expected Output Shape

- Summary
  - `Market conviction appears stronger than the current token structure justifies.`
- Key findings
  - `Liquidity design is still vulnerable to concentrated exits.`
  - `Admin controls remain an important source of launch risk.`
  - `Narrative strength is outpacing structural readiness.`
- Recommendation
  - `REVISE`
- Confidence
  - `73.0%`

## 3. Identity Graph

### Prompt

`Review trust signals, privilege structure, and suspicious behavior patterns. Produce a short report with concrete recommendations.`

### Expected Output Shape

- Summary
  - `Trust signals remain mixed because privilege design is clearer than actor behavior.`
- Key findings
  - `Permission boundaries are understandable but not yet strongly constrained.`
  - `A few interaction clusters deserve deeper review.`
  - `The surface is usable, but not fully confidence-inspiring.`
- Recommendation
  - `REVISE`
- Confidence
  - `74.0%`

## Judge-Friendly Local Demo Prompt

Use this if you want the cleanest 3-minute flow:

`Review the token design, treasury controls, and upgrade risks. Produce a short report with concrete recommendations.`

Why this works:

- it maps directly to governance and onchain AI review
- it produces a clear `GO / REVISE / AVOID` style result
- it makes the settlement step easy to explain

## What To Point Out In The Output

When the result appears, explicitly call out:

1. `This summary is human-readable.`
2. `These findings are compact and legible.`
3. `This recommendation is machine-readable.`
4. `This confidence score is normalized.`
5. `This verdict is what gets hashed and anchored on Etherlink.`

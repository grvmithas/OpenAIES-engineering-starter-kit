# Architecture Decision Record (ADR) Template

> **Template:** ADR
> **Version:** 1.0
> **Standard:** OAIES ADR Format

---

## Instructions

Fill in all sections. Do NOT leave sections blank — write "N/A" with a brief explanation if not applicable.
The status field must be one of: PROPOSED | ACCEPTED | SUPERSEDED | DEPRECATED | REJECTED.

---

# ADR-{NUMBER}: {TITLE}

**Date:** {YYYY-MM-DD}
**Status:** PROPOSED
**Deciders:** {Names of decision makers}
**Stakeholders:** {Names of affected parties}
**Supersedes:** {ADR-XXX if applicable, or "None"}
**Superseded by:** {ADR-XXX if applicable, or "N/A — current"}

---

## Context

{Describe the problem, situation, or opportunity that requires a decision.
Include: technical context, business context, constraints, and timeline pressure.
This section answers: "What situation are we in, and why do we need to decide this now?"}

---

## Problem Statement

{One paragraph precisely defining the problem.
Be specific — not "we need better performance" but "API latency exceeds 2s at p99 during peak load,
causing X% cart abandonment. We need to reduce p99 to under 500ms."}

---

## Decision Drivers

List the forces driving this decision, ranked by importance:

1. {Most important driver — e.g., "Security: No PII in model context"}
2. {Second driver — e.g., "Cost: Must stay under $X/month at current scale"}
3. {Third driver — e.g., "Developer experience: Minimal setup for new team members"}
4. {Fourth driver if applicable}

---

## Considered Options

### Option A: {Option Name}
{1-2 paragraph description of this option}

**Pros:**
- {Benefit}
- {Benefit}

**Cons:**
- {Drawback}
- {Drawback}

**Cost:** {Rough estimate — time, money, or complexity}
**Risk:** {Primary risk}

---

### Option B: {Option Name}
{Same structure}

---

### Option C: {Option Name} *(if applicable)*
{Same structure}

---

## Decision

**We will:** {One sentence decision}

**Because:** {2-3 sentence rationale connecting decision to decision drivers}

---

## Consequences

### Positive
- {What gets better}
- {What becomes possible}

### Negative
- {What gets harder or more expensive}
- {What we give up}

### Neutral
- {Side effects that are neither good nor bad}

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| {Risk description} | H/M/L | H/M/L | {How we address it} |

---

## Implementation Plan

{High-level steps to implement this decision.
This is not a detailed implementation plan — see implementation-plan.prompt.md for that.
This is enough context for someone to understand what "implementing this ADR" means.}

1. {Step 1}
2. {Step 2}
3. {Step 3}

**Estimated effort:** {S/M/L/XL}
**Timeline:** {When this will be implemented}

---

## Review Notes

{Space for review feedback during PROPOSED status}

---

## Revision History

| Date | Change | Author |
|------|--------|--------|
| {YYYY-MM-DD} | Initial draft | {Author} |

---

## References

- {Link to relevant documentation, papers, or discussions}
- {Link to alternative approaches considered}

---

*ADR format based on Michael Nygard's ADR template, extended for AI systems by OAIES.*

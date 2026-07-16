# Code Review Skill

> **Skill ID:** `code-review`
> **Version:** 1.0
> **Install:** `.claude/skills/code-review.skill.md`

---

## Trigger Conditions

- Explicit code review request
- PR review requested
- "Review this code" in any form
- Diff provided for assessment

---

## Purpose

Conduct a thorough, prioritized code review covering correctness, security, performance, maintainability, and test coverage.

---

## Procedure

### Step 1: Understand Intent
Before reviewing, confirm:
- What is this code supposed to do?
- What is the test plan?
- Are there specific concerns to focus on?

### Step 2: First Pass — Correctness
- Does this code do what it claims to do?
- Are edge cases handled? (null, empty, negative, overflow, concurrent)
- Is error handling complete and appropriate?
- Are all code paths tested?

### Step 3: Second Pass — Security
Apply the Security Skill (abbreviated):
- Input validation present?
- No injection surfaces?
- Authorization enforced?
- Sensitive data protected?

### Step 4: Third Pass — Performance
- Any O(n²) or worse algorithms where O(n log n) is feasible?
- N+1 query patterns?
- Unnecessary synchronous operations in async context?
- Missing indexes for query patterns?
- Memory leaks (unclosed connections, unbounded caches)?

### Step 5: Fourth Pass — Maintainability
- Is the code readable without comments?
- Are functions doing one thing?
- Is there code duplication that should be extracted?
- Are names meaningful at the domain level?
- Is complexity justified by the problem?

### Step 6: Fifth Pass — Tests
- Are tests testing behavior, not implementation?
- Are edge cases covered?
- Are tests isolated (no test depends on another)?
- Is coverage adequate for the risk level?

---

## Output Format

```markdown
## Code Review

**Summary:** [1-2 sentence overall assessment]
**Verdict:** Approve | Approve with minor changes | Request changes | Block

### Critical (Must fix before merge)
- **[File:Line]** — [Issue] — [Fix]

### Major (Should fix before merge)
- **[File:Line]** — [Issue] — [Fix]

### Minor (Nice to fix)
- **[File:Line]** — [Suggestion]

### Positive Notes
- [What was done well — be specific]
```

---

## Verification

- [ ] All five passes completed
- [ ] At least one positive observation included (balanced reviews get better reception)
- [ ] Critical items clearly labeled
- [ ] Specific locations given for all findings
- [ ] Suggestions include the fix, not just the problem

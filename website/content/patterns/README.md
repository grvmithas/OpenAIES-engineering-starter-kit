# AI Engineering Patterns

> **The OAIES Pattern Library — Nobody has standardized this.**

---

## What Is an AI Engineering Pattern?

An AI engineering pattern is a **reusable, field-tested solution** to a recurring problem in AI system design. Unlike software design patterns (which describe code structure), AI engineering patterns describe **the complete operational envelope** — the prompt, the agent, the workflow, the failure modes, and the enterprise considerations.

Patterns are not tutorials. They are specifications.

---

## Why Patterns

The same problems appear repeatedly across AI engineering teams:
- How do you reliably plan a complex, multi-step task?
- How do you review AI-generated code systematically?
- How do you debug an agentic system that's producing wrong output?
- How do you modernize a legacy codebase with AI assistance?

Without patterns, every team invents their own solution, makes the same mistakes, and produces inconsistent quality. With patterns, teams start from a proven baseline.

---

## Pattern Structure (The 13-Component Specification)

Every pattern contains exactly these 13 components:

```
{pattern-name}/
├── README.md           ← Overview, use cases, when to apply
├── problem.md          ← The problem statement (precise, measurable)
├── context.md          ← Pre-conditions and trigger conditions
├── workflow.md         ← Step-by-step with Mermaid diagram
├── prompt.md           ← Production XML-structured prompt
├── agent.md            ← Agent definition (role, tools, memory)
├── subagents.md        ← Supporting subagents
├── skills.md           ← Skills required
├── hooks.md            ← Pre/post lifecycle hooks
├── checklist.md        ← Quality gate checklist
├── examples/           ← At least one working example
├── failures.md         ← Common failures and recovery strategies
└── enterprise-notes.md ← Compliance, scale, governance
```

---

## Pattern Library

| Pattern | Problem It Solves | Maturity |
|---------|------------------|---------|
| [planner-pattern/](./planner-pattern/README.md) | Decomposing complex tasks into reliable sub-tasks | ✅ Stable |
| reviewer-pattern/ | Systematic review of any artifact | 📋 Planned |
| context-pattern/ | Managing context across long-running tasks | 📋 Planned |
| debug-pattern/ | Systematic hypothesis-driven debugging | 📋 Planned |
| migration-pattern/ | Migrating data, systems, or codebases safely | 📋 Planned |
| legacy-modernization-pattern/ | AI-assisted legacy code modernization | 📋 Planned |
| architecture-pattern/ | Designing and reviewing system architecture | 📋 Planned |
| optimization-pattern/ | Performance and cost optimization | 📋 Planned |
| enterprise-pattern/ | Enterprise-scale AI deployment | 📋 Planned |
| release-pattern/ | Safe, reliable AI-assisted releases | 📋 Planned |
| hotfix-pattern/ | Rapid response to production incidents | 📋 Planned |
| root-cause-pattern/ | Post-incident root cause identification | 📋 Planned |

---

## How to Apply a Pattern

1. **Identify the problem type** — Match your situation to a pattern
2. **Read the context requirements** — Confirm pre-conditions are met
3. **Follow the workflow** — Don't skip steps
4. **Use the prompt** — Don't rewrite it; customize the `{{VARIABLES}}`
5. **Install required agents/skills** — From the agent.md and skills.md specs
6. **Run the checklist** — Before calling the pattern complete

---

## Contributing a New Pattern

New patterns must demonstrate:
- The problem occurs recurrently (at least 3 documented instances)
- Existing patterns don't cover this problem
- The pattern has been applied in production at least once
- All 13 components are present and complete

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the submission process.

---

## Anti-Patterns

### ❌ Pattern Shopping
Trying multiple patterns on the same problem because you don't like the first result. Patterns work when applied systematically. If the first application failed, debug the application — don't switch patterns.

### ❌ Partial Pattern Application
Skipping the checklist, hooks, or enterprise notes because "this is a quick fix." Quick fixes with partial pattern application are how technical debt accumulates.

### ❌ Treating Patterns as Algorithms
Patterns require judgment in application. The workflow is a guide, not a deterministic algorithm. Use the agent to apply it, but review the output at each stage.

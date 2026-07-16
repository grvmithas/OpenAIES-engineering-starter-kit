# MCP Integrations

> **The M×N Problem Solver — One standard integration per external system.**

---

## What Is MCP

Model Context Protocol (MCP) is the open standard for connecting AI agents to external data and tools. It solves the M×N integration problem:
- **Without MCP:** M models × N tools = M×N custom integrations
- **With MCP:** M models × N MCP servers = M+N implementations

Every major AI system (Claude, GPT-4, Gemini, Cursor, Windsurf, Roo) now supports MCP. It is the integration standard.

---

## Why This Section Exists

MCP servers are easy to create poorly. The most common mistake is treating MCP as a thin API wrapper — just exposing existing APIs as tools. This leads to:
- Too many tools loaded into context (degrading agent reasoning)
- Tool definitions designed for humans, not agents
- Missing security controls on tool execution
- No rate limiting or cost controls

This section provides production-ready MCP integration specs that avoid these mistakes.

---

## MCP Design Principles (OAIES Standard)

### 1. Design for the Agent, Not the API
The tool name and description must make sense to an LLM reasoning about what to do next — not to a developer reading API docs.

```json
// Wrong — designed for API documentation
{
  "name": "POST /api/v2/issues",
  "description": "Creates a new issue via the REST API"
}

// Correct — designed for agent reasoning
{
  "name": "create_issue",
  "description": "Create a new GitHub issue. Use when you need to report a bug, request a feature, or track work. Requires: title (required), body (optional), labels (optional array)."
}
```

### 2. Principle of Least Privilege
Every MCP server must only expose the minimum tools and permissions required. Do not expose delete operations if the agent only needs read access.

### 3. Avoid Context Bloat
Load tool definitions progressively. Don't register 50 tools at startup. Use categories or lazy loading so only relevant tools are in context.

### 4. Security First
All tool inputs are untrusted. Validate and sanitize before execution. Apply OAuth 2.1 for production deployments.

### 5. Every Tool Call Is Audited
All tool invocations (inputs and outputs) must be logged for audit, debugging, and cost tracking.

---

## Available MCP Integrations

### Developer Tools
| MCP | File | Primary Use |
|-----|------|------------|
| GitHub | [github.mcp.md](./version-control/github.mcp.md) | Issues, PRs, code search |
| GitLab | [gitlab.mcp.md](./version-control/gitlab.mcp.md) | MRs, pipelines, issues |
| Azure DevOps | [azure-devops.mcp.md](./version-control/azure-devops.mcp.md) | Work items, pipelines, repos |
| Playwright | [playwright.mcp.md](./devtools/playwright.mcp.md) | Browser automation, testing |
| Chrome DevTools | [chrome-devtools.mcp.md](./devtools/chrome-devtools.mcp.md) | Performance, debugging |

### Project Management
| MCP | File | Primary Use |
|-----|------|------------|
| Jira | [jira.mcp.md](./project-management/jira.mcp.md) | Issues, sprints, backlogs |
| Linear | [linear.mcp.md](./project-management/linear.mcp.md) | Issues, projects, cycles |
| Notion | [notion.mcp.md](./project-management/notion.mcp.md) | Docs, databases, pages |

### Communication
| MCP | File | Primary Use |
|-----|------|------------|
| Slack | [slack.mcp.md](./communication/slack.mcp.md) | Messages, channels, search |
| Microsoft Teams | [teams.mcp.md](./communication/teams.mcp.md) | Messages, meetings, files |

### Infrastructure
| MCP | File | Primary Use |
|-----|------|------------|
| Filesystem | [filesystem.mcp.md](./infrastructure/filesystem.mcp.md) | File read/write with path validation |
| Docker | [docker.mcp.md](./infrastructure/docker.mcp.md) | Container management |
| PostgreSQL | [postgres.mcp.md](./infrastructure/postgres.mcp.md) | Database queries (read-only by default) |
| Redis | [redis.mcp.md](./infrastructure/redis.mcp.md) | Cache operations |
| Supabase | [supabase.mcp.md](./infrastructure/supabase.mcp.md) | Database + auth + storage |

### Observability
| MCP | File | Primary Use |
|-----|------|------------|
| Sentry | [sentry.mcp.md](./observability/sentry.mcp.md) | Error tracking, performance |
| Datadog | [datadog.mcp.md](./observability/datadog.mcp.md) | Metrics, logs, traces |
| Grafana | [grafana.mcp.md](./observability/grafana.mcp.md) | Dashboards, alerts |
| OpenTelemetry | [opentelemetry.mcp.md](./observability/opentelemetry.mcp.md) | Traces, metrics, logs |

---

## MCP Specification Format

Every MCP in this library follows this specification:

```markdown
# {Service} MCP Integration

## Purpose
[What this MCP enables an agent to do]

## Security Model
[Authentication method, required permissions, threat model]

## Tool Definitions

### Tool: {tool_name}
**Description:** [Agent-facing description]
**Input schema:**
```json
{
  "property": "type — description"
}
```
**Output:** [What the tool returns]
**Rate limits:** [API limits to respect]
**Errors:** [Common errors and handling]

## Example Agent Interactions
[Concrete example of agent using this MCP]

## Anti-Patterns
[What not to do with this MCP]
```

---

## Security Considerations for All MCPs

Before deploying any MCP server in production:

- [ ] Authentication: OAuth 2.1 or API key with rotation schedule
- [ ] Authorization: Tool execution restricted by user permissions
- [ ] Input validation: All tool inputs validated (type, length, allowed patterns)
- [ ] Output filtering: Sensitive data stripped from tool responses
- [ ] Rate limiting: Tool calls rate-limited per user/session
- [ ] Audit logging: All tool calls logged with user, inputs, outputs
- [ ] Least privilege: Server can only access what it needs
- [ ] SSRF protection: Outbound calls from MCP server validate destinations

---

## Checklist

For each MCP server you deploy:
- [ ] Tool descriptions are agent-optimized (not API-documentation-style)
- [ ] Maximum 10-15 tools per server (fewer = better agent reasoning)
- [ ] All tool inputs validated before execution
- [ ] OAuth 2.1 authentication implemented
- [ ] Audit logging enabled
- [ ] Rate limiting configured
- [ ] Tested with adversarial inputs (injection, path traversal, SSRF)
- [ ] Documented in your system's architecture

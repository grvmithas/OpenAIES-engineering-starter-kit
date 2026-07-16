export interface NavItem {
  title: string;
  slug: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    slug: 'README',
    icon: '🚀',
  },
  {
    title: 'Contributing',
    slug: 'CONTRIBUTING',
    icon: '🤝',
  },
  {
    title: 'Changelog',
    slug: 'CHANGELOG',
    icon: '📋',
  },
  {
    title: 'L0 — AI Foundations',
    slug: '00-foundations/README',
    icon: '🧱',
    badge: 'Start Here',
    children: [
      { title: 'The Harness Principle', slug: '00-foundations/02-the-harness-principle' },
      { title: 'LLM Failure Modes', slug: '00-foundations/04-failure-modes' },
      { title: 'Readiness Checklist', slug: '00-foundations/checklists/foundations-readiness' },
    ],
  },
  {
    title: 'L1 — Prompt Engineering',
    slug: '01-prompt-engineering/README',
    icon: '✍️',
    children: [
      { title: 'XML Structured Prompts', slug: '01-prompt-engineering/patterns/xml-structured' },
      { title: 'Prompt Anti-Patterns', slug: '01-prompt-engineering/anti-patterns/prompt-anti-patterns' },
      { title: 'System Prompt Template', slug: '01-prompt-engineering/templates/system-prompt.template' },
    ],
  },
  {
    title: 'L2 — Context Engineering',
    slug: '02-context-engineering/README',
    icon: '📦',
    children: [
      { title: 'CLAUDE.md Template', slug: '02-context-engineering/templates/CLAUDE.md.template' },
    ],
  },
  {
    title: 'L3 — Skill Engineering',
    slug: '03-skill-engineering/README',
    icon: '🛠️',
    children: [
      { title: 'Debug Skill', slug: '03-skill-engineering/skills/debug.skill' },
      { title: 'Security Skill', slug: '03-skill-engineering/skills/security.skill' },
      { title: 'Code Review Skill', slug: '03-skill-engineering/skills/code-review.skill' },
    ],
  },
  {
    title: 'L4 — Agent Engineering',
    slug: '04-agent-engineering/README',
    icon: '🤖',
    children: [
      { title: 'Coder Agent', slug: '04-agent-engineering/agents/coder.agent' },
    ],
  },
  {
    title: 'L5 — Multi-Agent Systems',
    slug: '05-multi-agent-systems/README',
    icon: '🕸️',
  },
  {
    title: 'L6 — Memory & Knowledge',
    slug: '06-memory-knowledge/README',
    icon: '🧠',
  },
  {
    title: 'L7 — LLMOps',
    slug: '07-llmops/README',
    icon: '⚙️',
    children: [
      { title: 'Evaluation Frameworks', slug: '07-llmops/evaluation/framework-selection' },
    ],
  },
  {
    title: 'L8 — AI SDLC',
    slug: '08-ai-sdlc/README',
    icon: '🔄',
    children: [
      { title: 'Story Kickoff Prompt', slug: '08-ai-sdlc/prompts/story-kickoff.prompt' },
      { title: 'Implementation Plan Prompt', slug: '08-ai-sdlc/prompts/implementation-plan.prompt' },
      { title: 'Security Review Prompt', slug: '08-ai-sdlc/prompts/security-review.prompt' },
      { title: 'Root Cause Analysis Prompt', slug: '08-ai-sdlc/prompts/root-cause-analysis.prompt' },
      { title: 'Knowledge Capture Prompt', slug: '08-ai-sdlc/prompts/knowledge-capture.prompt' },
    ],
  },
  {
    title: 'L9 — Enterprise AI',
    slug: '09-enterprise-ai/README',
    icon: '🏢',
    children: [
      { title: 'ADR Template', slug: '09-enterprise-ai/templates/adr.template' },
    ],
  },
  {
    title: 'L10 — AI Org Playbook',
    slug: '10-ai-org-playbook/README',
    icon: '📖',
  },
  {
    title: 'AI Engineering Patterns',
    slug: 'patterns/README',
    icon: '🎯',
    badge: 'Unique',
    children: [
      { title: 'Planner Pattern', slug: 'patterns/planner-pattern/README' },
    ],
  },
  {
    title: 'AI Cookbook',
    slug: 'cookbook/README',
    icon: '🍳',
    children: [
      { title: 'React Cookbook', slug: 'cookbook/react/README' },
    ],
  },
  {
    title: 'MCP Integrations',
    slug: 'mcps/README',
    icon: '🔌',
    children: [
      { title: 'GitHub MCP', slug: 'mcps/version-control/github.mcp' },
    ],
  },
  {
    title: 'Checklists',
    slug: 'checklists/README',
    icon: '✅',
  },
  {
    title: 'Resources',
    slug: 'resources/README',
    icon: '📚',
  },
];

export function flattenNav(items: NavItem[]): NavItem[] {
  return items.reduce<NavItem[]>((acc, item) => {
    acc.push(item);
    if (item.children) acc.push(...flattenNav(item.children));
    return acc;
  }, []);
}

export function findNavItem(slug: string): NavItem | undefined {
  return flattenNav(navigation).find(item => item.slug === slug);
}

export function getPrevNext(slug: string): { prev?: NavItem; next?: NavItem } {
  const flat = flattenNav(navigation);
  const idx = flat.findIndex(item => item.slug === slug);
  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}

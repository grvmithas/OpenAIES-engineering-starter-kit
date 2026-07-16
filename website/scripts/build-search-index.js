const fs = require('fs');
const path = require('path');

// Resolve repo root regardless of where this script is called from
// Works both locally (../../ from website/scripts/) and on Vercel
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const CONTENT_DEST = path.join(__dirname, '..', 'content');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// These are the folders/files from the repo root to mirror into website/content/
const CONTENT_SOURCES = [
  'README.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  '00-foundations',
  '01-prompt-engineering',
  '02-context-engineering',
  '03-skill-engineering',
  '04-agent-engineering',
  '05-multi-agent-systems',
  '06-memory-knowledge',
  '07-llmops',
  '08-ai-sdlc',
  '09-enterprise-ai',
  '10-ai-org-playbook',
  'patterns',
  'cookbook',
  'mcps',
  'checklists',
  'resources',
];

const SKIP_NAMES = new Set(['node_modules', '.git', '.github', 'website', '.next']);

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      if (SKIP_NAMES.has(child)) continue;
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function mirrorContent() {
  // Clean the destination so stale files don't persist across builds
  if (fs.existsSync(CONTENT_DEST)) {
    fs.rmSync(CONTENT_DEST, { recursive: true, force: true });
  }
  fs.mkdirSync(CONTENT_DEST, { recursive: true });

  let copied = 0;
  for (const target of CONTENT_SOURCES) {
    const src = path.join(REPO_ROOT, target);
    if (fs.existsSync(src)) {
      copyRecursive(src, path.join(CONTENT_DEST, target));
      copied++;
    }
  }
  console.log(`Mirrored ${copied} content sources into website/content/`);
}

function extractTitle(markdown, slug) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/\*\*/g, '').replace(/`/g, '').trim();
  return slug.split('/').pop().replace(/-/g, ' ');
}

function extractDescription(markdown) {
  const lines = markdown.split('\n');
  let pastHeading = false;
  for (const line of lines) {
    if (line.startsWith('#')) { pastHeading = true; continue; }
    if (
      pastHeading && line.trim() &&
      !line.startsWith('#') && !line.startsWith('>') &&
      !line.startsWith('|') && !line.startsWith('-') &&
      !line.startsWith('```')
    ) {
      return line.trim().replace(/\*\*/g, '').replace(/`/g, '').slice(0, 160);
    }
  }
  return 'Open AI Engineering Standard — Production-grade AI engineering documentation.';
}

function scanDirectory(dir, relativePath = '') {
  const items = [];
  const fullPath = path.join(dir, relativePath);
  if (!fs.existsSync(fullPath)) return items;

  for (const entry of fs.readdirSync(fullPath, { withFileTypes: true })) {
    if (SKIP_NAMES.has(entry.name)) continue;
    const itemRelPath = path.join(relativePath, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      items.push(...scanDirectory(dir, itemRelPath));
    } else if (entry.name.endsWith('.md')) {
      const slug = itemRelPath.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(dir, itemRelPath), 'utf8');
      const clean = raw.replace(/^---[\s\S]*?---/, '');
      const text = clean
        .replace(/<[^>]*>/g, ' ')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/[#*`_\[\]()\-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      items.push({ slug, title: extractTitle(clean, slug), description: extractDescription(clean), text });
    }
  }
  return items;
}

function buildSearchIndex() {
  const docs = scanDirectory(CONTENT_DEST);
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'search-index.json'),
    JSON.stringify({ docs }, null, 2),
    'utf8'
  );
  console.log(`Search index built: ${docs.length} documents.`);
}

console.log('--- Prebuild: Syncing content ---');
mirrorContent();
buildSearchIndex();
console.log('--- Prebuild complete ---');

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

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
    if (pastHeading && line.trim() && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('|') && !line.startsWith('-') && !line.startsWith('```')) {
      return line.trim().replace(/\*\*/g, '').replace(/`/g, '').slice(0, 160);
    }
  }
  return 'Open AI Engineering Standard — Production-grade AI engineering documentation.';
}

function scanDirectory(dir, relativePath = '') {
  const items = [];
  const fullPath = path.join(dir, relativePath);
  
  if (!fs.existsSync(fullPath)) return items;
  
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const itemRelPath = path.join(relativePath, entry.name).replace(/\\/g, '/');
    
    // Ignore website folder, git, and github folders
    if (entry.name === 'website' || entry.name === '.git' || entry.name === '.github' || entry.name === 'node_modules') {
      continue;
    }
    
    if (entry.isDirectory()) {
      items.push(...scanDirectory(dir, itemRelPath));
    } else if (entry.name.endsWith('.md')) {
      const slug = itemRelPath.replace(/\.md$/, '');
      const fileContent = fs.readFileSync(path.join(dir, itemRelPath), 'utf8');
      
      // Strip frontmatter if present
      const cleanContent = fileContent.replace(/^---[\s\S]*?---/, '');
      
      // Strip markdown syntax for clean text search
      const text = cleanContent
        .replace(/<[^>]*>/g, ' ') // Strip HTML tags
        .replace(/```[\s\S]*?```/g, ' ') // Strip code blocks
        .replace(/[#*`_\[\]()\-]/g, ' ') // Strip markdown format characters
        .replace(/\s+/g, ' ')
        .trim();
        
      items.push({
        slug,
        title: extractTitle(cleanContent, slug),
        description: extractDescription(cleanContent),
        text
      });
    }
  }
  
  return items;
}

function buildIndex() {
  console.log('Compiling static search index...');
  
  const docs = scanDirectory(REPO_ROOT);
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'search-index.json'),
    JSON.stringify({ docs }, null, 2),
    'utf8'
  );
  
  console.log(`Successfully compiled static search index with ${docs.length} documents.`);
}

buildIndex();

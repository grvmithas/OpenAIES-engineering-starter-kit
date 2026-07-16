import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { flattenNav, navigation } from './navigation';

// Content is mirrored into website/content/ by the prebuild script.
// This keeps all files within the Next.js project boundary (required for Vercel NFT tracing).
// Same pattern used by Expo docs, Next.js docs, Docusaurus, etc.
const REPO_ROOT = path.join(process.cwd(), 'content');


export interface DocMeta {
  title: string;
  description: string;
  slug: string;
}

export interface DocBlock {
  type: 'html' | 'mermaid';
  content: string;
}

export interface Doc {
  slug: string;
  title: string;
  description: string;
  blocks: DocBlock[];
  rawContent: string;
  headings: Heading[];
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugToFilePath(slug: string): string {
  const candidates = [
    path.join(REPO_ROOT, `${slug}.md`),
    path.join(REPO_ROOT, slug, 'README.md'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidates[0]; // fallback
}

export function getAllDocSlugs(): string[] {
  return flattenNav(navigation).map(item => item.slug);
}

function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*/g, '').replace(/`/g, '');
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      headings.push({ id, text, level });
    }
  }
  return headings;
}

function extractTitle(markdown: string, slug: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/\*\*/g, '').replace(/`/g, '');
  return slug.split('/').pop()?.replace(/-/g, ' ') || slug;
}

function extractDescription(markdown: string): string {
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

function addHeadingIds(html: string): string {
  return html.replace(/<(h[1-3])>(.+?)<\/h[1-3]>/g, (_, tag, content) => {
    const text = content.replace(/<[^>]+>/g, '').replace(/[^a-z0-9\s-]/gi, '');
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `<${tag} id="${id}">${content}</${tag}>`;
  });
}

export async function getDoc(slug: string): Promise<Doc | null> {
  const filePath = slugToFilePath(slug);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content: markdown } = matter(fileContent);

  // Split content by mermaid blocks
  const parts = markdown.split(/(```mermaid[\s\S]*?```)/g);
  const blocks: DocBlock[] = [];

  for (const part of parts) {
    if (part.startsWith('```mermaid')) {
      const chart = part
        .replace(/^```mermaid\s*/, '')
        .replace(/```$/, '')
        .trim();
      blocks.push({ type: 'mermaid', content: chart });
    } else if (part.trim()) {
      const processed = await remark()
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .process(part);
      const htmlWithIds = addHeadingIds(processed.toString());
      blocks.push({ type: 'html', content: htmlWithIds });
    }
  }

  return {
    slug,
    title: extractTitle(markdown, slug),
    description: extractDescription(markdown),
    blocks,
    rawContent: markdown,
    headings: extractHeadings(markdown),
  };
}

export function getAllDocs(): DocMeta[] {
  return getAllDocSlugs().map(slug => {
    const filePath = slugToFilePath(slug);
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content: markdown } = matter(fileContent);
    return {
      slug,
      title: extractTitle(markdown, slug),
      description: extractDescription(markdown),
    };
  }).filter(Boolean) as DocMeta[];
}

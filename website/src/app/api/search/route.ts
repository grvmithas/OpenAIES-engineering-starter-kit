import { NextResponse } from 'next/server';
import { getAllDocs, getDoc } from '@/lib/docs';

export async function GET() {
  const docsMeta = getAllDocs();
  const fullDocs = [];
  
  for (const meta of docsMeta) {
    const doc = await getDoc(meta.slug);
    if (doc) {
      const combinedText = doc.blocks
        .map(b => b.content)
        .join(' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      fullDocs.push({
        slug: doc.slug,
        title: doc.title,
        description: doc.description,
        text: combinedText
      });
    }
  }

  return NextResponse.json({ docs: fullDocs });
}

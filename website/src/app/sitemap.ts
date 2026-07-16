import type { MetadataRoute } from 'next';
import { flattenNav, navigation } from '@/lib/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oaies.dev';
  // Use the static navigation list — no fs access needed, eliminates NFT warning
  const slugs = flattenNav(navigation).map(item => item.slug);

  const docPages = slugs.map(slug => ({
    url: `${baseUrl}/docs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: slug === 'README' ? 1 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...docPages,
  ];
}

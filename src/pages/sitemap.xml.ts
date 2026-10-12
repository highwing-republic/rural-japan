import type { APIRoute } from 'astro';
import { catalog } from '../data/catalog';
import { getRegionGuidePages } from '../data/guide-pages';

/** Static pages plus each region overview and visitor-guide page. Only referenced from robots.txt in public mode. */
export const sitemapPaths = ['/', '/about/', '/credits/', ...catalog.flatMap((region) => [
  `/places/${region.slug}/`,
  ...getRegionGuidePages(region).map(page => `/places/${region.slug}/${page.slug}/`),
])];

export const GET: APIRoute = ({ site }) => {
  if (!site) return new Response('site is not configured', { status: 404 });
  const urls = sitemapPaths.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

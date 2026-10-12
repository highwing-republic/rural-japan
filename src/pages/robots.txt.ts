import type { APIRoute } from 'astro';
import { indexable } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const lines = indexable
    ? ['User-agent: *', 'Allow: /', ...(site ? [`Sitemap: ${new URL('/sitemap.xml', site).href}`] : [])]
    : ['User-agent: *', 'Disallow: /'];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

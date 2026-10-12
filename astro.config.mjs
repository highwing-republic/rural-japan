import { defineConfig } from 'astro/config';

// `site` is the planned publication URL (tentative until UGATTA confirms it).
// Setting it only enables absolute canonical / Open Graph / sitemap URLs;
// the default build still emits `noindex` and a disallow-all robots.txt.
// Run `npm run build:public` (mode "public", see `.env.public`) for the
// indexable output, and `npm run build:sample` to include the sample region.
export default defineConfig({
  site: 'https://rural.ugatta-llc.com',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});

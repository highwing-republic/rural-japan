import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, access, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Builds each mode into .local/build-<mode> and checks the publication state of the output.
// Run with `npm run test:build` (roughly 10-15 s).
const root = fileURLToPath(new URL('../../', import.meta.url));
const run = promisify(execFile);
const astroCli = fileURLToPath(new URL('../../node_modules/astro/bin/astro.mjs', import.meta.url));

async function readHtmlDocuments(directory) {
  const documents = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) documents.push(...await readHtmlDocuments(entryUrl));
    else if (entry.name.endsWith('.html')) documents.push({ file: fileURLToPath(entryUrl), html: await readFile(entryUrl, 'utf8') });
  }
  return documents;
}

async function assertPublishableHtml(out) {
  const documents = await out.readAllHtml();
  assert.ok(documents.length > 0, 'build produced no HTML');
  for (const { file, html } of documents) {
    assert.doesNotMatch(html, /Phase 1|preview/i, file);
    assert.doesNotMatch(html, /neba-nagano\.com\/(?:wp-content|wp-includes)\//i, file);
  }
}

async function build(mode) {
  const outDir = `.local/build-${mode}`;
  await rm(new URL(`../../${outDir}`, import.meta.url), { recursive: true, force: true });
  const args = [astroCli, 'build', '--outDir', outDir, ...(mode === 'default' ? [] : ['--mode', mode])];
  await run(process.execPath, args, { cwd: root, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
  const outputRoot = new URL(`../../${outDir}/`, import.meta.url);
  const read = (file) => readFile(new URL(file, outputRoot), 'utf8');
  const exists = (file) => access(new URL(`../../${outDir}/${file}`, import.meta.url)).then(() => true, () => false);
  const readAllHtml = () => readHtmlDocuments(outputRoot);
  return { read, exists, readAllHtml };
}

test('default build stays private: noindex, disallow-all robots, no sample region, no canonical', async () => {
  const out = await build('default');
  const home = await out.read('index.html');
  assert.match(home, /<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(home, /rel="canonical"|property="og:/);
  assert.equal(await out.read('robots.txt'), 'User-agent: *\nDisallow: /\n');
  assert.equal(await out.exists('places/sample-village/index.html'), false);
  assert.equal(await out.exists('places/neba/index.html'), true);
  for (const section of ['sights', 'activities', 'food', 'stay', 'shopping', 'events', 'products', 'access']) {
    assert.equal(await out.exists(`places/neba/${section}/index.html`), true, section);
  }
  await assertPublishableHtml(out);
  assert.doesNotMatch(home, /sample-village/);
});

test('public build is indexable with canonical, Open Graph, sitemap and allow-all robots', async () => {
  const out = await build('public');
  const home = await out.read('index.html');
  const neba = await out.read('places/neba/index.html');
  assert.match(home, /<meta name="robots" content="index, follow">/);
  assert.match(home, /<link rel="canonical" href="https:\/\/rural\.ugatta-llc\.com\/">/);
  assert.match(neba, /<link rel="canonical" href="https:\/\/rural\.ugatta-llc\.com\/places\/neba\/">/);
  assert.match(neba, /property="og:url" content="https:\/\/rural\.ugatta-llc\.com\/places\/neba\/"/);
  assert.match(neba, /property="og:image" content="https:\/\/rural\.ugatta-llc\.com\/og-default\.png"/);
  assert.equal(await out.exists('og-default.png'), true);
  await assertPublishableHtml(out);
  assert.equal(await out.read('robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://rural.ugatta-llc.com/sitemap.xml\n');
  const sitemap = await out.read('sitemap.xml');
  for (const path of ['/', '/about/', '/credits/', '/places/neba/', '/places/neba/sights/', '/places/neba/activities/', '/places/neba/food/', '/places/neba/stay/', '/places/neba/shopping/', '/places/neba/events/', '/places/neba/products/', '/places/neba/access/']) assert.ok(sitemap.includes(`<loc>https://rural.ugatta-llc.com${path}</loc>`), path);
  assert.doesNotMatch(sitemap, /sample-village/);
  assert.equal(await out.exists('places/sample-village/index.html'), false);
});

test('sample build renders the verification region but remains private', async () => {
  const out = await build('sample');
  assert.equal(await out.exists('places/sample-village/index.html'), true);
  assert.equal(await out.exists('places/sample-village/sample-stay/index.html'), true);
  assert.equal(await out.exists('places/sample-village/products/index.html'), true);
  assert.equal(await out.exists('places/sample-village/access/index.html'), true);
  const home = await out.read('index.html');
  assert.match(home, /DESTINATIONS \/ 02/);
  assert.match(home, /href="\/places\/sample-village\/"/);
  assert.match(home, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(await out.read('places/sample-village/index.html'), /Information checked on <time datetime="2026-10-11">11 October 2026<\/time>/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { regions } from '../src/data/regions.ts';
import { getRegionGuidePages } from '../src/data/guide-pages.ts';
import { sampleRegion } from './fixtures/sample-region.ts';

const photos = JSON.parse(await readFile(new URL('../src/data/photos.json', import.meta.url), 'utf8'));
const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());

test('every photo has usable local assets and an explicit commercial license record', async () => {
  assert.equal(new Set(photos.map(photo => photo.id)).size, photos.length);
  for (const photo of photos) {
    for (const key of ['id', 'title', 'alt', 'author', 'sourceUrl', 'license', 'licenseUrl', 'location', 'capturedAt', 'verifiedAt', 'changes']) {
      assert.ok(photo[key]?.trim(), `${photo.id}: missing ${key}`);
    }
    assert.equal(photo.license, 'CC BY-SA 4.0', 'Review the commercial permission before accepting a new license');
    assert.ok(photo.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:'));
    assert.equal(photo.licenseUrl, 'https://creativecommons.org/licenses/by-sa/4.0/');
    assert.match(photo.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    for (const file of [photo.src, photo.srcSmall]) {
      assert.match(file, /^\/images\/[a-z0-9-]+\.webp$/);
      const info = await stat(new URL(`../public${file}`, import.meta.url));
      assert.ok(info.size > 1000 && info.size < 1000000, `${file}: missing or oversized`);
    }
    assert.ok(photo.width > 0 && photo.height > 0);
  }
});

function checkRegion(region, photoIds) {
  assert.match(region.slug, /^[a-z0-9-]+$/);
  assert.match(region.number, /^\d{2}$/, `${region.slug}: number must be two digits`);
  assert.ok(photoIds.has(region.hero));
  assert.ok(photoIds.has(region.cardImage));
  assert.equal(new URL(region.visitorUrl).protocol, 'https:');
  assert.match(region.informationCheckedOn, /^\d{4}-\d{2}-\d{2}$/, `${region.slug}: informationCheckedOn must be YYYY-MM-DD`);
  assert.ok(region.informationCheckedOn <= today, `${region.slug}: informationCheckedOn is in the future`);
  assert.equal(new Set(region.chapters.map(chapter => chapter.id)).size, region.chapters.length);
  for (const chapter of region.chapters) {
    assert.ok(photoIds.has(chapter.image), chapter.image);
    assert.match(chapter.id, /^[a-z0-9-]+$/);
    assert.ok(chapter.navLabel?.trim(), `${region.slug}/${chapter.id}: navLabel is required for the chapter navigation`);
    assert.ok(chapter.label.includes(' / '), `${region.slug}/${chapter.id}: label should read "NN / TITLE"`);
  }
  assert.ok(region.guideSections.length > 0, `${region.slug}: guide sections are required`);
  assert.equal(new Set(region.guideSections.map(section => section.id)).size, region.guideSections.length);
  for (const section of region.guideSections) {
    assert.match(section.id, /^[a-z0-9-]+$/);
    assert.ok(section.items.length > 0, `${region.slug}/${section.id}: empty guide section`);
    for (const item of section.items) {
      assert.ok(item.name && item.japaneseName && item.description);
      assert.equal(new URL(item.url).protocol, 'https:');
      if (item.phone) assert.match(item.phone, /^\+81 \d{2,4}-\d{2,4}-\d{4}$/, `${region.slug}/${section.id}/${item.name}: invalid international phone`);
    }
  }
  assert.ok(region.specialties.length > 0, `${region.slug}: specialties are required`);
  assert.ok(region.accessRoutes.length > 0, `${region.slug}: access routes are required`);
  assert.ok(region.travelNotes.length >= 1 && region.travelNotes.length <= 9, `${region.slug}: 1-9 travel notes expected`);
  assert.ok(region.sources.length > 0);
  for (const source of region.sources) assert.equal(new URL(source.url).protocol, 'https:');
  const guidePages = getRegionGuidePages(region);
  assert.equal(guidePages.length, region.guideSections.length + 2);
  assert.equal(new Set(guidePages.map(page => page.slug)).size, guidePages.length);
  for (const page of guidePages) {
    assert.match(page.slug, /^[a-z0-9-]+$/);
    assert.ok(photoIds.has(page.image), `${region.slug}/${page.slug}: unresolved image ${page.image}`);
  }
}

test('destination records have unique routes, sections, dates and resolved image references', () => {
  assert.ok(regions.length > 0);
  assert.equal(new Set(regions.map(region => region.slug)).size, regions.length);
  assert.equal(new Set(regions.map(region => region.number)).size, regions.length, 'region numbers must be unique');
  const photoIds = new Set(photos.map(photo => photo.id));
  for (const region of regions) checkRegion(region, photoIds);
  const neba = regions.find(region => region.slug === 'neba');
  assert.ok(neba);
  const expectedCounts = { see: 13, do: 5, eat: 7, stay: 3, shop: 4 };
  for (const [id, count] of Object.entries(expectedCounts)) assert.equal(neba.guideSections.find(section => section.id === id)?.items.length, count, `neba/${id}: source listing count changed`);
  const sights = neba.guideSections.find(section => section.id === 'see')?.items ?? [];
  assert.equal(new Set(sights.map(item => item.url)).size, 13);
  for (const item of sights) assert.match(item.url, /^https:\/\/neba-nagano\.com\/\?p=\d+$/);
  assert.ok(neba.specialties.every(item => item.whereToFind?.trim()), 'neba: every specialty needs a whereToFind note');
});

test('the sample region fixture stays valid and distinct from published regions', () => {
  const photoIds = new Set(photos.map(photo => photo.id));
  checkRegion(sampleRegion, photoIds);
  assert.ok(!regions.some(region => region.slug === sampleRegion.slug || region.number === sampleRegion.number));
});

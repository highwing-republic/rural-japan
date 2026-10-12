import type { Region } from '../../src/data/regions';

/**
 * Verification-only destination used to prove that a second region renders
 * through the shared template and home-page listing. It reuses the existing
 * photo IDs so no new images or licenses are involved. It is only included
 * in `--mode sample` (see `.env.sample`) and must never appear in a default
 * or public build; `tests/build/output.test.mjs` enforces that.
 */
export const sampleRegion: Region = {
  slug: 'sample-village',
  name: 'Sample Village',
  japaneseName: '見本村',
  prefecture: 'Testshire',
  number: '99',
  title: 'A placeholder\nfor layout checks.',
  introduction: 'This entry exists only to verify that the region template, home-page listing and credits links work for a second destination. It is not editorial content.',
  hero: 'fields',
  cardImage: 'cedar',
  cardCaption: 'Sample caption for layout checks',
  cardHeading: 'Second card,\nsame template.',
  cardDescription: 'Placeholder description used to check spacing, wrapping and the destination list when more than one region exists.',
  themes: ['Layout', 'Template', 'Checks'],
  welcome: 'ようこそ、見本村へ。',
  visitorUrl: 'https://example.com/',
  visitorLabel: 'Sample visitor information (Japanese)',
  informationCheckedOn: '2026-10-11',
  chapters: [
    { id: 'first-chapter', label: '01 / FIRST CHAPTER', navLabel: 'FIRST CHAPTER', title: 'Chapter one\nfor layout.', body: 'Placeholder body text long enough to wrap across a couple of lines on desktop and several on a narrow phone screen.', image: 'landscape', caption: 'Sample chapter caption' },
    { id: 'second-chapter', label: '02 / SECOND CHAPTER', navLabel: 'SECOND CHAPTER', title: 'Chapter two\nreversed.', body: 'Placeholder body for the reversed layout variant, used to confirm the alternating photo and copy columns.', image: 'river', caption: 'Sample chapter caption' },
  ],
  guideSections: [
    {
      id: 'sample-stay',
      label: '01 / STAY',
      title: 'Somewhere to sleep.',
      introduction: 'Placeholder guide section with two listings to check the card grid.',
      items: [
        { name: 'Sample Inn', japaneseName: '見本の宿', type: 'Guesthouse', description: 'Placeholder listing description.', address: '1-1 Sample, Testshire', url: 'https://example.com/stay/' },
        { name: 'Sample Campsite', japaneseName: '見本キャンプ場', type: 'Campsite', description: 'Placeholder listing without an address.', url: 'https://example.com/camp/' },
      ],
    },
  ],
  specialties: [
    { name: 'Sample produce', japaneseName: '見本の特産', description: 'Placeholder specialty description.' },
  ],
  accessRoutes: [
    { origin: 'Sample City', duration: 'About 1 h', route: 'Placeholder route description.' },
  ],
  accessNote: 'Placeholder access note. Confirm conditions before travel.',
  travelNotes: [
    { title: 'Note one', body: 'Placeholder travel note.' },
    { title: 'Note two', body: 'Placeholder travel note.' },
    { title: 'Note three', body: 'Placeholder travel note.' },
  ],
  sources: [{ label: 'Sample source (Japanese)', url: 'https://example.com/source/' }],
};

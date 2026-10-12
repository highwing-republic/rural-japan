import type { Region } from './regions';

const sectionSlugs: Record<string, string> = {
  see: 'sights',
  do: 'activities',
  eat: 'food',
  stay: 'stay',
  shop: 'shopping',
  events: 'events',
};

const sectionImages: Record<string, string> = {
  see: 'cedar',
  do: 'river',
  eat: 'fields',
  stay: 'landscape',
  shop: 'fields',
  events: 'river',
};

export type RegionGuidePage =
  | { kind: 'directory'; slug: string; navLabel: string; image: string; section: Region['guideSections'][number] }
  | { kind: 'specialties'; slug: 'products'; navLabel: string; image: string }
  | { kind: 'access'; slug: 'access'; navLabel: string; image: string };

export function getRegionGuidePages(region: Region): RegionGuidePage[] {
  const directoryPages: RegionGuidePage[] = region.guideSections.map(section => ({
    kind: 'directory',
    slug: sectionSlugs[section.id] ?? section.id,
    navLabel: section.title,
    image: sectionImages[section.id] ?? region.hero,
    section,
  }));

  return [
    ...directoryPages,
    { kind: 'specialties', slug: 'products', navLabel: 'Local products', image: 'fields' },
    { kind: 'access', slug: 'access', navLabel: 'Access', image: region.hero },
  ];
}

import { regions, type Region } from './regions';
import { sampleRegion } from '../../tests/fixtures/sample-region';

/**
 * Regions that pages render. The sample region is appended only when the
 * build/dev server runs with `--mode sample` (see `.env.sample`), so it never
 * reaches a default or public build. `tests/build.test.mjs` guards this.
 */
export const includeSampleRegion = import.meta.env.PUBLIC_SAMPLE_REGION === 'true';
export const catalog: Region[] = includeSampleRegion ? [...regions, sampleRegion] : regions;

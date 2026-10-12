/** Build-time publication switches. See `.env.public` and `astro.config.mjs`. */
export const siteName = 'RURAL JAPAN';
export const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
/** Default share image (text / wordmark only, no licensed photography). */
export const defaultOgImage = '/og-default.png';

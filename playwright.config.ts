import { defineConfig, devices } from '@playwright/test';

// Browser tests run against the default (private) dev server. The `public` and
// `sample` build modes are verified by `npm run test:build` (tests/build/output.test.mjs);
// to inspect the sample region in a browser, run `npm run dev -- --mode sample`.
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  // Trace files intermittently disappear during context shutdown on this Windows host
  // (ENOENT under test-results). Screenshots and error contexts remain enabled.
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'off' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'msedge', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', channel: 'msedge' } },
  ],
  webServer: {
    command: 'npm run dev -- --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});

import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://egev2.vercel.app'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['json', { outputFile: 'audit/reports/test-results.json' }],
    ['html', { outputFolder: 'audit/reports/playwright-html', open: 'never' }],
  ],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'auth-setup',
      testMatch: 'auth.setup.ts',
    },
    {
      name: 'desktop',
      testIgnore: ['lighthouse.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        storageState: 'e2e/.auth/student.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'tablet',
      testIgnore: ['lighthouse.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        storageState: 'e2e/.auth/student.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'mobile',
      testIgnore: ['lighthouse.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        storageState: 'e2e/.auth/student.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'lighthouse',
      testMatch: 'lighthouse.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        storageState: 'e2e/.auth/student.json',
      },
      dependencies: ['auth-setup'],
      fullyParallel: false,
      workers: 1,
      retries: 0,
      timeout: 120_000,
    },
  ],
})

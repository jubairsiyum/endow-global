import { test, expect, type Page } from '@playwright/test'
import {
  captureScreenshot,
  auditRoute,
  writeAuditResults,
  routeKey,
  screenshotPath,
} from './shared'
import type { RouteAuditResult } from './shared'

// ─── Accumulator for all results ───
const allResults: RouteAuditResult[] = []

function track(result: RouteAuditResult) {
  allResults.push(result)
}

test.afterAll(() => {
  if (allResults.length > 0) {
    writeAuditResults(allResults)
  }
})

// ─── Helpers ───

async function loadAndScreenshot(page: Page, path: string, testInfo: Parameters<Parameters<typeof test>[1]>[0]) {
  const url = path.startsWith('http') ? path : path
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })

  const fp = screenshotPath(routeKey(path), testInfo.project.name)
  await page.screenshot({ path: fp, fullPage: false })

  return auditRoute(page, path, testInfo)
}

async function discoverCourseSlug(page: Page): Promise<string | null> {
  await page.goto('/courses', { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
  await page.waitForTimeout(1000)

  const link = page.locator('a[href*="/courses/"]').first()
  if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
    const href = await link.getAttribute('href')
    return href ?? null
  }
  return null
}

async function discoverCountrySlug(page: Page): Promise<string | null> {
  await page.goto('/universities', { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
  await page.waitForTimeout(1000)

  const link = page.locator('a[href*="/universities/country/"]').first()
  if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
    const href = await link.getAttribute('href')
    return href ? href.replace('/universities', '') : null
  }
  return null
}

// ────────────────────────────────────────
// PUBLIC ROUTES
// ────────────────────────────────────────

test.describe('Public: Home /', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/', testInfo)
    await expect(page.locator('body')).toBeVisible()
    expect(result.axeViolations).toBeGreaterThanOrEqual(0)
    track(result)
  })
})

test.describe('Public: Universities /universities', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/universities', testInfo)
    await expect(page.locator('body')).toBeVisible()
    track(result)
  })
})

test.describe('Public: Universities Country /universities/country/[slug]', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const slug = await discoverCountrySlug(page)
    if (!slug) {
      test.skip(true, 'No country slug found on universities page')
      return
    }
    const result = await loadAndScreenshot(page, `/universities${slug}`, testInfo)
    await expect(page.locator('body')).toBeVisible()
    track(result)
  })
})

test.describe('Public: Courses /courses', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/courses', testInfo)
    await expect(page.locator('body')).toBeVisible()
    track(result)
  })
})

test.describe('Public: Course Detail /courses/[slug]', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const slug = await discoverCourseSlug(page)
    if (!slug) {
      test.skip(true, 'No course slug found on courses page')
      return
    }
    const result = await loadAndScreenshot(page, slug, testInfo)
    await expect(page.locator('body')).toBeVisible()
    track(result)
  })
})

test.describe('Public: Blog /blog', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/blog', testInfo)
    await expect(page.locator('body')).toBeVisible()
    track(result)
  })
})

test.describe('Public: About /about', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/about', testInfo)
    await expect(page.locator('body')).toBeVisible()
    track(result)
  })
})

test.describe('Public: Login /login', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/login', testInfo)
    await expect(page.locator('body')).toBeVisible()
    track(result)
  })
})

test.describe('Public: Register /register', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/register', testInfo)
    await expect(page.locator('body')).toBeVisible()
    track(result)
  })
})

// ────────────────────────────────────────
// AUTHENTICATED ROUTES
// ────────────────────────────────────────

test.describe('Auth: Dashboard /dashboard', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/dashboard', testInfo)
    await expect(page.locator('body')).toBeVisible()

    const url = page.url()
    if (url.includes('/login')) {
      test.skip(true, 'Not authenticated — login redirect detected')
      return
    }
    track(result)
  })
})

test.describe('Auth: Applications /dashboard/application', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/dashboard/application', testInfo)
    await expect(page.locator('body')).toBeVisible()

    if (page.url().includes('/login')) {
      test.skip(true, 'Not authenticated — login redirect detected')
      return
    }
    track(result)
  })
})

test.describe('Auth: Appointments /dashboard/appointments', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/dashboard/appointments', testInfo)
    await expect(page.locator('body')).toBeVisible()

    if (page.url().includes('/login')) {
      test.skip(true, 'Not authenticated — login redirect detected')
      return
    }
    track(result)
  })
})

test.describe('Auth: Documents /dashboard/documents', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/dashboard/documents', testInfo)
    await expect(page.locator('body')).toBeVisible()

    if (page.url().includes('/login')) {
      test.skip(true, 'Not authenticated — login redirect detected')
      return
    }
    track(result)
  })
})

test.describe('Auth: Deadlines /dashboard/deadlines', () => {
  test('loads and audits', async ({ page }, testInfo) => {
    const result = await loadAndScreenshot(page, '/dashboard/deadlines', testInfo)
    await expect(page.locator('body')).toBeVisible()

    if (page.url().includes('/login')) {
      test.skip(true, 'Not authenticated — login redirect detected')
      return
    }
    track(result)
  })
})

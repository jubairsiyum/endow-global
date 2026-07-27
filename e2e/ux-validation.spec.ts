import { test, expect, type Page } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import {
  captureScreenshot,
  runAxeAudit,
  measureCLS,
  routeKey,
  screenshotPath as beforeScreenshotPath,
} from './shared'

const AFTER_SCREENSHOTS_DIR = path.resolve(process.cwd(), 'audit', 'screenshots', 'after')

function afterScreenshotPath(route: string, project: string): string {
  return path.join(AFTER_SCREENSHOTS_DIR, `${routeKey(route)}__${project}.png`)
}

const REPORTS_DIR = path.resolve(process.cwd(), 'audit', 'reports')

interface ValidationResult {
  route: string
  project: string
  axeViolations: number
  axeDelta: number
  cls: number | null
  clsDelta: string
  loadTimeMs: number
  loadTimeDelta: string
}

interface ComparisonReport {
  timestamp: string
  baseUrl: string
  threshold: { performance: number; accessibility: number }
  routes: {
    route: string
    beforeLighthouse?: {
      performance: number
      accessibility: number
    }
    afterLighthouse?: {
      performance: number
      accessibility: number
    }
    flagPerformance: boolean
    flagAccessibility: boolean
  }[]
  results: ValidationResult[]
}

async function compareWithBaseline(
  page: Page,
  route: string,
  project: string,
  testInfo: Parameters<Parameters<typeof test>[1]>[0]
): Promise<ValidationResult> {
  fs.mkdirSync(AFTER_SCREENSHOTS_DIR, { recursive: true })

  const start = Date.now()

  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  await page.waitForTimeout(500)

  const loadTime = Date.now() - start

  const afterScreenshot = afterScreenshotPath(route, project)
  await page.screenshot({ path: afterScreenshot, fullPage: false })

  const [axeResult, clsValue] = await Promise.all([
    runAxeAudit(page),
    measureCLS(page),
  ])

  // Try to find before audit data
  const beforeAuditPath = path.join(REPORTS_DIR, 'ux-audit.json')
  let axeDelta = 0
  let clsDelta = 'N/A'
  let loadTimeDelta = 'N/A'

  if (fs.existsSync(beforeAuditPath)) {
    const beforeData = JSON.parse(fs.readFileSync(beforeAuditPath, 'utf8'))
    const beforeEntry = beforeData.find(
      (e: { route: string; project: string }) =>
        e.route === route && e.project === project
    )
    if (beforeEntry) {
      axeDelta = axeResult.count - (beforeEntry.axeViolations ?? 0)
      clsDelta = clsValue !== null ? (clsValue - (beforeEntry.cls ?? 0)).toFixed(4) : 'N/A'
      loadTimeDelta = `${(loadTime - (beforeEntry.loadTimeMs ?? loadTime)).toFixed(0)}ms`
    }
  }

  await testInfo.attach('after-screenshot', {
    path: afterScreenshot,
    contentType: 'image/png',
  })

  return {
    route,
    project,
    axeViolations: axeResult.count,
    axeDelta,
    cls: clsValue,
    clsDelta,
    loadTimeMs: loadTime,
    loadTimeDelta,
  }
}

// ────────────────────────────────────────
// VALIDATION TESTS
// ────────────────────────────────────────

test.describe('Validation: Post-Implementation Audit', () => {
  const results: ValidationResult[] = []

  test.afterAll(() => {
    const outPath = path.join(REPORTS_DIR, 'validation-results.json')
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2))

    // Generate comparison report
    const beforeLighthousePath = path.join(REPORTS_DIR, 'lighthouse-before.json')
    const comparison: ComparisonReport = {
      timestamp: new Date().toISOString(),
      baseUrl: process.env.PLAYWRIGHT_BASE_URL ?? 'http://egev2.vercel.app',
      threshold: { performance: 90, accessibility: 95 },
      routes: [],
      results,
    }

    if (fs.existsSync(beforeLighthousePath)) {
      const beforeLH = JSON.parse(fs.readFileSync(beforeLighthousePath, 'utf8'))
      for (const entry of beforeLH) {
        comparison.routes.push({
          route: entry.route,
          beforeLighthouse: {
            performance: entry.performance,
            accessibility: entry.accessibility,
          },
          flagPerformance: entry.performance < 90,
          flagAccessibility: entry.accessibility < 95,
        })
      }
    }

    fs.writeFileSync(
      path.join(REPORTS_DIR, 'comparison-report.json'),
      JSON.stringify(comparison, null, 2)
    )
  })

  test('/ — homepage', async ({ page }, testInfo) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const result = await compareWithBaseline(page, '/', testInfo.project.name, testInfo)
    results.push(result)
    expect(result.axeViolations).toBeLessThanOrEqual(3)
  })

  test('/universities', async ({ page }, testInfo) => {
    await page.goto('/universities', { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const result = await compareWithBaseline(page, '/universities', testInfo.project.name, testInfo)
    results.push(result)
  })

  test('/courses', async ({ page }, testInfo) => {
    await page.goto('/courses', { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const result = await compareWithBaseline(page, '/courses', testInfo.project.name, testInfo)
    results.push(result)
  })

  test('/blog', async ({ page }, testInfo) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const result = await compareWithBaseline(page, '/blog', testInfo.project.name, testInfo)
    results.push(result)
  })

  test('/about', async ({ page }, testInfo) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const result = await compareWithBaseline(page, '/about', testInfo.project.name, testInfo)
    results.push(result)
  })

  test('/login', async ({ page }, testInfo) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const result = await compareWithBaseline(page, '/login', testInfo.project.name, testInfo)
    results.push(result)
  })

  test('/register', async ({ page }, testInfo) => {
    await page.goto('/register', { waitUntil: 'domcontentloaded', timeout: 30_000 })
    const result = await compareWithBaseline(page, '/register', testInfo.project.name, testInfo)
    results.push(result)
  })
})

// ────────────────────────────────────────
// A11Y & PERFORMANCE THRESHOLD CHECKS
// ────────────────────────────────────────

test.describe('Validation: Threshold Assertions', () => {
  test('No critical axe violations on any public page', async ({ page }) => {
    const routes = ['/', '/universities', '/courses', '/blog', '/about', '/login']
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 })
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
      const results = await runAxeAudit(page)
      expect(
        results.byImpact.critical,
        `${route} has ${results.byImpact.critical} critical axe violations: ${JSON.stringify(results.violations.filter((v) => v.impact === 'critical').map((v) => v.id))}`
      ).toBe(0)
    }
  })

  test('CLS below 0.1 threshold on all public pages', async ({ page }) => {
    const routes = ['/', '/universities', '/courses', '/blog', '/about']
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 })
      await page.waitForTimeout(2000)
      const cls = await measureCLS(page)
      if (cls !== null) {
        expect(cls, `${route} CLS ${cls} exceeds 0.1`).toBeLessThan(0.1)
      }
    }
  })
})

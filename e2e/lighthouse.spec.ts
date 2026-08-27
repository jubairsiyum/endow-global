import { test } from '@playwright/test'
import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import type { Page } from '@playwright/test'

// Lighthouse is imported dynamically as it's an ESM module
// We use a dynamic import inside the test

const REPORTS_DIR = path.resolve(process.cwd(), 'audit', 'reports')

interface LHRResult {
  route: string
  url: string
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
  fcp: number
  lcp: number
  tbt: number
  cls: number
  si: number
  tti: number
}

const PUBLIC_ROUTES = [
  '/',
  '/universities',
  '/courses',
  '/blog',
  '/about',
  '/login',
  '/register',
]

const AUTH_ROUTES = [
  '/dashboard',
  '/dashboard/application',
  '/dashboard/appointments',
  '/dashboard/deadlines',
]

const CDP_PORT = 9223

async function runLighthouseForUrl(
  url: string,
  cookies?: { name: string; value: string; domain: string; path: string }[]
): Promise<LHRResult | null> {
  const lighthouseModule = await import('lighthouse/core/index.js')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lighthouse = (lighthouseModule as any).default
  const reportDest = path.join(process.cwd(), 'audit', 'reports', '.lh-tmp.json')

  // Use a separate browser for Lighthouse
  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${CDP_PORT}`],
    headless: true,
  })

  try {
    const context = await browser.newContext()

    // Set cookies for authenticated routes
    if (cookies && cookies.length > 0) {
      await context.addCookies(cookies)
    }

    const page = await context.newPage()
    // Warm up the page
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await page.waitForTimeout(2000)

    const flags = {
      port: CDP_PORT,
      output: 'json' as const,
      logLevel: 'error' as const,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] as string[],
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await lighthouse(url, flags, undefined)

    if (!result || !result.lhr) {
      console.warn(`Lighthouse returned no result for ${url}`)
      return null
    }

    const { lhr } = result
    const categories = lhr.categories
    const audits = lhr.audits

    // Clean up temporary file if lighthouse wrote one
    if (fs.existsSync(reportDest)) {
      fs.unlinkSync(reportDest)
    }

    return {
      route: url,
      url: lhr.finalDisplayedUrl ?? url,
      performance: categories.performance?.score ? Math.round(categories.performance.score * 100) : 0,
      accessibility: categories.accessibility?.score
        ? Math.round(categories.accessibility.score * 100)
        : 0,
      bestPractices: categories['best-practices']?.score
        ? Math.round(categories['best-practices'].score * 100)
        : 0,
      seo: categories.seo?.score ? Math.round(categories.seo.score * 100) : 0,
      fcp: audits['first-contentful-paint']?.numericValue ?? 0,
      lcp: audits['largest-contentful-paint']?.numericValue ?? 0,
      tbt: audits['total-blocking-time']?.numericValue ?? 0,
      cls: audits['cumulative-layout-shift']?.numericValue ?? 0,
      si: audits['speed-index']?.numericValue ?? 0,
      tti: audits['interactive']?.numericValue ?? 0,
    }
  } catch (err) {
    console.warn(`Lighthouse error for ${url}:`, (err as Error).message)
    return null
  } finally {
    await browser.close()
  }
}

// ── Sequential test with both public and authenticated routes ──

test.describe('Lighthouse - Public Routes', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`audit ${route}`, async () => {
      const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://egev2.vercel.app'
      const fullUrl = `${baseUrl}${route}`

      const result = await runLighthouseForUrl(fullUrl)

      if (result) {
        const outPath = path.join(REPORTS_DIR, 'lighthouse-before.json')
        const existing = fs.existsSync(outPath)
          ? JSON.parse(fs.readFileSync(outPath, 'utf8'))
          : []
        existing.push(result)
        fs.writeFileSync(outPath, JSON.stringify(existing, null, 2))

        console.log(
          `${route} — Perf:${result.performance} A11y:${result.accessibility} BP:${result.bestPractices} SEO:${result.seo}`
        )
      } else {
        console.warn(`${route} — FAILED (no data)`)
      }
    })
  }
})

test.describe('Lighthouse - Authenticated Routes', () => {
  test('audit authenticated routes', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://egev2.vercel.app'

    // Extract cookies from the Playwright context for authenticated routes
    const pwCookies = await page.context().cookies()
    const currentUrl = new URL(baseUrl)
    const domain = currentUrl.hostname

    const cookies = pwCookies
      .filter((c) => c.name.includes('better-auth') || c.name.includes('session'))
      .map((c) => ({
        name: c.name,
        value: c.value,
        domain: c.domain || domain,
        path: c.path || '/',
      }))

    if (cookies.length === 0) {
      console.warn('No session cookies found — skipping authenticated lighthouse runs')
      return
    }

    for (const route of AUTH_ROUTES) {
      const fullUrl = `${baseUrl}${route}`
      const result = await runLighthouseForUrl(fullUrl, cookies)

      if (result) {
        const outPath = path.join(REPORTS_DIR, 'lighthouse-before.json')
        const existing = fs.existsSync(outPath)
          ? JSON.parse(fs.readFileSync(outPath, 'utf8'))
          : []
        existing.push(result)
        fs.writeFileSync(outPath, JSON.stringify(existing, null, 2))

        console.log(
          `[auth] ${route} — Perf:${result.performance} A11y:${result.accessibility} BP:${result.bestPractices} SEO:${result.seo}`
        )
      } else {
        console.warn(`[auth] ${route} — FAILED (no data)`)
      }
    }
  })
})

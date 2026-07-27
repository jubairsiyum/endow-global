import type { Page, Locator } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import fs from 'fs'
import path from 'path'

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'audit', 'screenshots', 'before')
const REPORTS_DIR = path.resolve(process.cwd(), 'audit', 'reports')

export function screenshotPath(routeKey: string, project: string): string {
  return path.join(SCREENSHOTS_DIR, `${routeKey}__${project}.png`)
}

export function dataPath(filename: string): string {
  return path.join(REPORTS_DIR, filename)
}

export interface RouteAuditResult {
  route: string
  project: string
  url: string
  status: number
  axeViolations: number
  axeViolationsByImpact: {
    critical: number
    serious: number
    moderate: number
    minor: number
  }
  cls: number | null
  lcpElement: string | null
  interactionStatesCaptured: string[]
  loadTimeMs: number
}

/**
 * Get the current project name from the test info.
 */
export function getProject(testInfo: { project: { name: string } }): string {
  return testInfo.project.name
}

/**
 * Convert a URL path to a safe filename key.
 * Replaces slashes and special chars.
 */
export function routeKey(route: string): string {
  return route.replace(/\//g, '_').replace(/^_/, '').replace(/[^a-zA-Z0-9_-]/g, '_') || 'home'
}

/**
 * Wait for the page to be stable (no ongoing animations, network idle).
 */
export async function waitForStable(page: Page, timeout = 15_000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {
    // Some pages never reach full idle — proceed anyway
  })
  await page.waitForTimeout(800)
}

/**
 * Capture a full-page screenshot.
 */
export async function captureScreenshot(
  page: Page,
  route: string,
  project: string
): Promise<string> {
  const fp = screenshotPath(routeKey(route), project)
  fs.mkdirSync(path.dirname(fp), { recursive: true })
  await page.screenshot({ path: fp, fullPage: false })
  return fp
}

/**
 * Run axe-core a11y audit.
 */
export async function runAxeAudit(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  const byImpact = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  }

  for (const v of results.violations) {
    const impact = v.impact as keyof typeof byImpact
    if (impact in byImpact) byImpact[impact]++
  }

  return {
    violations: results.violations,
    count: results.violations.length,
    byImpact,
  }
}

/**
 * Measure Cumulative Layout Shift via PerformanceObserver.
 */
export async function measureCLS(page: Page): Promise<number | null> {
  try {
    const cls = await page.evaluate(() => {
      return new Promise<number | null>((resolve) => {
        let value: number | null = null
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // LayoutShift has 'value' property but TypeScript DOM types may not have it
              const e = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }
              if (e.value !== undefined && !e.hadRecentInput) {
                value = (value ?? 0) + e.value
              }
            }
          })
          observer.observe({ type: 'layout-shift', buffered: true })
          setTimeout(() => {
            observer.disconnect()
            resolve(value)
          }, 1500)
        } catch {
          resolve(null)
        }
      })
    })
    return cls
  } catch {
    return null
  }
}

/**
 * Track LCP element info.
 */
export async function getLCPElement(page: Page): Promise<string | null> {
  try {
    return await page.evaluate(() => {
      return new Promise<string | null>((resolve) => {
        let resolved = false
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const last = entries[entries.length - 1] as PerformanceEntry & { element?: Element }
            if (last?.element && !resolved) {
              resolved = true
              resolve(last.element.tagName + (last.element.id ? '#' + last.element.id : ''))
            }
          })
          observer.observe({ type: 'largest-contentful-paint', buffered: true })
          setTimeout(() => {
            observer.disconnect()
            if (!resolved) resolve(null)
          }, 500)
        } catch {
          resolve(null)
        }
      })
    })
  } catch {
    return null
  }
}

/**
 * Hover over an element (if visible) and capture a screenshot.
 */
export async function hoverAndCapture(
  page: Page,
  selector: string,
  route: string,
  project: string,
  stateName: string
): Promise<string | null> {
  const el = page.locator(selector).first()
  if (!(await el.isVisible().catch(() => false))) return null
  await el.hover({ force: true })
  await page.waitForTimeout(400)
  const fp = screenshotPath(routeKey(route), `${project}__${stateName}`)
  await page.screenshot({ path: fp, fullPage: false })
  return fp
}

/**
 * Focus an element and capture a screenshot.
 */
export async function focusAndCapture(
  page: Page,
  selector: string,
  route: string,
  project: string,
  stateName: string
): Promise<string | null> {
  const el = page.locator(selector).first()
  if (!(await el.isVisible().catch(() => false))) return null
  await el.focus()
  await page.waitForTimeout(300)
  const fp = screenshotPath(routeKey(route), `${project}__${stateName}`)
  await page.screenshot({ path: fp, fullPage: false })
  return fp
}

/**
 * Record a full audit entry for a single route + project combination.
 */
export async function auditRoute(
  page: Page,
  route: string,
  testInfo: { project: { name: string } }
): Promise<RouteAuditResult> {
  const project = getProject(testInfo)
  const start = Date.now()

  await waitForStable(page)

  const loadTime = Date.now() - start

  const [axeResult, clsValue, lcpEl] = await Promise.all([
    runAxeAudit(page),
    measureCLS(page),
    getLCPElement(page),
  ])

  const interactionStates: string[] = []

  // Hover the first CTA/link
  const hoverCandidates = [
    'a[href]',
    'button',
    '[role="button"]',
    '.group',
    '[data-hover]',
  ]
  for (const sel of hoverCandidates) {
    const hovered = await hoverAndCapture(page, sel, route, project, 'hover')
    if (hovered) {
      interactionStates.push('hover')
      break
    }
  }

  // Focus on search/input fields
  const focusCandidates = ['input[type="text"]', 'input[type="search"]', 'input[type="email"]', 'textarea']
  for (const sel of focusCandidates) {
    const focused = await focusAndCapture(page, sel, route, project, 'focus')
    if (focused) {
      interactionStates.push('focus')
      break
    }
  }

  // Try to open a modal/dialog if present
  const modalTriggers = ['[data-state]', '[aria-haspopup="dialog"]', '[data-dialog-trigger]']
  for (const sel of modalTriggers) {
    const trigger = page.locator(sel).first()
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click({ force: true })
      await page.waitForTimeout(600)
      const fp = screenshotPath(routeKey(route), `${project}__modal`)
      await page.screenshot({ path: fp, fullPage: false })
      interactionStates.push('modal-open')
      // Close dialog
      await page.keyboard.press('Escape').catch(() => {})
      await page.waitForTimeout(300)
      break
    }
  }

  return {
    route,
    project,
    url: page.url(),
    status: 200, // If page loaded, assume 200
    axeViolations: axeResult.count,
    axeViolationsByImpact: axeResult.byImpact,
    cls: clsValue,
    lcpElement: lcpEl,
    interactionStatesCaptured: interactionStates,
    loadTimeMs: loadTime,
  }
}

/**
 * Write cumulative audit results to a JSON file.
 */
export function writeAuditResults(results: RouteAuditResult[]): void {
  const outPath = dataPath('ux-audit.json')
  const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : []
  const merged = [...existing, ...results]
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2))
}

import { test as setup, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const AUTH_DIR = path.join(__dirname, '.auth')
const AUTH_FILE = path.join(AUTH_DIR, 'student.json')

setup('authenticate as student', async ({ page }) => {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  // Ensure the auth directory exists
  fs.mkdirSync(AUTH_DIR, { recursive: true })

  if (!email || !password) {
    console.warn(
      '⚠ TEST_EMAIL and/or TEST_PASSWORD not set — writing empty storage state. ' +
        'Authenticated route tests will skip or redirect to login.'
    )
    // Write an empty storage state so dependent projects can proceed
    await page.context().storageState({ path: AUTH_FILE })
    return
  }

  await page.goto('/login')

  await page.waitForSelector('input[type="email"]', { state: 'visible', timeout: 15_000 })

  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)

  await page.click('button[type="submit"]')

  await page.waitForURL('**/dashboard', { timeout: 20_000 }).catch(async () => {
    const errorToast = page.locator('[data-sonner-toast]')
    if (await errorToast.isVisible()) {
      const text = await errorToast.textContent()
      throw new Error(`Login failed — toast message: ${text}`)
    }
    throw new Error(`Login failed — did not redirect to /dashboard. Current URL: ${page.url()}`)
  })

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 5_000 })

  const cookies = await page.context().cookies()
  const sessionCookie = cookies.find(
    (c) =>
      c.name === 'better-auth.session_token' ||
      c.name === '__Secure-better-auth.session_token'
  )
  expect(sessionCookie).toBeDefined()

  await page.context().storageState({ path: AUTH_FILE })
  console.log('✓ Auth setup complete — session saved')
})

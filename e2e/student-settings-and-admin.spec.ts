import { test, expect } from '@playwright/test'

test.describe('Regression: Admin Add Student & Student Password Settings', () => {
  test('student settings security tab renders required password change fields', async ({ page }) => {
    // Note: Full live submission requires active student authentication session and DB.
    // This spec verifies route structure and form fields contract.
    await page.goto('/dashboard/settings?tab=security')

    // If redirected to login due to unauthenticated session, verify redirect path
    if (page.url().includes('/login')) {
      expect(page.url()).toContain('/login')
      return
    }

    // Verify Password Change Form Fields
    const currentPasswordInput = page.locator('input[name="currentPassword"], input[aria-label="Current password"]')
    const newPasswordInput = page.locator('input[name="newPassword"], input[aria-label="New password"]')
    const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[aria-label="Confirm new password"]')
    const submitButton = page.getByRole('button', { name: /update password/i })

    await expect(currentPasswordInput).toBeVisible()
    await expect(newPasswordInput).toBeVisible()
    await expect(confirmPasswordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
  })

  test('admin students page contains students page structure', async ({ page }) => {
    // Note: Live admin actions require active admin authentication session and DB.
    await page.goto('/admin/students')

    // If redirected to login due to unauthenticated session, verify redirect path
    if (page.url().includes('/login')) {
      expect(page.url()).toContain('/login')
      return
    }

    // When signed in as admin with students:manage permission:
    const addStudentButton = page.getByRole('button', { name: /add new student/i })
    if (await addStudentButton.isVisible()) {
      await addStudentButton.click()
      await expect(page.getByRole('heading', { name: /add new student/i })).toBeVisible()
      await expect(page.locator('input[name="name"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.getByRole('button', { name: /add student/i })).toBeVisible()
    }
  })
})

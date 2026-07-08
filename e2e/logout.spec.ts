import { test, expect } from '@playwright/test';
import { mockAuth } from './fixtures';

test('logging out redirects to /login and restores the guest header', async ({ page }) => {
  await mockAuth(page);

  // Landing on the app area restores the session (refresh is mocked), so we
  // start logged in without driving the login form.
  await page.goto('/');
  const header = page.getByRole('banner');
  await expect(header.getByRole('button', { name: /logout/i })).toBeVisible();

  await header.getByRole('button', { name: /logout/i }).click();

  // useLogout does a full window.location.replace to /login.
  await expect(page).toHaveURL('http://localhost:5173/login');
  await expect(header.getByRole('link', { name: 'Login' })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  await expect(header.getByRole('button', { name: /logout/i })).toHaveCount(0);
});

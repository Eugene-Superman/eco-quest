import { test, expect } from '@playwright/test';
import { mockAuth, testUser } from './fixtures';

test('a visitor can log in and lands logged in on the home page', async ({ page }) => {
  await mockAuth(page);

  await page.goto('/login');

  await page.getByLabel('Email').fill(testUser.email);
  await page.getByLabel('Password', { exact: true }).fill('password1');
  await page.getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL('http://localhost:5173/');

  const header = page.getByRole('banner');
  await expect(header.getByRole('button', { name: /logout/i })).toBeVisible();
  await expect(header.getByText(testUser.nickname)).toBeVisible();
  await expect(header.getByRole('link', { name: 'Login' })).toHaveCount(0);
});

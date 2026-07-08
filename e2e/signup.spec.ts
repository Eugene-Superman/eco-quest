import { test, expect } from '@playwright/test';
import { mockAuth, testUser } from './fixtures';

test('a visitor can sign up and lands logged in on the home page', async ({ page }) => {
  await mockAuth(page);

  await page.goto('/sign-up');

  await page.getByLabel('Email').fill(testUser.email);
  await page.getByLabel('Nickname').fill(testUser.nickname);
  await page.getByLabel('Password', { exact: true }).fill('password1');
  await page.getByLabel('Repeat Password').fill('password1');
  await page.getByRole('button', { name: /create account/i }).click();

  // Redirected into the app area...
  await expect(page).toHaveURL('http://localhost:5173/');

  // ...and the header now shows the user, not the guest auth actions.
  const header = page.getByRole('banner');
  await expect(header.getByRole('button', { name: /logout/i })).toBeVisible();
  await expect(header.getByText(testUser.nickname)).toBeVisible();
  await expect(header.getByRole('link', { name: 'Login' })).toHaveCount(0);
  await expect(header.getByRole('link', { name: 'Sign Up' })).toHaveCount(0);
});

import type { Page } from '@playwright/test';

export const testUser = {
  nickname: 'ada',
  email: 'ada@example.com',
  role: 'participant',
};

const accessData = { ...testUser, accessToken: 'e2e-token' };

// Intercepts every auth endpoint so the E2E flows run deterministically without
// a backend. `refresh` returns the user too, so landing in the app area (which
// restores the session on mount) keeps the user logged in.
export async function mockAuth(page: Page) {
  const ok = (json: unknown) => (route: import('@playwright/test').Route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) });

  await page.route('**/auth/signup', ok(accessData));
  await page.route('**/auth/signin', ok(accessData));
  await page.route('**/auth/refresh', ok(accessData));
  await page.route('**/auth/logout', ok({}));
}

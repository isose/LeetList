import { expect, test } from '@playwright/test';
import { ErrorPage } from 'tests/pages/Error/error-page';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/notfound');
});

test.describe('not found page', () => {
  test('should have header', async ({ page }) => {
    const errorPage = new ErrorPage(page);
    await expect(errorPage.header).toHaveText('404 Page Not Found');
  });

  test('should have message', async ({ page }) => {
    const errorPage = new ErrorPage(page);
    await expect(errorPage.message).toHaveText(
      'The page you are looking for does not exist or has been removed.',
    );
  });

  test('should have home button', async ({ page }) => {
    const errorPage = new ErrorPage(page);
    await expect(errorPage.button).toHaveText('Back to home');
    await errorPage.button.click();
    await expect(page.getByTestId('error')).toBeHidden();
  });
});

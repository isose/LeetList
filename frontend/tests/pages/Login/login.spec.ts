import { expect, test } from '@playwright/test';
import { Navbar } from 'tests/components/ui/navbar';
import { LoginPage } from 'tests/pages/Login/login-page';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

test.describe('login page', () => {
  test('should have header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should have username input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await expect(page.getByText('Username')).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('should have password input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await expect(page.getByText('Password')).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('should have register link', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('should be able to login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(LoginPage.UserCredentials.NO_LISTS);
    const navbar = new Navbar(page);
    await expect(navbar.usernameText).toHaveText(LoginPage.UserCredentials.NO_LISTS.username);
  });

  test('should be able to logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(LoginPage.UserCredentials.NO_LISTS);
    const navbar = new Navbar(page);
    await navbar.logout();
    await expect(navbar.loginLink).toBeVisible();
  });

  test('username not found prompt', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(
      new LoginPage.UserCredentials(
        'username_not_found',
        LoginPage.UserCredentials.NO_LISTS.password,
      ),
    );
    const usernameNotFoundPrompt = page.getByText('Username not found.');
    await expect(usernameNotFoundPrompt).toBeVisible();
    // modifying username input should clear prompt
    await loginPage.usernameInput.fill('');
    await expect(usernameNotFoundPrompt).toBeHidden();
  });

  test('password incorrect prompt', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(
      new LoginPage.UserCredentials(LoginPage.UserCredentials.NO_LISTS.username, 'wrong_password'),
    );
    const passwordIncorrectPrompt = page.getByText('Password incorrect.');
    await expect(passwordIncorrectPrompt).toBeVisible();
    // modifying password input should clear prompt
    await loginPage.passwordInput.fill('');
    await expect(passwordIncorrectPrompt).toBeHidden();
  });
});

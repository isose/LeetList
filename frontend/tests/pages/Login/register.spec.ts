import { expect, test } from '@playwright/test';
import { Navbar } from 'tests/components/ui/navbar';
import { Database } from 'tests/database';
import { LoginPage } from 'tests/pages/Login/login-page';
import { RegisterPage } from 'tests/pages/Login/register-page';

const NEW_USER_CREDENTIALS = {
  email: 'newuser@gmail.com',
  username: 'newuser',
  password: 'Password1!',
};

test.beforeAll(async () => {
  // clean up registered user
  const database = new Database();
  await database.deleteUser(NEW_USER_CREDENTIALS.username);
});

test.beforeEach(async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
});

test.describe('register page', () => {
  test('should have header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Registration' })).toBeVisible();
  });

  test('should have email input', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await expect(page.getByText('Email')).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
  });

  test('should have username input', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await expect(page.getByText('Username')).toBeVisible();
    await expect(registerPage.usernameInput).toBeVisible();
  });

  test('should have password input', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await expect(page.getByText('Password', { exact: true })).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
  });

  test('should have confirm password input', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await expect(page.getByText('Confirm password')).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
  });

  test('should have login link', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await expect(page.getByText('Have an account?')).toBeVisible();
    await expect(registerPage.loginLink).toBeVisible();
  });

  test('valid email prompt', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.emailInput.fill(' ');
    const emailPrompt = page.getByText('Enter a valid email.');
    await expect(emailPrompt).toBeVisible();
    // valid email should hide prompt
    await registerPage.emailInput.fill(NEW_USER_CREDENTIALS.email);
    await expect(emailPrompt).toBeHidden();
  });

  test('username requirements prompt', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.usernameInput.fill(' ');
    const usernamePrompt = page.getByText('Must contain');
    await expect(usernamePrompt).toHaveText(
      'Must contain 3 to 30 characters.' +
        'Must begin with a letter.' +
        'Only letters, numbers, and underscores allowed.',
    );
    // valid username should hide prompt
    await registerPage.usernameInput.fill(NEW_USER_CREDENTIALS.username);
    await expect(usernamePrompt).toBeHidden();
  });

  test('password requirements prompt', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.passwordInput.fill(' ');
    const passwordPrompt = page.getByText('Must contain');
    await expect(passwordPrompt).toHaveText(
      'Must contain 8 to 60 characters.' +
        'Must contain a number.' +
        'Must contain an upper case letter.' +
        'Must contain a special character.',
    );
    // valid password should hide prompt
    await registerPage.passwordInput.fill(NEW_USER_CREDENTIALS.password);
    await expect(passwordPrompt).toBeHidden();
  });

  test('passwords must match prompt', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.passwordInput.fill(NEW_USER_CREDENTIALS.password);
    await registerPage.confirmPasswordInput.fill(' ');
    const passwordPrompt = page.getByText('Passwords must match.');
    await expect(passwordPrompt).toBeVisible();
    // matching password should hide prompt
    await registerPage.confirmPasswordInput.fill(NEW_USER_CREDENTIALS.password);
    await expect(passwordPrompt).toBeHidden();
  });

  test('email already exists prompt', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.fillRegistrationForm(
      LoginPage.UserCredentials.NO_LISTS.email,
      NEW_USER_CREDENTIALS.username,
      NEW_USER_CREDENTIALS.password,
      NEW_USER_CREDENTIALS.password,
    );
    await registerPage.registerButton.click();
    await expect(page.getByText('Email already exists.')).toBeVisible();
  });

  test('username already taken prompt', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.fillRegistrationForm(
      NEW_USER_CREDENTIALS.email,
      LoginPage.UserCredentials.NO_LISTS.username,
      NEW_USER_CREDENTIALS.password,
      NEW_USER_CREDENTIALS.password,
    );
    await registerPage.registerButton.click();
    await expect(page.getByText('Username already taken.')).toBeVisible();
  });

  test('should be able to register new user', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.fillRegistrationForm(
      NEW_USER_CREDENTIALS.email,
      NEW_USER_CREDENTIALS.username,
      NEW_USER_CREDENTIALS.password,
      NEW_USER_CREDENTIALS.password,
    );
    await registerPage.registerButton.click();
    // new registered user should be able to login
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(
      new LoginPage.UserCredentials(NEW_USER_CREDENTIALS.username, NEW_USER_CREDENTIALS.password),
    );
    const navbar = new Navbar(page);
    await expect(navbar.usernameText).toHaveText(NEW_USER_CREDENTIALS.username);
  });
});

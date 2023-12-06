import { type Locator, type Page } from '@playwright/test';
import { LoginPage } from 'tests/pages/Login/login-page';

export class RegisterPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('email');
    this.usernameInput = page.getByPlaceholder('username');
    this.passwordInput = page.getByPlaceholder('password', { exact: true });
    this.confirmPasswordInput = page.getByPlaceholder('confirm password');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.loginLink = page.locator('span').getByText('Login');
  }

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.registerLink.click();
  }

  async fillRegistrationForm(
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
  ) {
    await this.emailInput.fill(email);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }
}

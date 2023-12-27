import { expect, type Locator, type Page } from '@playwright/test';
import { LoginPage } from 'tests/pages/Login/login-page';

export class Navbar {
  readonly page: Page;
  readonly navbar: Locator;
  readonly navPanelButton: Locator;
  readonly leetlistLink: Locator;
  readonly loginLink: Locator;
  readonly usernameText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.getByTestId('navbar');
    this.navPanelButton = this.navbar.getByTestId('navbar__nav-panel-icon');
    this.leetlistLink = this.navbar.getByRole('link', { name: 'LeetList' });
    this.loginLink = this.navbar.getByRole('link', { name: 'Login' });
    this.usernameText = this.navbar.getByTestId('username');
  }

  async login(userCredentials: LoginPage.UserCredentials) {
    await this.loginLink.click();
    const loginPage = new LoginPage(this.page);
    await loginPage.loginUser(userCredentials);
    await expect(this.usernameText).toHaveText(userCredentials.username);
  }

  async logout() {
    await this.usernameText.click();
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.loginLink).toBeVisible();
  }
}

import { type Locator, type Page } from '@playwright/test';

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
    this.leetlistLink = this.navbar.getByRole('link', { name: 'Leetlist' });
    this.loginLink = this.navbar.getByRole('link', { name: 'Login' });
    this.usernameText = this.navbar.getByTestId('username');
  }

  async logout() {
    await this.usernameText.click();
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }
}

import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('username');
    this.passwordInput = page.getByPlaceholder('password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.registerLink = page.getByText('Register');
  }

  async goto() {
    await this.page.goto('http://localhost:3000/login');
  }

  async loginUser(userCredentials: LoginPage.UserCredentials) {
    await this.usernameInput.fill(userCredentials.username);
    await this.passwordInput.fill(userCredentials.password);
    await this.loginButton.click();
  }
}

export namespace LoginPage {
  export class UserCredentials {
    static readonly NO_LISTS = new UserCredentials('nolists', 'Password1!', 'nolists@gmail.com');

    constructor(
      public readonly username: string,
      public readonly password: string,
      public readonly email: string = '',
    ) {}
  }
}

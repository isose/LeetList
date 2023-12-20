import { expect, type Locator, type Page } from '@playwright/test';

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
    this.loginButton = page.getByTestId('login-form').getByRole('button', { name: 'Login' });
    this.registerLink = page.getByText('Register');
  }

  async goto() {
    await this.page.goto('http://localhost:3000/login');
  }

  async loginUser(userCredentials: LoginPage.UserCredentials) {
    await this.usernameInput.fill(userCredentials.username);
    await this.passwordInput.fill(userCredentials.password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }
}

export namespace LoginPage {
  export class UserCredentials {
    static readonly NO_LISTS = new UserCredentials('no_lists', 'Password1!', 'nolists@gmail.com');
    static readonly PUBLIC_LIST = new UserCredentials(
      'public_list',
      'Password1!',
      'publiclist@gmail.com',
    );
    static readonly PRIVATE_LIST = new UserCredentials(
      'private_list',
      'Password1!',
      'privatelist@gmail.com',
    );
    static readonly LISTS_TEST = new UserCredentials(
      'lists_test',
      'Password1!',
      'liststest@gmail.com',
    );

    constructor(
      public readonly username: string,
      public readonly password: string,
      public readonly email: string = '',
    ) {}
  }
}

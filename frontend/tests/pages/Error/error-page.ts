import { type Locator, type Page } from '@playwright/test';

export class ErrorPage {
  readonly page: Page;
  readonly header: Locator;
  readonly message: Locator;
  readonly button: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('error').locator('h1');
    this.message = page.getByTestId('error').locator('p');
    this.button = page.getByTestId('error').getByRole('button');
  }
}

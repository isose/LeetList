import { type Locator, type Page } from '@playwright/test';

export class CreateListSidepanel {
  readonly page: Page;
  readonly newListButton: Locator;
  readonly closeButton: Locator;
  readonly clearButton: Locator;
  readonly listNameInput: Locator;
  readonly privateToggle: Locator;
  readonly loginButton: Locator;
  readonly createButton: Locator;
  readonly saveChangesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newListButton = page.getByTestId('sidepanel__icon');
    this.closeButton = page.getByTestId('close-button');
    this.clearButton = page.getByText('Clear');
    this.listNameInput = page.getByPlaceholder('list name');
    this.privateToggle = page.getByTestId('toggle-switch');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.saveChangesButton = page.getByRole('button', { name: 'Save changes' });
  }
}

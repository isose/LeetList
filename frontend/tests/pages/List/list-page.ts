import { type Locator, type Page } from '@playwright/test';

export class ListPage {
  readonly page: Page;
  readonly listName: Locator;
  readonly user: Locator;
  readonly date: Locator;
  readonly privateToggle: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly questionList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.listName = page.getByTestId('list__name');
    this.user = page.getByTestId('user');
    this.date = page.getByTestId('date');
    this.privateToggle = page.getByTestId('toggle-switch');
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.questionList = page.getByTestId('question-list');
  }

  async goto(listId: string) {
    await this.page.goto(`http://localhost:3000/list/${listId}`);
  }
}

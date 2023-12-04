import { type Locator, type Page } from '@playwright/test';

export class QuestionsPage {
  readonly page: Page;
  readonly searchBar: Locator;
  readonly tagsDropdownButton: Locator;
  readonly difficultyDropdownButton: Locator;
  readonly paginationDropdown: Locator;
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBar = page.getByPlaceholder('Search Questions');
    this.tagsDropdownButton = page.getByTestId('tags-dropdown__button');
    this.difficultyDropdownButton = page.getByRole('button', { name: 'Difficulty' });
    this.paginationDropdown = page.getByTestId('pagination-dropdown');
    this.nextPageButton = page.getByTestId('pagination-button').getByText('>');
    this.previousPageButton = page.getByTestId('pagination-button').getByText('<');
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
  }

  async selectTagsFilter(tags: string[]) {
    if (await this.page.getByTestId('tags-dropdown__container').isHidden()) {
      await this.tagsDropdownButton.click();
    }
    for (const tag of tags) {
      await this.page.getByTestId('tags-dropdown__container').getByText(tag).click();
    }
    await this.tagsDropdownButton.click();
  }

  async selectPaginationOption(option: QuestionsPage.PaginationOption) {
    if (await this.paginationDropdown.getByTestId('dropdown__list').isHidden()) {
      await this.paginationDropdown.click();
    }
    await this.page.getByTestId('dropdown__list').getByRole('button', { name: option }).click();
  }

  async clickPaginationButton(num: number) {
    await this.page
      .getByTestId('pagination-button')
      .getByText(num.toString(), { exact: true })
      .click();
  }
}

export namespace QuestionsPage {
  export enum PaginationOption {
    Twenty = '20 / page',
    Fifty = '50 / page',
    OneHundred = '100 / page',
    TwoHundred = '200 / page',
  }
}

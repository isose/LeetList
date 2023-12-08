import { type Locator, type Page } from '@playwright/test';

export class ListsPage {
  readonly page: Page;
  readonly allTab: Locator;
  readonly myListsTab: Locator;
  readonly searchBar: Locator;
  readonly sortingDropdown: Locator;
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allTab = page.getByTestId('lists__tabs').getByText('All');
    this.myListsTab = page.getByTestId('lists__tabs').getByText('My lists');
    this.searchBar = page.getByPlaceholder('Search Lists');
    this.sortingDropdown = page.getByTestId('dropdown').getByRole('button');
    this.nextPageButton = page.getByTestId('pagination-button').getByText('>');
    this.previousPageButton = page.getByTestId('pagination-button').getByText('<');
  }

  async gotoLists() {
    await this.page.goto('http://localhost:3000/lists');
  }

  async gotoMyLists() {
    await this.page.goto('http://localhost:3000/my-lists');
  }

  async selectSortingOption(option: ListsPage.SortingOption) {
    if (await this.sortingDropdown.getByTestId('dropdown__list').isHidden()) {
      await this.sortingDropdown.click();
    }
    await this.page.getByTestId('dropdown__list').getByRole('button', { name: option }).click();
  }
}

export namespace ListsPage {
  export enum SortingOption {
    New = 'New',
    Old = 'Old',
    NameAscending = 'Name (Ascending)',
    NameDescending = 'Name (Descending)',
  }
}

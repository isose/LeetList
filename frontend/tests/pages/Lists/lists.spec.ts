import { expect, test } from '@playwright/test';
import { Navbar } from 'tests/components/ui/navbar';
import { ListsPage } from 'tests/pages/Lists/lists-page';
import { LoginPage } from 'tests/pages/Login/login-page';

test.describe('lists page', () => {
  test.beforeEach(async ({ page }) => {
    const listsPage = new ListsPage(page);
    await listsPage.gotoLists();
  });

  test('should have tabs', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await expect(listsPage.allTab).toBeVisible();
    await expect(listsPage.myListsTab).toBeVisible();
  });

  test('should have search bar', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await expect(listsPage.searchBar).toBeVisible();
  });

  test('should have sorting dropdown', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await expect(listsPage.sortingDropdown).toBeVisible();
  });

  test('should have pagination buttons', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await expect(listsPage.nextPageButton).toBeVisible();
    await expect(listsPage.previousPageButton).toBeVisible();
  });

  test('list should have information', async ({ page }) => {
    const list = page.getByTestId('list').first();
    await expect(list.getByTestId('list__name')).toBeVisible();
    await expect(list.getByTestId('user')).toBeVisible();
    await expect(list.getByTestId('date')).toBeVisible();
  });

  test('should be able to search lists', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await listsPage.searchBar.fill('search_public');
    const list = page.getByTestId('list');
    await expect(list).toHaveCount(1);
    await expect(list.getByTestId('list__name')).toHaveText('search_public');
    await expect(list.getByTestId('user')).toHaveText('lists_test');
    await expect(list.getByTestId('date')).toHaveText('Dec 07, 2023');
  });

  test('should be able to sort lists', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await listsPage.selectSortingOption(ListsPage.SortingOption.New);
    await expect(page).toHaveURL(/.*sort=New.*/);
    await listsPage.selectSortingOption(ListsPage.SortingOption.Old);
    await expect(page).toHaveURL(/.*sort=Old.*/);
    await listsPage.selectSortingOption(ListsPage.SortingOption.NameAscending);
    await expect(page).toHaveURL(/.*sort=Name\+%28Ascending%29.*/);
    await listsPage.selectSortingOption(ListsPage.SortingOption.NameDescending);
    await expect(page).toHaveURL(/.*sort=Name\+%28Descending%29.*/);
  });
});

test.describe('my lists page', () => {
  test.beforeEach(async ({ page }) => {
    const listsPage = new ListsPage(page);
    await listsPage.gotoMyLists();
  });

  test('should have tabs', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await expect(listsPage.allTab).toBeVisible();
    await expect(listsPage.myListsTab).toBeVisible();
  });

  test('should have search bar', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await expect(listsPage.searchBar).toBeVisible();
  });

  test('should have sorting dropdown', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await expect(listsPage.sortingDropdown).toBeVisible();
  });

  test('should have pagination buttons', async ({ page }) => {
    const listsPage = new ListsPage(page);
    await expect(listsPage.nextPageButton).toBeVisible();
    await expect(listsPage.previousPageButton).toBeVisible();
  });

  test('list should have information', async ({ page }) => {
    const navbar = new Navbar(page);
    await navbar.login(LoginPage.UserCredentials.LISTS_TEST);
    const list = page.getByTestId('list').first();
    await expect(list.getByTestId('list__name')).toBeVisible();
    await expect(list.getByTestId('user')).toBeVisible();
    await expect(list.getByTestId('date')).toBeVisible();
  });

  test('should be able to search lists', async ({ page }) => {
    const navbar = new Navbar(page);
    await navbar.login(LoginPage.UserCredentials.LISTS_TEST);
    const listsPage = new ListsPage(page);
    await listsPage.searchBar.fill('search_private');
    const list = page.getByTestId('list');
    await expect(list).toHaveCount(1);
    await expect(list.getByTestId('list__name')).toHaveText('search_private');
    await expect(list.getByTestId('user')).toHaveText('lists_test');
    await expect(list.getByTestId('date')).toHaveText('Dec 07, 2023');
  });

  test('should be able to sort lists', async ({ page }) => {
    const navbar = new Navbar(page);
    await navbar.login(LoginPage.UserCredentials.LISTS_TEST);
    const listsPage = new ListsPage(page);
    await listsPage.selectSortingOption(ListsPage.SortingOption.New);
    await expect(page).toHaveURL(/.*sort=New.*/);
    await listsPage.selectSortingOption(ListsPage.SortingOption.Old);
    await expect(page).toHaveURL(/.*sort=Old.*/);
    await listsPage.selectSortingOption(ListsPage.SortingOption.NameAscending);
    await expect(page).toHaveURL(/.*sort=Name\+%28Ascending%29.*/);
    await listsPage.selectSortingOption(ListsPage.SortingOption.NameDescending);
    await expect(page).toHaveURL(/.*sort=Name\+%28Descending%29.*/);
  });

  test('should not display lists when logged out', async ({ page }) => {
    await expect(page.getByTestId('list')).toBeHidden();
  });
});

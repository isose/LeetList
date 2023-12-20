import { expect, test, type Page } from '@playwright/test';
import { Navbar } from 'tests/components/ui/navbar';
import { Database } from 'tests/database';
import { ErrorPage } from 'tests/pages/Error/error-page';
import { ListPage } from 'tests/pages/List/list-page';
import { ListsPage } from 'tests/pages/Lists/lists-page';
import { LoginPage } from 'tests/pages/Login/login-page';
import { CreateListSidepanel } from 'tests/pages/Questions/Component/CreateListSidepanel';

const OWN_PUBLIC_LIST_ID = '6';
const OWN_PRIVATE_LIST_ID = '7';
const OTHER_PUBLIC_LIST_ID = '3';
const OTHER_PRIVATE_LIST_ID = '4';

test.beforeEach(async ({ page }) => {
  const listPage = new ListsPage(page);
  await listPage.gotoLists();
});

test('list not found', async ({ page }) => {
  const listPage = new ListPage(page);
  await listPage.goto('not_found');
  const errorPage = new ErrorPage(page);
  await expect(errorPage.header).toHaveText('404 Page Not Found');
  await expect(errorPage.message).toHaveText(
    'The page you are looking for does not exist or has been removed.',
  );
  await expect(errorPage.button).toHaveText('Back to home');
});

test.describe('logged out', async () => {
  test("should be able to view others's public list", async ({ page }) => {
    await testViewOthersPublicList(page);
  });

  test("should not be able to view other's private list", async ({ page }) => {
    await testViewOthersPrivateList(page);
  });
});

test.describe('logged in', async () => {
  test.beforeEach(async ({ page }) => {
    const navbar = new Navbar(page);
    await navbar.login(LoginPage.UserCredentials.LISTS_TEST);
  });

  test('own list should have edit menu', async ({ page }) => {
    const listPage = new ListPage(page);
    await listPage.goto(OWN_PUBLIC_LIST_ID);
    await expect(listPage.privateToggle).toBeVisible();
    await expect(page.getByTestId('toggle-label')).toHaveText('private list');
    await expect(listPage.editButton).toHaveText('Edit');
    await expect(listPage.deleteButton).toHaveText('Delete');
  });

  test('should be able to view own public list', async ({ page }) => {
    const listPage = new ListPage(page);
    await listPage.goto(OWN_PUBLIC_LIST_ID);
    await expect(listPage.listName).toHaveText('search_public');
    await expect(listPage.user).toHaveText(LoginPage.UserCredentials.LISTS_TEST.username);
    await expect(listPage.date).toHaveText('Dec 07, 2023');
    await expect(listPage.privateToggle).not.toBeChecked();
    await expect(listPage.editButton).toBeVisible();
    await expect(listPage.deleteButton).toBeVisible();
    await expect(listPage.questionList.getByTestId('question')).toHaveCount(5);
  });

  test("should be able to view others's public list", async ({ page }) => {
    await testViewOthersPublicList(page);
  });

  test('should be able to view own private list', async ({ page }) => {
    const listPage = new ListPage(page);
    await listPage.goto(OWN_PRIVATE_LIST_ID);
    await expect(listPage.listName).toHaveText('search_private');
    await expect(listPage.user).toHaveText(LoginPage.UserCredentials.LISTS_TEST.username);
    await expect(listPage.date).toHaveText('Dec 07, 2023');
    await expect(listPage.privateToggle).toBeChecked();
    await expect(listPage.editButton).toBeVisible();
    await expect(listPage.deleteButton).toBeVisible();
    await expect(listPage.questionList.getByTestId('question')).toHaveCount(5);
  });

  test("should not be able to view other's private list", async ({ page }) => {
    await testViewOthersPrivateList(page);
  });

  test('should be able to toggle private to public', async ({ page }) => {
    // reset list state
    const database = new Database();
    await database.updateList('1f', {
      username: LoginPage.UserCredentials.LISTS_TEST.username,
      listName: 'private_to_public',
      private: true,
      questions: [{ questionId: '1' }, { questionId: '2' }, { questionId: '3' }],
    });

    const listPage = new ListPage(page);
    await listPage.goto('1f');
    await listPage.privateToggle.click();
    await expect(listPage.privateToggle).not.toBeChecked();

    const listsPage = new ListsPage(page);
    await listsPage.gotoLists();
    await listsPage.searchBar.fill('private_to_public');
    await expect(page.getByTestId('list')).toHaveCount(1);
  });

  test('should be able to toggle public to private', async ({ page }) => {
    // reset list state
    const database = new Database();
    await database.updateList('1g', {
      username: LoginPage.UserCredentials.LISTS_TEST.username,
      listName: 'public_to_private',
      private: false,
      questions: [{ questionId: '1' }, { questionId: '2' }, { questionId: '3' }],
    });

    const listPage = new ListPage(page);
    await listPage.goto('1g');
    await listPage.privateToggle.click();
    await expect(listPage.privateToggle).toBeChecked();

    const listsPage = new ListsPage(page);
    await listsPage.gotoLists();
    await listsPage.searchBar.fill('public_to_private');
    await expect(page.getByTestId('list')).toHaveCount(0);
  });

  test('should be able to edit list name', async ({ page }) => {
    // reset list state
    const database = new Database();
    await database.updateList('1k', {
      username: LoginPage.UserCredentials.LISTS_TEST.username,
      listName: 'edit_list_name',
      private: false,
      questions: [{ questionId: '1' }, { questionId: '2' }, { questionId: '3' }],
    });

    const listPage = new ListPage(page);
    await listPage.goto('1k');
    await listPage.editButton.click();
    const createListSidepanel = new CreateListSidepanel(page);
    await createListSidepanel.listNameInput.fill('editted_list_name');
    await createListSidepanel.saveChangesButton.click();
    await expect(listPage.listName).toHaveText('editted_list_name');
  });

  test('should be able to edit list privacy', async ({ page }) => {
    // reset list state
    const database = new Database();
    await database.updateList('1l', {
      username: LoginPage.UserCredentials.LISTS_TEST.username,
      listName: 'edit_list_privacy',
      private: false,
      questions: [{ questionId: '1' }, { questionId: '2' }, { questionId: '3' }],
    });

    const listPage = new ListPage(page);
    await listPage.goto('1l');
    await listPage.editButton.click();
    const createListSidepanel = new CreateListSidepanel(page);
    await createListSidepanel.privateToggle.click();
    await createListSidepanel.saveChangesButton.click();
    await expect(listPage.privateToggle).toBeChecked();
  });

  test('should be able to edit list questions', async ({ page }) => {
    // reset list state
    const database = new Database();
    await database.updateList('1m', {
      username: LoginPage.UserCredentials.LISTS_TEST.username,
      listName: 'edit_list_questions',
      private: false,
      questions: [{ questionId: '1' }, { questionId: '2' }, { questionId: '3' }],
    });

    const listPage = new ListPage(page);
    await listPage.goto('1m');
    await listPage.editButton.click();
    const createListSidepanel = new CreateListSidepanel(page);
    const createListPanel = page.getByTestId('create-list-panel');
    await createListPanel
      .getByTestId('question-list__item')
      .getByTestId('remove-button')
      .first()
      .click();
    await page.getByTestId('question').nth(3).click();
    await createListSidepanel.saveChangesButton.click();
    await expect(listPage.questionList.getByTestId('question')).toHaveCount(3);
    await expect(
      listPage.questionList.getByRole('link', { name: 'Add Two Numbers' }),
    ).toBeVisible();
    await expect(
      listPage.questionList.getByRole('link', {
        name: 'Longest Substring Without Repeating Characters',
      }),
    ).toBeVisible();
    await expect(
      listPage.questionList.getByRole('link', { name: 'Median of Two Sorted Arrays' }),
    ).toBeVisible();
  });

  test('should be able to delete own list', async ({ page }) => {
    // create list to delete
    const database = new Database();
    await database.createList({
      username: LoginPage.UserCredentials.LISTS_TEST.username,
      listName: 'delete_list',
      private: false,
      questions: [{ questionId: '1' }, { questionId: '2' }, { questionId: '3' }],
    });

    const listsPage = new ListsPage(page);
    await listsPage.searchBar.fill('delete_list');
    await page.getByRole('link', { name: 'delete_list' }).click();

    const listPage = new ListPage(page);
    await listPage.deleteButton.click();
    // delete list modal should have title, message, close, delete, and cancel buttons
    const deleteListModal = page.getByTestId('modal__container');
    await expect(deleteListModal.getByRole('heading', { name: 'Delete list?' })).toBeVisible();
    await expect(
      deleteListModal.getByText(
        'This list will be permanently deleted. This action cannot be undone.',
      ),
    ).toBeVisible();
    await expect(deleteListModal.getByTestId('close-button')).toBeVisible();
    const deleteButton = deleteListModal.getByRole('button', { name: 'Delete' });
    await expect(deleteButton).toBeVisible();
    await expect(deleteListModal.getByRole('button', { name: 'Cancel' })).toBeVisible();
    // delete list
    await deleteButton.click();
    await listsPage.searchBar.fill('delete_list');
    await expect(page.getByTestId('list')).toHaveCount(0);
  });
});

async function testViewOthersPublicList(page: Page) {
  const listPage = new ListPage(page);
  await listPage.goto(OTHER_PUBLIC_LIST_ID);
  await expect(listPage.listName).toHaveText('public list');
  await expect(listPage.user).toHaveText(LoginPage.UserCredentials.PUBLIC_LIST.username);
  await expect(listPage.date).toHaveText('Dec 07, 2023');
  await expect(listPage.privateToggle).toBeHidden();
  await expect(listPage.editButton).toBeHidden();
  await expect(listPage.deleteButton).toBeHidden();
  await expect(listPage.questionList.getByTestId('question')).toHaveCount(5);
}

async function testViewOthersPrivateList(page: Page) {
  const listPage = new ListPage(page);
  await listPage.goto(OTHER_PRIVATE_LIST_ID);
  const errorPage = new ErrorPage(page);
  await expect(errorPage.header).toHaveText('403 Forbidden');
  await expect(errorPage.message).toHaveText('You do not have access to view this private list.');
  await expect(errorPage.button).toHaveText('Back to lists');
  await errorPage.button.click();
  await expect(page).toHaveURL(/.*\/lists.*/);
}

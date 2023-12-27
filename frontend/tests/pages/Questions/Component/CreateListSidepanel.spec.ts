import { expect, test } from '@playwright/test';
import { Navbar } from 'tests/components/ui/navbar';
import { ListPage } from 'tests/pages/List/list-page';
import { LoginPage } from 'tests/pages/Login/login-page';
import { CreateListSidepanel } from 'tests/pages/Questions/Component/CreateListSidepanel';
import { QuestionsPage } from 'tests/pages/Questions/questions-page';

test.beforeEach(async ({ page }) => {
  const questionsPage = new QuestionsPage(page);
  await questionsPage.goto();
});

test.describe('logged out', async () => {
  test('create list sidepanel component', async ({ page }) => {
    const createListSidepanel = new CreateListSidepanel(page);
    await expect(createListSidepanel.newListButton).toBeVisible();
    await createListSidepanel.newListButton.click();
    await expect(createListSidepanel.closeButton).toBeVisible();
    const createListPanel = page.getByTestId('create-list-panel');
    await expect(createListPanel.getByRole('heading', { name: 'New LeetList' })).toBeVisible();
    await expect(createListPanel.getByText('Your list is currently empty')).toBeVisible();
    await expect(
      createListPanel.getByText('Select some questions to add to your list'),
    ).toBeVisible();
    await expect(createListPanel.getByText('Login to create a list.')).toBeVisible();
    await expect(createListSidepanel.loginButton).toBeVisible();
  });

  test('should be able to select questions', async ({ page }) => {
    await page.getByTestId('question').nth(0).click();
    const createListPanel = page.getByTestId('create-list-panel');
    await expect(createListPanel.getByTestId('create-list-panel__header-counter')).toHaveText('1');
    const question = createListPanel.getByTestId('question-list__item').first();
    await expect(question.getByRole('link', { name: 'Two Sum' })).toBeVisible();
    await expect(question.getByText('Array, Hash Table')).toBeVisible();
  });

  test('should be able to remove questions', async ({ page }) => {
    await page.getByTestId('question').nth(0).click();
    const createListPanel = page.getByTestId('create-list-panel');
    const questions = createListPanel.getByTestId('question-list__item');
    await expect(questions).toHaveCount(1);
    await questions.getByTestId('remove-button').click();
    await expect(questions).toHaveCount(0);
  });

  test('should be able to clear questions', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('question').nth(i).click();
    }
    const createListSidepanel = new CreateListSidepanel(page);
    const createListPanel = page.getByTestId('create-list-panel');
    const questions = createListPanel.getByTestId('question-list__item');
    await expect(questions).toHaveCount(3);
    await createListSidepanel.clearButton.click();
    await expect(questions).toHaveCount(0);
  });

  test('closing panel should discard selected questions', async ({ page }) => {
    await page.getByTestId('question').nth(0).click();
    const createListSidepanel = new CreateListSidepanel(page);
    const createListPanel = page.getByTestId('create-list-panel');
    const questions = createListPanel.getByTestId('question-list__item');
    await expect(questions).toHaveCount(1);
    await createListSidepanel.closeButton.click();
    await expect(page.getByRole('heading', { name: 'Unsaved changes' })).toBeVisible();
    await expect(
      page.getByText('Any unsaved changes will be lost. Do you wish to discard unsaved changes?'),
    ).toBeVisible();
    const discardButton = page.getByRole('button', { name: 'Discard' });
    await expect(discardButton).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await discardButton.click();
    await expect(createListPanel).not.toBeVisible();
    await createListSidepanel.newListButton.click();
    await expect(questions).toHaveCount(0);
  });

  test('should be able to login from create list panel', async ({ page }) => {
    await page.getByTestId('question').nth(0).click();
    const createListSidepanel = new CreateListSidepanel(page);
    const createListPanel = page.getByTestId('create-list-panel');
    const questions = createListPanel.getByTestId('question-list__item');
    await createListSidepanel.loginButton.click();
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(LoginPage.UserCredentials.LISTS_TEST);
    // logging in should not discard questions
    await expect(questions).toHaveCount(1);
  });
});

test.describe('logged in', async () => {
  test.beforeEach(async ({ page }) => {
    const navbar = new Navbar(page);
    await navbar.login(LoginPage.UserCredentials.LISTS_TEST);
  });

  test('create list sidepanel component', async ({ page }) => {
    const createListSidepanel = new CreateListSidepanel(page);
    await expect(createListSidepanel.newListButton).toBeVisible();
    await createListSidepanel.newListButton.click();
    await expect(createListSidepanel.closeButton).toBeVisible();
    const createListPanel = page.getByTestId('create-list-panel');
    await expect(createListPanel.getByRole('heading', { name: 'New LeetList' })).toBeVisible();
    await expect(createListPanel.getByText('Your list is currently empty')).toBeVisible();
    await expect(
      createListPanel.getByText('Select some questions to add to your list'),
    ).toBeVisible();
    await expect(createListPanel.getByText('List name')).toBeVisible();
    await expect(createListSidepanel.listNameInput).toBeVisible();
    await expect(createListPanel.getByTestId('toggle-label')).toHaveText('private list');
    await expect(createListSidepanel.privateToggle).toBeVisible();
    await expect(createListSidepanel.createButton).toBeVisible();
  });

  test('edit list component', async ({ page }) => {
    const listPage = new ListPage(page);
    await listPage.goto('1h');
    await listPage.editButton.click();
    const createListSidepanel = new CreateListSidepanel(page);
    await expect(createListSidepanel.closeButton).toBeVisible();
    const createListPanel = page.getByTestId('create-list-panel');
    await expect(createListPanel.getByRole('heading', { name: 'Edit LeetList' })).toBeVisible();
    await expect(createListPanel.getByTestId('create-list-panel__header-counter')).toHaveText('4');
    await expect(createListSidepanel.clearButton).toBeVisible();
    await expect(createListPanel.getByTestId('question-list__item')).toHaveCount(4);
    await expect(createListPanel.getByText('easy: 1')).toBeVisible();
    await expect(createListPanel.getByText('medium: 2')).toBeVisible();
    await expect(createListPanel.getByText('hard: 1')).toBeVisible();
    await expect(createListPanel.getByText('List name')).toBeVisible();
    await expect(createListSidepanel.listNameInput).toHaveValue('edit_list');
    await expect(createListPanel.getByTestId('toggle-label')).toHaveText('private list');
    await expect(createListSidepanel.privateToggle).toBeChecked();
    await expect(createListSidepanel.saveChangesButton).toBeVisible();
  });
});

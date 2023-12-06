import { expect, test } from '@playwright/test';
import { QuestionsPage } from 'tests/pages/Questions/questions-page';

const TAGS = ['Divide and Conquer', 'Hash Table', 'Sorting'];

test.beforeEach(async ({ page }) => {
  const questionsPage = new QuestionsPage(page);
  await questionsPage.goto();
});

test.describe('questions page', () => {
  test('should have navbar', async ({ page }) => {
    await expect(page.getByTestId('navbar')).toBeVisible();
  });

  test('should have header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Questions' })).toBeVisible();
  });

  test('should have create list sidepanel', async ({ page }) => {
    await expect(page.getByTestId('create-list-sidepanel')).toBeVisible();
  });

  test.describe('search bar', () => {
    test('should be able to search for questions by title', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await expect(questionsPage.searchBar).toBeVisible();
      // search for question title
      await questionsPage.searchBar.fill('island');
      await expect(page.getByRole('link', { name: 'Number of Islands' })).toBeVisible();
    });
  });

  test.describe('tags dropdown', () => {
    test('open and close tags dropdown', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await expect(questionsPage.tagsDropdownButton).toBeVisible();
      await expect(questionsPage.tagsDropdownButton).toHaveText('Tags');
      // open tags dropdown
      await questionsPage.tagsDropdownButton.click();
      await expect(page.getByTestId('tags-dropdown__container')).toBeVisible();
      // close tags dropdown
      await questionsPage.tagsDropdownButton.click();
      await expect(page.getByTestId('tags-dropdown__container')).toBeHidden();
    });

    test('filter questions by tags', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await questionsPage.selectTagsFilter(TAGS);
      await expect(page.getByRole('link', { name: 'Majority Element' })).toBeVisible();
    });

    test('reset tags button should unfilter questions', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await questionsPage.selectTagsFilter(TAGS);
      const filteredQuestion = page.getByRole('link', { name: 'Majority Element' });
      await questionsPage.tagsDropdownButton.click();
      const resetTagsButton = page.getByRole('button', { name: 'Reset Tags' });
      await expect(resetTagsButton).toBeVisible();
      await resetTagsButton.click();
      await expect(filteredQuestion).toBeHidden();
    });

    test('should be able to search for tags', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await questionsPage.tagsDropdownButton.click();
      const tagsSearchBar = page.getByPlaceholder('Filter tags');
      await expect(tagsSearchBar).toBeVisible();
      // search for tag
      await tagsSearchBar.fill('binary search tree');
      const tagsDropdownContainer = page.getByTestId('tags-dropdown__container');
      await expect(tagsDropdownContainer.getByTestId('tag-list')).toHaveCount(1);
      await expect(tagsDropdownContainer.getByText('Binary Search Tree')).toBeVisible();
    });
  });

  test.describe('difficulty dropdown', () => {
    test('should be able to filter questions by difficulty', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await expect(questionsPage.difficultyDropdownButton).toBeVisible();

      // open diffculty dropdown
      await questionsPage.difficultyDropdownButton.click();
      const easyButton = page.getByRole('button', { name: 'Easy' });
      const mediumButton = page.getByRole('button', { name: 'Medium' });
      const hardButton = page.getByRole('button', { name: 'Hard' });
      await expect(easyButton).toBeVisible();
      await expect(mediumButton).toBeVisible();
      await expect(hardButton).toBeVisible();

      await expect(page.getByTestId('question__difficulty--easy').first()).toBeVisible();
      // filter by medium and hard
      await mediumButton.click();
      await hardButton.click();
      await expect(page.getByTestId('question__difficulty--easy')).toBeHidden();
      await expect(page.getByTestId('question__difficulty--medium').first()).toBeVisible();
      await expect(page.getByTestId('question__difficulty--hard').first()).toBeVisible();

      // unselect medium
      await mediumButton.click();
      await expect(page.getByTestId('question__difficulty--medium')).toBeHidden();
    });
  });

  test.describe('question list', () => {
    test('question contains information', async ({ page }) => {
      const question = page.getByTestId('question').first();
      // question should have title
      await expect(question).toBeVisible();
      await expect(question.getByTestId('question__title')).toHaveText('1. Two Sum');
      // question should have tag list
      const tagList = question.getByTestId('tag-list');
      await expect(tagList).toBeVisible();
      await expect(tagList.getByText('Array')).toBeVisible();
      await expect(tagList.getByText('Hash Table')).toBeVisible();
      // question should have difficulty
      await expect(question.getByText('Easy')).toBeVisible();
      // question should have votes
      await expect(question.getByTestId('question__votes')).toBeVisible();
      // question should have submissions
      await expect(question.getByTestId('question__submissions')).toBeVisible();
    });

    test('question title should truncate', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Two Sum' })).toHaveClass('truncate');
    });

    test('question tags should collapse and expand', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await page.setViewportSize({ width: 800, height: 720 });
      await questionsPage.searchBar.fill('flatten');
      await expect(
        page.getByRole('link', { name: 'Flatten Binary Tree to Linked List' }),
      ).toBeVisible();
      // truncated tags should be hidden
      const tagList = page.getByTestId('tag-list');
      await expect(tagList).toHaveCSS('height', '20px');
      // expanding tag list should show hidden tags
      const tagListExpand = page.getByText('more');
      await expect(tagListExpand).toBeVisible();
      await tagListExpand.click();
      await expect(tagListExpand).toBeHidden();
      await expect(tagList).not.toHaveCSS('height', '20px');
    });
  });

  test.describe('pagination', () => {
    test('should be able to set number of questions per page', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await expect(questionsPage.paginationDropdown).toBeVisible();
      await expect(
        questionsPage.paginationDropdown.getByRole('button', { name: '50 / page' }),
      ).toBeVisible();
      // open pagination dropdown
      await questionsPage.paginationDropdown.click();
      const dropdownList = questionsPage.paginationDropdown.getByTestId('dropdown__list');
      await expect(dropdownList).toBeVisible();
      await expect(dropdownList.getByRole('button', { name: '20 / page' })).toBeVisible();
      await expect(dropdownList.getByRole('button', { name: '50 / page' })).toBeVisible();
      await expect(dropdownList.getByRole('button', { name: '100 / page' })).toBeVisible();
      await expect(dropdownList.getByRole('button', { name: '200 / page' })).toBeVisible();
      // select 20 / page
      await questionsPage.selectPaginationOption(QuestionsPage.PaginationOption.Twenty);
      await expect(dropdownList).toBeHidden();
      await expect(
        questionsPage.paginationDropdown.getByRole('button', { name: '20 / page' }),
      ).toBeVisible();
      await expect(page.getByTestId('question')).toHaveCount(20);
      // select 200 / page
      await questionsPage.selectPaginationOption(QuestionsPage.PaginationOption.TwoHundred);
      await expect(page.getByTestId('question')).toHaveCount(200);
    });

    test('should have correct number of pagination buttons', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await expect(page.getByTestId('pagination-button')).toHaveCount(7);
      await questionsPage.selectPaginationOption(QuestionsPage.PaginationOption.Twenty);
      await expect(page.getByTestId('pagination-button')).toHaveCount(10);
      await expect(page.getByTestId('pagination-button').getByText('...')).toBeVisible();
      await questionsPage.selectPaginationOption(QuestionsPage.PaginationOption.TwoHundred);
      await expect(page.getByTestId('pagination-button')).toHaveCount(4);
    });

    test('next page button', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await expect(questionsPage.nextPageButton).toBeVisible();
      await questionsPage.clickPaginationButton(3);
      await expect(page).toHaveURL(/.*\?page=3/);
      await questionsPage.nextPageButton.click();
      await expect(page).toHaveURL(/.*\?page=4/);
      await questionsPage.nextPageButton.click();
      await expect(page).toHaveURL(/.*\?page=5/);
      await questionsPage.nextPageButton.click();
      await expect(page).toHaveURL(/.*\?page=5/);
    });

    test('previous page button', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await expect(questionsPage.previousPageButton).toBeVisible();
      await questionsPage.clickPaginationButton(3);
      await expect(page).toHaveURL(/.*\?page=3/);
      await questionsPage.previousPageButton.click();
      await expect(page).toHaveURL(/.*\?page=2/);
      await questionsPage.previousPageButton.click();
      await expect(page).toHaveURL(/.*\?page=1/);
      await questionsPage.previousPageButton.click();
      await expect(page).toHaveURL(/.*\?page=1/);
    });

    test('should be able to navigate with page buttons', async ({ page }) => {
      const questionsPage = new QuestionsPage(page);
      await questionsPage.selectPaginationOption(QuestionsPage.PaginationOption.Twenty);
      await questionsPage.clickPaginationButton(6);
      await expect(page).toHaveURL(/.*\?page=6/);
      await questionsPage.clickPaginationButton(13);
      await expect(page).toHaveURL(/.*\?page=13/);
      await questionsPage.clickPaginationButton(1);
      await expect(page).toHaveURL(/.*\?page=1/);
    });
  });
});

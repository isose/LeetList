import puppeteer from 'puppeteer';

const bluebird = require('bluebird');
const { question, questionTagMap, questionUrl, tag } = require('./models');

const withPage = (browser: { newPage: () => any }) => async (fn: any) => {
  const page = await browser.newPage();
  try {
    return await fn(page);
  } finally {
    await page.close();
  }
};

// wait for question table to load
async function waitForTable(page: any) {
  await page.waitForFunction(
    () => !document.getElementsByClassName('-mx-4 md:mx-0 pointer-events-none').length,
  );
}

// set the number of items in the table returned per page to the max
async function setPaginationMax(page: any) {
  await page.click('.mt-4.flex > div > button');
  await page.click('.mt-4.flex > div > ul > :last-child');
  await waitForTable(page);
}

// get questions hrefs from table
async function getQuestionUrls(page: any) {
  return await page.evaluate(() => {
    const results = [];
    for (const div of document.getElementsByClassName('truncate overflow-hidden')) {
      if (div.parentNode?.children.length == 1) {
        // check if question is non premium, skip premium questions
        const element = div.getElementsByTagName('a').item(0);
        if (element !== null) {
          results.push(element.href);
        }
      }
    }
    return results;
  });
}

// clicks next page button and returns true if available, otherwise returns false
async function clickNextPageButton(page: any) {
  const nextPageButtonDisabled = (await page.$('.mb-6 > :last-child[disabled]')) !== null;
  if (nextPageButtonDisabled) {
    return false;
  }
  await page.click('.mb-6 > :last-child');
  await waitForTable(page);
  return true;
}

async function getTitle(page: any) {
  const element = await page.$('[data-cy="question-title"]');
  const title = (await element.evaluate((el: any) => el.textContent)).split('. ');
  return title;
}

async function getDifficulty(page: any) {
  const element = await page.$('[diff]');
  const difficulty = await element.evaluate((el: any) => el.textContent);
  return difficulty;
}

async function getVotes(page: any) {
  return await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('.css-10o4wqw > button > span');
    for (let i = 0; i < 2; i++) {
      results.push(elements[i].textContent);
    }
    return results;
  });
}

async function getSubmissionInfo(page: any) {
  return await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('.css-q9155n > div > div');
    if (elements[1].textContent !== null && elements[3].textContent !== null) {
      results.push(elements[1].textContent.replace(/,/g, ''));
      results.push(elements[3].textContent.replace(/,/g, ''));
    }
    return results;
  });
}

async function getTags(page: any) {
  return await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('.tag__24Rd');
    for (const el of elements) {
      results.push(el.textContent);
    }
    return results;
  });
}

async function scrapeTags() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://leetcode.com/problemset/all');

  await waitForTable(page);
  // click expand tags button
  await page.click('.relative.flex.mb-1 > :last-child');

  // get text for each tag
  const tags = await page.$eval('.relative.flex.mb-1 > div', (div) => {
    const results = [];
    for (const child of div.getElementsByClassName('whitespace-nowrap')) {
      results.push(child.textContent);
    }
    return results;
  });

  // add tags to database
  for (const text of tags) {
    const doesTagExist = await tag.findOne({ where: { tag: text } });
    if (!doesTagExist) {
      await tag.create({ tag: text });
    }
  }

  await browser.close();
}

async function scrapeQuestionUrls() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://leetcode.com/problemset/all/');

  await waitForTable(page);
  await setPaginationMax(page);

  let urls: any[] = [];
  urls = urls.concat(await getQuestionUrls(page));

  // continue scraping question urls from next page
  while (await clickNextPageButton(page)) {
    urls = urls.concat(await getQuestionUrls(page));
  }

  // add urls to database
  for (const url of urls) {
    const doesUrlExist = await questionUrl.findOne({ where: { url: url } });
    if (!doesUrlExist) {
      await questionUrl.create({ url: url });
    }
  }
  await browser.close();
}

async function scrapeQuestionData() {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  // get urls from questionUrl
  const urls = (await questionUrl.findAll()).map((url: any) => url.url);
  await bluebird.map(
    urls,
    async (url: string) => {
      await withPage(browser)(async (page: any) => {
        try {
          await page.goto(url);
          await page.waitForSelector('[data-cy="question-title"]');
        } catch (error: any) {
          console.log('Hit rate limit, wait 5 minutes before retrying');
          await new Promise((resolve) => setTimeout(resolve, 300000));
          await page.goto(url);
          await page.waitForSelector('[data-cy="question-title"]');
        }

        const title = await getTitle(page);
        const difficulty = await getDifficulty(page);
        const votes = await getVotes(page);
        const submissionInfo = await getSubmissionInfo(page);
        const tags = await getTags(page);

        const questionJson = {
          url: url,
          questionId: title[0],
          title: title[1],
          difficulty: difficulty,
          upVotes: votes[0],
          downVotes: votes[1],
          numberOfAccepted: submissionInfo[0],
          numberOfSubmissions: submissionInfo[1],
        };

        // add question to database
        const doesQuestionExist = await question.findOne({
          where: { questionId: questionJson.questionId },
        });
        if (!doesQuestionExist) {
          await question.create(questionJson);
        } else {
          await question.update(questionJson, { where: { questionId: questionJson.questionId } });
        }

        // add to question tag map
        for (const tag of tags) {
          const questionTag = {
            questionId: questionJson.questionId,
            tagId: tag,
          };
          const doesQuestionTagExist = await questionTagMap.findOne({ where: questionTag });
          if (!doesQuestionTagExist) {
            await questionTagMap.create(questionTag);
          }
        }

        // delete url from questionUrl
        await questionUrl.destroy({ where: { url: url } });
      });
    },
    { concurrency: 4 },
  );

  await browser.close();
}

async function main() {
  if (process.argv.length == 2) {
    await scrapeTags();
    await scrapeQuestionUrls();
    await scrapeQuestionData();
  } else {
    for (const arg of process.argv) {
      if (arg == 'tags') {
        await scrapeTags();
      } else if (arg == 'urls') {
        await scrapeQuestionUrls();
      } else if (arg == 'questions') {
        await scrapeQuestionData();
      }
    }
  }
}

main();

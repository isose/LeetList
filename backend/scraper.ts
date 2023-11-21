import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import knex from './database/knex';
import Question from './database/models/question';
import QuestionSlug from './database/models/questionSlug';
import QuestionTagMap from './database/models/questionTagMap';
import Tag from './database/models/tag';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
const prompt = require('prompt-sync')();

const URL = 'https://leetcode.com/graphql';
const QUESTION_URL = 'https://leetcode.com/problems/';
const QUESTION_DATA_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionFrontendId
      difficulty
      likes
      dislikes
      stats
    }
  }
`;
const QUESTIONS_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      questions: data {
        acRate
        difficulty
        frontendQuestionId: questionFrontendId
        paidOnly: isPaidOnly
        title
        titleSlug
        topicTags {
          name
        }
      }
    }
  }
`;
const API_CALLS_PER_MINUTE = 100;

function printProgress(progress: string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
}

async function getQuestionData(slug: string) {
  const res = await client.post(URL, {
    query: QUESTION_DATA_QUERY,
    variables: {
      titleSlug: slug,
    },
  });

  const questionObj = res.data.data.question;
  const stats = JSON.parse(questionObj.stats);

  const upVotes = questionObj.likes;
  const downVotes = questionObj.dislikes;
  const numberOfAccepted = stats.totalAcceptedRaw;
  const numberOfSubmissions = stats.totalSubmissionRaw;

  // update question data in database
  await Question.query()
    .patch({
      upVotes: upVotes,
      downVotes: downVotes,
      numberOfAccepted: numberOfAccepted,
      numberOfSubmissions: numberOfSubmissions,
    })
    .where('questionId', questionObj.questionFrontendId);
}

async function getAllQuestionData() {
  // get slugs from question_slugs
  const slugs = (await QuestionSlug.query()).map((slug: any) => slug.slug).reverse();
  let startTime = performance.now();
  let calls = 0;
  for (let i = 1; i <= slugs.length; i++) {
    await getQuestionData(slugs[i]);
    // delete slug from question_slugs
    await QuestionSlug.query().delete().where('slug', slugs[i]);
    printProgress(`${i} / ${slugs.length} questions scraped`);
    // limit number of api calls per minute
    if (++calls == API_CALLS_PER_MINUTE) {
      const endTime = performance.now();
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, 60000 - (endTime - startTime))),
      );
      startTime = performance.now();
      calls = 0;
    }
  }
}

async function getQuestions() {
  const res = await client.post(URL, {
    query: QUESTIONS_QUERY,
    variables: {
      categorySlug: '',
      skip: 0,
      limit: 10000,
      filters: {},
    },
  });

  const questionSlugArray = [];
  const questionArray = [];
  const questionTagMapArray = [];
  const tagSet = new Set();

  const data = res.data;
  for (const questionObj of data.data.problemsetQuestionList.questions) {
    // skip premium questions
    if (questionObj.paidOnly) {
      continue;
    }

    // add slug to slug array
    questionSlugArray.push({ slug: questionObj.titleSlug });

    // add question to question array
    const questionJson = {
      url: QUESTION_URL + questionObj.titleSlug,
      questionId: questionObj.frontendQuestionId,
      title: questionObj.title,
      difficulty: questionObj.difficulty,
    };
    questionArray.push(questionJson);

    for (const tagObj of questionObj.topicTags) {
      // add tags to tag set
      tagSet.add(tagObj.name);

      // add question tags to question tag map array
      const questionTag = {
        questionId: questionObj.frontendQuestionId,
        tagName: tagObj.name,
      };
      questionTagMapArray.push(questionTag);
    }
  }

  // batch insert question slugs to database
  await QuestionSlug.query().insert(questionSlugArray).onConflict('slug').ignore();

  // batch insert questions to database
  await Question.query().insert(questionArray).onConflict('questionId').ignore();

  // batch insert tags to database
  await Tag.query()
    .insert([...tagSet].map((tag) => ({ tagName: tag })))
    .onConflict('tagName')
    .ignore();

  // batch insert question tag maps to database
  await QuestionTagMap.query()
    .insert(questionTagMapArray)
    .onConflict(['questionId', 'tagName'])
    .ignore();
}

async function main() {
  console.log(
    'Select which option to scrape:\n "Enter" to scrape both questions and data\n "1" to scrape questions only\n "2" to scrape data only',
  );
  const input = prompt('> ');
  if (input == 1) {
    await getQuestions();
  } else if (input == 2) {
    await getAllQuestionData();
  } else {
    await getQuestions();
    await getAllQuestionData();
  }
}

main()
  .then(() => knex.destroy())
  .catch((err) => {
    console.error(err);
  });

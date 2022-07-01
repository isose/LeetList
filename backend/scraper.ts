import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const { question, questionTagMap, questionSlug, tag } = require('./models');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

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
  await question.update(
    {
      upVotes: upVotes,
      downVotes: downVotes,
      numberOfAccepted: numberOfAccepted,
      numberOfSubmissions: numberOfSubmissions,
    },
    { where: { questionId: questionObj.questionFrontendId } },
  );
}

async function getAllQuestionData() {
  // get slugs from question_slugs
  const slugs = (await questionSlug.findAll()).map((slug: any) => slug.slug);
  for (const slug of slugs) {
    await getQuestionData(slug);
    // delete slug from question_slugs
    await questionSlug.destroy({ where: { slug: slug } });
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

  const data = res.data;
  for (const questionObj of data.data.problemsetQuestionList.questions) {
    // skip premium questions
    if (questionObj.paidOnly) {
      continue;
    }

    const questionJson = {
      url: QUESTION_URL + questionObj.titleSlug,
      questionId: questionObj.frontendQuestionId,
      title: questionObj.title,
      difficulty: questionObj.difficulty,
      upVotes: null,
      downVotes: null,
      numberOfAccepted: null,
      numberOfSubmissions: null,
    };

    // add question slug to database
    const doesSlugExist = await questionSlug.findOne({ where: { slug: questionObj.titleSlug } });
    if (!doesSlugExist) {
      await questionSlug.create({ slug: questionObj.titleSlug });
    }

    // add question to database
    const doesQuestionExist = await question.findOne({
      where: { questionId: questionJson.questionId },
    });
    if (!doesQuestionExist) {
      await question.create(questionJson);
    } else {
      await question.update(questionJson, { where: { questionId: questionJson.questionId } });
    }

    for (const tagObj of questionObj.topicTags) {
      // add tag to database
      const doesTagExist = await tag.findOne({ where: { tag: tagObj.name } });
      if (!doesTagExist) {
        await tag.create({ tag: tagObj.name });
      }

      // add to question_tag_map in database
      const questionTag = {
        questionId: questionObj.frontendQuestionId,
        tagId: tagObj.name,
      };
      const doesQuestionTagExist = await questionTagMap.findOne({ where: questionTag });
      if (!doesQuestionTagExist) {
        await questionTagMap.create(questionTag);
      }
    }
  }
}

async function main() {
  if (process.argv.length == 2) {
    await getQuestions();
    await getAllQuestionData();
  } else {
    for (const arg of process.argv) {
      if (arg == 'questions') {
        await getQuestions();
      } else if (arg == 'data') {
        await getAllQuestionData();
      }
    }
  }
}

main();

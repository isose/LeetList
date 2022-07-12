import express from 'express';
import Sequelize, { Op } from 'sequelize';
const { question, questionTagMap } = require('../models');

const questionRouter = express.Router();

const getQuestionQuery = (req: any) => {
  const query: any = {
    include: [{ model: questionTagMap, as: 'tags' }],
    order: [['questionId', 'ASC']],
  };

  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  if (!Number.isNaN(offset) && Number.isInteger(offset)) {
    query.offset = offset;
  }
  if (!Number.isNaN(limit) && Number.isInteger(limit)) {
    query.limit = limit;
  }

  addQueryParams(query, req);
  return query;
};

const getQuestionCountQuery = (req: any) => {
  const query: any = {};
  addQueryParams(query, req);
  return query;
};

const addQueryParams = (query: any, req: any) => {
  const difficulty = req.query.difficulty;
  const search = req.query.search;
  const queries: any[] = [];

  if (search) {
    const searchQueryArray: any[] = [];
    const searchArray = (search as string).trim().split(' ');
    searchArray.forEach((search: string) => {
      searchQueryArray.push({ [Sequelize.Op.iLike]: '%' + search + '%' });
    });

    const searchQuery = {
      [Op.or]: [
        {
          questionId: {
            [Op.or]: searchQueryArray,
          },
        },
        {
          title: {
            [Op.or]: searchQueryArray,
          },
        },
      ],
    };
    queries.push(searchQuery);
  }

  if (difficulty) {
    const difficultyQuery = {
      difficulty: {
        [Op.or]: [(difficulty as string).split(',')],
      },
    };
    queries.push(difficultyQuery);
  }

  query.where = {
    [Op.and]: queries,
  };
};

questionRouter.get('/questions', async (req, res) => {
  try {
    const questions = await question.findAll(getQuestionQuery(req));
    return res.status(200).json(questions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

questionRouter.get('/questions/count', async (req, res) => {
  try {
    const count = await question.count(getQuestionCountQuery(req));
    return res.status(200).json(count);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

questionRouter.get('/question/:id', async (req, res) => {
  try {
    const questions = await question.findAll({
      where: { questionId: req.params.id },
      include: [{ model: questionTagMap, as: 'tags' }],
      order: [['questionId', 'ASC']],
    });
    return res.status(200).json(questions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default questionRouter;

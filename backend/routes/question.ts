import express from 'express';
import Sequelize, { Op } from 'sequelize';
import { sequelize } from '../models';
const { question, questionTagMap } = require('../models');

const questionRouter = express.Router();

const addQueryParams = (query: any, req: any) => {
  const search = req.query.search;
  const tags = req.query.tags;
  const difficulty = req.query.difficulty;
  const queries: any[] = [];

  if (search) {
    const searchQueryArray: any[] = [];
    const searchArray = (search as string).trim().split(' ');
    searchArray.forEach((search: string) => {
      searchQueryArray.push({ [Sequelize.Op.iLike]: '%' + search + '%' });
    });

    const searchQuery = {
      [Op.or]: [
        { questionId: { [Op.or]: searchQueryArray } },
        { title: { [Op.or]: searchQueryArray } },
      ],
    };
    queries.push(searchQuery);
  }

  if (tags) {
    const tagsArray = (tags as string).split(',');
    const tagQuery = {
      model: questionTagMap,
      as: 'tagsFilter',
      where: { tagId: { [Op.or]: tagsArray } },
    };
    query.include.push(tagQuery);
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

const getQuestionQuery = (req: any) => {
  const query: any = {
    include: [{ model: questionTagMap, as: 'tags', attributes: [['tagId', 'tag']] }],
    order: [[sequelize.cast(sequelize.col('question.questionId'), 'BIGINT'), 'ASC']],
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
  const query: any = {
    include: [{ model: questionTagMap, as: 'tags', attributes: [['tagId', 'tag']] }],
    distinct: true,
  };
  addQueryParams(query, req);
  return query;
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

export default questionRouter;

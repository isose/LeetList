import express from 'express';
const Op = require('sequelize').Op;
const { question, questionTagMap } = require('../models');

const router = express.Router();

const getQuestionQuery = (req: any) => {
  let query: any = {
    include: [{ model: questionTagMap, as: 'tags' }],
    order: [['questionId', 'ASC']],
    where: {},
  };

  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  if (!Number.isNaN(offset) && Number.isInteger(offset)) {
    query.offset = offset;
  }
  if (!Number.isNaN(limit) && Number.isInteger(limit)) {
    query.limit = limit;
  }

  queryAddDifficuty(query, req);

  return query;
};

const getQuestionCountQuery = (req: any) => {
  let query: any = {
    where: {},
  };
  queryAddDifficuty(query, req);
  return query;
};

const queryAddDifficuty = (query: any, req: any) => {
  const difficulty = req.query.difficulty;
  if (difficulty) {
    query.where.difficulty = {
      [Op.or]: [(difficulty as string).split(',')],
    };
  }
};

router.get('/questions', async (req, res) => {
  try {
    const questions = await question.findAll(getQuestionQuery(req));
    return res.status(200).json(questions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/questions/count', async (req, res) => {
  try {
    const count = await question.count(getQuestionCountQuery(req));
    return res.status(200).json(count);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/question/:id', async (req, res) => {
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

module.exports = router;

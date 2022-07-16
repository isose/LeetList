import express from 'express';
import { raw } from 'objection';
import Question from '../database/models/question';

require('../database/knex');

const questionRouter = express.Router();

const questionQuery = async (req: any) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const search = req.query.search;
  const tags = req.query.tags;
  const difficulty = req.query.difficulty;

  return await Question.query()
    .withGraphFetched('tags')
    .where((builder) => {
      if (search) {
        search
          .trim()
          .split(' ')
          .forEach((string: string) => {
            builder.orWhereRaw('question_id ILIKE ?', '%' + string + '%');
            builder.orWhereRaw('question.title ILIKE ?', '%' + string + '%');
          });
      }
    })
    .where((builder) => {
      if (tags) {
        const tagsArray = tags.split(',');
        tagsArray.forEach((tag: string) => {
          builder.whereExists(Question.relatedQuery('tags').where('tagName', '=', tag));
        });
      }
    })
    .where((builder) => {
      if (difficulty) {
        difficulty.split(',').forEach((diff: string) => {
          builder.orWhere('difficulty', '=', diff);
        });
      }
    })
    .orderBy(raw('question_id::integer'), 'ASC')
    .page(page, limit);
};

questionRouter.get('/questions', async (req, res) => {
  try {
    const questions = await questionQuery(req);
    return res.status(200).json(questions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default questionRouter;

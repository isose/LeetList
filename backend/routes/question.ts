import express from 'express';
const { question, questionTagMap } = require('../models');

const router = express.Router();

router.get('/questions', async (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  
  let query: any = {
    include: [{ model: questionTagMap, as: 'tags' }],
    order: [['questionId', 'ASC']],
  }

  if (!Number.isNaN(offset) && Number.isInteger(offset)) {
    query.offset = offset;
  }
  if (!Number.isNaN(limit) && Number.isInteger(limit)) {
    query.limit = limit;
  }

  try {
    const questions = await question.findAll(query);
    return res.status(200).json(questions);
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

import express from 'express';
const { question, questionTagMap, tag } = require('../models');

const router = express.Router();

router.get('/questions', async (req, res) => {
  try {
    const questions = await question.findAll({
      include: [{ model: questionTagMap, as: 'tags' }],
      order: [['questionId', 'ASC']],
    });
    return res.json(questions);
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
    return res.json(questions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;

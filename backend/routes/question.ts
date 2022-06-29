import express from 'express';
const { question } = require('../models');

const router = express.Router();

router.get('/questions', async (req, res) => {
  try {
    const questions = await question.findAll({ order: [['questionId', 'ASC']] });
    return res.json(questions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;

import express from 'express';
const { tag } = require('../models');

const tagRouter = express.Router();

tagRouter.get('/tags', async (req, res) => {
  try {
    const tags = await tag.findAll({ order: [['tag', 'ASC']] });
    return res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default tagRouter;

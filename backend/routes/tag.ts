import express from 'express';
import '../database/knex';
import Tag from '../database/models/tag';

const tagRouter = express.Router();

tagRouter.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.query().orderBy('tagName', 'asc');
    return res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default tagRouter;

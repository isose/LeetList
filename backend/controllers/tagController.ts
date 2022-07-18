import '../database/knex';
import Tag from '../database/models/tag';

export const tags = async (req: any, res: any) => {
  try {
    const tags = await Tag.query().orderBy('tagName', 'asc');
    return res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

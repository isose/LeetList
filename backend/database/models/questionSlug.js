import { Model } from 'objection';

class QuestionSlug extends Model {
  static get tableName() {
    return 'questionSlug';
  }
}

export default QuestionSlug;

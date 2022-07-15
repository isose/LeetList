const { Model } = require('objection');

class QuestionSlug extends Model {
  static get tableName() {
    return 'questionSlug';
  }
}

module.exports = QuestionSlug;

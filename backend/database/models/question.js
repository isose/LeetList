const { Model } = require('objection');

class Question extends Model {
  static get tableName() {
    return 'question';
  }

  static get relationMappings() {
    const QuestionTagMap = require('./questionTagMap');
    return {
      tags: {
        relation: Model.HasManyRelation,
        modelClass: QuestionTagMap,
        join: {
          from: 'question.questionId',
          to: 'questionTagMap.questionId',
        },
      },
    };
  }
}

module.exports = Question;

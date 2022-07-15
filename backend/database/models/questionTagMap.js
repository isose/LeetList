const { Model } = require('objection');

class QuestionTagMap extends Model {
  static get tableName() {
    return 'questionTagMap';
  }

  static get relationMappings() {
    const Question = require('./question');
    const Tag = require('./tag');
    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionTagMap.questionId',
          to: 'question.questionId',
        },
      },
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tag,
        join: {
          from: 'questionTagMap.tagId',
          to: 'tag.tag',
        },
      },
    };
  }
}

module.exports = QuestionTagMap;

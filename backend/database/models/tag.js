const { Model } = require('objection');

class Tag extends Model {
  static get tableName() {
    return 'tag';
  }

  static get relationMappings() {
    const QuestionTagMap = require('./questionTagMap');
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: QuestionTagMap,
        join: {
          from: 'tag.tag',
          to: 'questionTagMap.tagId',
        },
      },
    };
  }
}

module.exports = Tag;

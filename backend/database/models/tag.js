const { Model } = require('objection');

class Tag extends Model {
  static get tableName() {
    return 'tag';
  }

  $formatJson(json) {
    return {
      ...super.$formatJson(json),
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  static get relationMappings() {
    const QuestionTagMap = require('./questionTagMap');
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: QuestionTagMap,
        join: {
          from: 'tag.tagName',
          to: 'questionTagMap.tagName',
        },
      },
    };
  }
}

module.exports = Tag;

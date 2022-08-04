import { Model } from 'objection';

class Question extends Model {
  static get tableName() {
    return 'question';
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
    const QuestionTagMap = require('./questionTagMap').default;
    const QuestionListItem = require('./questionListItem').default;
    return {
      tags: {
        relation: Model.HasManyRelation,
        modelClass: QuestionTagMap,
        join: {
          from: 'question.questionId',
          to: 'questionTagMap.questionId',
        },
      },
      questionListItems: {
        relation: Model.HasManyRelation,
        modelClass: QuestionListItem,
        join: {
          from: 'question.questionId',
          to: 'questionListItem.questionId',
        },
      },
    };
  }
}

export default Question;

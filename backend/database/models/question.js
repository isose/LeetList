import { Model } from 'objection';
import QuestionListItem from './questionListItem';
import QuestionTagMap from './questionTagMap';

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

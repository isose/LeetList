import { Model } from 'objection';
import Question from './question';
import Tag from './tag';

class QuestionTagMap extends Model {
  static get tableName() {
    return 'questionTagMap';
  }

  $formatJson(json) {
    return {
      ...super.$formatJson(json),
      id: undefined,
      questionId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  static get relationMappings() {
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
          from: 'questionTagMap.tagName',
          to: 'tag.tagName',
        },
      },
    };
  }
}

export default QuestionTagMap;

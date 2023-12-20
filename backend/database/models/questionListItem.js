import { Model } from 'objection';
import Question from './question';
import QuestionList from './questionList';

class QuestionListItem extends Model {
  static get tableName() {
    return 'questionListItem';
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
      questionList: {
        relation: Model.BelongsToOneRelation,
        modelClass: QuestionList,
        join: {
          from: 'questionListItem.questionListId',
          to: 'questionList.id',
        },
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionListItem.questionId',
          to: 'question.questionId',
        },
      },
    };
  }
}

export default QuestionListItem;

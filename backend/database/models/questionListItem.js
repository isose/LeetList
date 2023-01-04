import { Model } from 'objection';

class QuestionListItem extends Model {
  static get tableName() {
    return 'questionListItem';
  }

  static get relationMappings() {
    const QuestionList = require('./questionList').default;
    const Question = require('./question').default;
    return {
      questionList: {
        relation: Model.BelongsToOneRelation,
        modelClass: QuestionList,
        join: {
          from: 'questionListItem.questionListId',
          to: 'quesitonList.id',
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

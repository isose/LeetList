import { Model } from 'objection';

class QuestionList extends Model {
  static get tableName() {
    return 'questionList';
  }

  static get relationMappings() {
    const User = require('./user').default;
    const QuestionListItem = require('./questionListItem').default;
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'questionList.username',
          to: 'user.username',
        },
      },
      questionListItems: {
        relation: Model.HasManyRelation,
        modelClass: QuestionListItem,
        join: {
          from: 'questionList.id',
          to: 'questionListItem.questionListId',
        },
      },
    };
  }
}

export default QuestionList;

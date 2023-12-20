import { Model } from 'objection';
import QuestionListItem from './questionListItem';
import User from './user';

class QuestionList extends Model {
  static get tableName() {
    return 'questionList';
  }

  $formatJson(json) {
    return {
      ...super.$formatJson(json),
      updatedAt: undefined,
    };
  }

  static get relationMappings() {
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

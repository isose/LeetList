import { Model } from 'objection';
import QuestionList from './questionList';

class User extends Model {
  static get tableName() {
    return 'user';
  }

  static get relationMappings() {
    return {
      questionLists: {
        relation: Model.HasManyRelation,
        modelClass: QuestionList,
        join: {
          from: 'user.username',
          to: 'questionList.username',
        },
      },
    };
  }
}

export default User;

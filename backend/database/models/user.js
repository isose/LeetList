import { Model } from 'objection';

class User extends Model {
  static get tableName() {
    return 'user';
  }

  static get relationMappings() {
    const QuestionList = require('./quesitonList').default;
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

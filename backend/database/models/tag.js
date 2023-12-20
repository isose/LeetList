import { Model } from 'objection';
import QuestionTagMap from './questionTagMap';

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

export default Tag;

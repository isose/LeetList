import { knexSetup } from '../../backend/database/knex';
import QuestionList from '../../backend/database/models/questionList';
import QuestionListItem from '../../backend/database/models/questionListItem';
import User from '../../backend/database/models/user';
const knexfile = require('../../backend/database/knexfile');

knexSetup(knexfile.test);

interface List {
  username: string;
  listName: string;
  private: boolean;
  questions?: Question[];
}

interface Question {
  questionId: string;
  index?: number;
  questionListId?: number;
}

export class Database {
  async deleteUser(username: string) {
    await User.query().delete().where('username', username);
  }

  async createList(list: List) {
    try {
      await QuestionList.transaction(async (trx) => {
        const newQuestionList = {
          username: list.username,
          name: list.listName,
          private: list.private,
        };

        const questionList: any = await QuestionList.query(trx).insert(newQuestionList);

        if (list.questions != undefined) {
          for (let i = 0; i < list.questions.length; i++) {
            list.questions[i].index = i;
            list.questions[i].questionListId = questionList.id;
          }
          await QuestionListItem.query(trx).insert(list.questions);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  async updateList(listId: string, updatedList: List) {
    try {
      await QuestionList.transaction(async (trx) => {
        const id = parseInt(listId, 36);
        await QuestionList.query(trx)
          .findById(id)
          .patch({ name: updatedList.listName, private: updatedList.private });

        if (updatedList.questions != undefined) {
          await QuestionListItem.query(trx).delete().where({ questionListId: id });
          for (let i = 0; i < updatedList.questions.length; i++) {
            updatedList.questions[i].index = i;
            updatedList.questions[i].questionListId = id;
          }
          await QuestionListItem.query(trx).insert(updatedList.questions);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteList(username: string, listName: string) {
    const questionList: any = await QuestionList.query().findOne({
      username: username,
      name: listName,
    });
    try {
      await QuestionList.transaction(async (trx) => {
        await QuestionListItem.query(trx).delete().where({ questionListId: questionList.id });
        await QuestionList.query(trx).deleteById(questionList.id);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

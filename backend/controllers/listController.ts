import * as dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import { LISTS_SORT_ORDER } from '../../frontend/pages/Lists/ListsEnum';
import QuestionList from '../database/models/questionList';
import QuestionListItem from '../database/models/questionListItem';

dotenv.config({ path: __dirname + '/./../.env' });

export const getList = async (req: any, res: any) => {
  let payload: any = null;
  try {
    payload = verify(req.signedCookies.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    // ignore error
  }

  const questionList: any = await QuestionList.query().findOne({
    id: parseInt(req.params.id, 36), // convert id from base36
  });

  if (questionList == undefined) {
    return res.status(404).json('Not found');
  }

  if (questionList.private && (payload == null || questionList.username != payload.username)) {
    return res.status(403).json('List is private');
  }

  const questionsQuery = await QuestionListItem.query()
    .where('questionListItem.questionListId', questionList.id)
    .join('question', 'questionListItem.questionId', 'question.questionId')
    .join('questionTagMap', 'question.questionId', 'questionTagMap.questionId')
    .select(
      'url',
      'question.questionId',
      'title',
      'difficulty',
      'upVotes',
      'downVotes',
      'numberOfAccepted',
      'numberOfSubmissions',
      'tagName',
    )
    .orderBy('index', 'ASC');

  // remove redundant questions by converting tags into an array
  const questions: any[] = [];
  questionsQuery.forEach((question: any) => {
    if (questions.length > 0 && questions[questions.length - 1].questionId == question.questionId) {
      questions[questions.length - 1].tags.push({ tagName: question.tagName });
    } else {
      const tag = question.tagName;
      delete question.tagName;
      question.tags = [{ tagName: tag }];
      questions.push(question);
    }
  });

  return res.status(200).json({ questionList, questions });
};

export const createList = async (req: any, res: any) => {
  let payload: any = null;
  try {
    payload = verify(req.signedCookies.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.status(403).json({ success: false });
  }

  const list = req.body;

  const listNameExists = await QuestionList.query().findOne({
    username: payload.username,
    name: list.name,
  });
  if (listNameExists) {
    return res.status(400).json({ listName: `You already have a list named ${list.name}.` });
  }

  try {
    await QuestionList.transaction(async (trx) => {
      const newQuestionList = {
        username: payload.username,
        name: list.name,
        private: list.private,
      };

      const questionList: any = await QuestionList.query(trx).insert(newQuestionList);

      if (list.questions.length > 0) {
        list.questions.forEach((question: any) => {
          question.questionListId = questionList.id;
        });
        await QuestionListItem.query(trx).insert(list.questions);
      }

      return res.status(201).json({ location: questionList.id.toString(36) });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateList = async (req: any, res: any) => {
  let payload: any = null;
  try {
    payload = verify(req.signedCookies.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.status(403).json({ success: false });
  }

  const list = req.body;

  if (payload.username != list.username) {
    return res.status(403).json({ success: false });
  }

  const listNameExists = await QuestionList.query()
    .findOne({
      username: payload.username,
      name: list.name,
    })
    .whereNot('id', list.id);
  if (listNameExists) {
    return res.status(400).json({ listName: `You already have a list named ${list.name}.` });
  }

  try {
    await QuestionList.transaction(async (trx) => {
      await QuestionList.query(trx)
        .findById(list.id)
        .patch({ name: list.name, private: list.private });

      if (list.questions != undefined) {
        await QuestionListItem.query(trx).delete().where({ questionListId: list.id });
        if (list.questions.length > 0) {
          list.questions.forEach((question: any) => {
            question.questionListId = list.id;
          });
          await QuestionListItem.query(trx).insert(list.questions);
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  return res.status(201).json({ location: list.id.toString(36) });
};

export const deleteList = async (req: any, res: any) => {
  let payload: any = null;
  try {
    payload = verify(req.signedCookies.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.status(403).json({ success: false });
  }

  const questionList: any = await QuestionList.query().findOne({
    id: parseInt(req.params.id, 36), // convert id from base36
    username: payload.username,
  });
  if (questionList == undefined) {
    return res.status(403).json({ success: false });
  }

  try {
    // transaction to delete questionListItems with same questionId, then delete the questionList
    await QuestionList.transaction(async (trx) => {
      await QuestionListItem.query(trx).delete().where({ questionListId: questionList.id });
      await QuestionList.query(trx).deleteById(questionList.id);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  return res.status(204).json({ success: true });
};

const getListsSortOrder = (sort: any): { column: string; order: 'ASC' | 'DESC' } => {
  switch (sort) {
    case LISTS_SORT_ORDER.NEW: {
      return { column: 'created_at', order: 'DESC' };
    }
    case LISTS_SORT_ORDER.OLD: {
      return { column: 'created_at', order: 'ASC' };
    }
    case LISTS_SORT_ORDER.NAME_ASCENDING: {
      return { column: 'name', order: 'ASC' };
    }
    case LISTS_SORT_ORDER.NAME_DESCENDING: {
      return { column: 'name', order: 'DESC' };
    }
    default: {
      return { column: 'created_at', order: 'DESC' };
    }
  }
};

export const lists = async (req: any, res: any) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const search = req.query.search;
  const sort = getListsSortOrder(req.query.sort);

  const questionLists: any = await QuestionList.query()
    .where('private', false)
    .where((builder) => {
      if (search) {
        search
          .trim()
          .split(' ')
          .forEach((string: string) => {
            builder.orWhereRaw('name ILIKE ?', '%' + string + '%');
          });
      }
    })
    .orderBy(sort.column, sort.order)
    .page(page, limit);
  // convert id to base36
  questionLists.results.forEach((questionList: any) => {
    questionList.id = questionList.id.toString(36);
  });
  return res.status(200).json(questionLists);
};

export const myLists = async (req: any, res: any) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const search = req.query.search;
  const sort = getListsSortOrder(req.query.sort);

  let payload: any = null;
  try {
    payload = verify(req.signedCookies.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.status(403).json({ success: false });
  }

  const questionLists: any = await QuestionList.query()
    .where('username', payload.username)
    .where((builder) => {
      if (search) {
        search
          .trim()
          .split(' ')
          .forEach((string: string) => {
            builder.orWhereRaw('name ILIKE ?', '%' + string + '%');
          });
      }
    })
    .orderBy(sort.column, sort.order)
    .page(page, limit);
  // convert id to base36
  questionLists.results.forEach((questionList: any) => {
    questionList.id = questionList.id.toString(36);
  });
  return res.status(200).json(questionLists);
};

import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'src/api/axios';
import PaginationNavigation from 'src/components/pagination/PaginationNavigation';
import BasicSearch from 'src/components/search/BasicSearch';
import useLocalStorage from 'src/hooks/useLocalStorage';
import usePagination from 'src/hooks/usePagination';
import CreateListSidepanel, { ListState } from 'src/pages/Questions/Component/CreateListSidepanel';
import { IQuestion } from 'src/pages/Questions/Component/Question';
import QuestionListSelectable from 'src/pages/Questions/Component/QuestionListSelectable';
import styles from 'styles/pages/Questions/Questions.module.css';
import { useDebounce } from 'use-debounce';

const Questions = () => {
  const { state } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const getSearchUrlParam = (): string => {
    const searchParam = searchParams.get('search');
    return searchParam ? searchParam : '';
  };

  const getTagsUrlParam = (): string[] => {
    const tagsParam = searchParams.get('tags');
    return tagsParam ? tagsParam.split(',') : [];
  };

  const getDifficultyUrlParam = (): string[] => {
    const difficultyParam = searchParams.get('difficulty');
    return difficultyParam ? difficultyParam.split(',') : [];
  };

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(true);
  const [listState, setListState] = useState<ListState>(
    state ? state : { name: '', private: false, questions: [] },
  );
  const [limit, setLimit] = useLocalStorage('limit', { text: '50 / page', value: 50 });
  const [page, setPage, totalPages, setTotalPages] = usePagination();
  const [search, setSearch] = useState<string>(getSearchUrlParam());
  const [debouncedSearch] = useDebounce(search, 250);
  const [tags, setTags] = useState<string[]>(getTagsUrlParam());
  const [difficulty, setDifficulty] = useState<string[]>(getDifficultyUrlParam());

  const queryParams = `/?page=${page - 1}&limit=${
    limit.value
  }&search=${debouncedSearch}&tags=${tags}&difficulty=${difficulty}`;

  useEffect(() => {
    fetchQuestions();
    updateUrlParams();
  }, [limit, page, debouncedSearch, tags, difficulty]);

  const fetchQuestions = async () => {
    setQuestionsLoading(true);
    axios.get(`/api/questions${queryParams}`).then((res) => {
      setQuestions(res.data.results);
      setQuestionsLoading(false);
      const pages = Math.ceil(res.data.total / limit.value);
      setTotalPages(Math.max(pages, 1));
    });
  };

  const updateUrlParams = () => {
    searchParams.set('page', page.toString());

    if (debouncedSearch.length === 0) {
      searchParams.delete('search');
    } else {
      searchParams.set('search', debouncedSearch);
    }

    if (tags.length === 0) {
      searchParams.delete('tags');
    } else {
      searchParams.set('tags', tags.toString());
    }

    if (difficulty.length === 0) {
      searchParams.delete('difficulty');
    } else {
      searchParams.set('difficulty', difficulty.toString());
    }

    setSearchParams(searchParams);
  };

  const setSelectedQuestions = (questions: IQuestion[]) => {
    setListState({ ...listState, questions: questions });
  };

  return (
    <>
      <div className={styles.questions}>
        <div className={styles['questions__container']}>
          <h1>Questions</h1>
          <BasicSearch
            search={search}
            setSearch={setSearch}
            tagsSelected={tags}
            setTagsSelected={setTags}
            difficultySelected={difficulty}
            setDifficultySelected={setDifficulty}
          />
          <QuestionListSelectable
            loading={questionsLoading}
            questions={questions}
            selectedQuestions={listState.questions}
            setSelectedQuestions={setSelectedQuestions}
          />
          <PaginationNavigation
            selected={limit}
            setLimit={setLimit}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
        <CreateListSidepanel listState={listState} setListState={setListState} />
      </div>
    </>
  );
};

export default Questions;

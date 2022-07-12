import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaginationNavigation from '../components/pagination/PaginationNavigation';
import QuestionList from '../components/QuestionList';
import BasicSearch from '../components/search/BasicSearch';
import { useStateDebounced } from '../hooks/useStateDebounced';

const App = () => {
  const navigate = useNavigate();
  const currentUrlParams = new URLSearchParams(window.location.search);

  const getLocalStorageLimit = () => {
    const localStorageLimit = localStorage.getItem('limit');
    return localStorageLimit ? JSON.parse(localStorageLimit) : 50;
  };

  const getUrlPageParam = () => {
    const pageParam = currentUrlParams.get('page');
    if (pageParam && Number(pageParam) > 0) {
      return Number(pageParam);
    }
    return 1;
  };

  const getUrlSearchParam = () => {
    const searchParam = currentUrlParams.get('search');
    return searchParam ? searchParam : '';
  };

  const getUrlDifficultyParam = () => {
    const difficultyParam = currentUrlParams.get('difficulty');
    return difficultyParam ? difficultyParam.split(',') : [];
  };

  const [questions, setQuestions] = useState<any[]>([]);
  const [limit, setLimit] = useState(getLocalStorageLimit());
  const [page, setPage] = useState(getUrlPageParam());
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [search, debouncedSearch, setSearch] = useStateDebounced(getUrlSearchParam(), 250);
  const [difficulty, setDifficulty] = useState<string[]>(getUrlDifficultyParam());

  const paginationOptions = [{ value: 20 }, { value: 50 }, { value: 100 }, { value: 200 }];

  const queryParams = `/?offset=${
    (page - 1) * Number(limit)
  }&limit=${limit}&search=${debouncedSearch}&difficulty=${difficulty}`;

  useEffect(() => {
    getQuestions();
    updateUrlParams();
  }, [limit, page, debouncedSearch, difficulty]);

  useEffect(() => {
    getTotalPages();
  }, [limit, debouncedSearch, difficulty]);

  useEffect(() => {
    handlePageBounds();
  }, [totalPages]);

  const getQuestions = async () => {
    const questions = await fetchQuestions();
    setQuestions(questions);
  };

  const getTotalPages = async () => {
    const res = await fetch('/questions/count' + queryParams);
    const data = await res.json();
    const pages = Math.ceil(data / Number(limit));
    setTotalPages(pages > 0 ? pages : 1);
  };

  const handlePageBounds = () => {
    if (totalPages !== null && page > totalPages) {
      setPage(totalPages);
    }
  };

  const fetchQuestions = async () => {
    const res = await fetch('/questions' + queryParams);
    const data = await res.json();
    return data;
  };

  const updateUrlParams = () => {
    currentUrlParams.set('page', page.toString());

    if (difficulty.length === 0) {
      currentUrlParams.delete('difficulty');
    } else {
      currentUrlParams.set('difficulty', difficulty.toString());
    }

    if (debouncedSearch.length === 0) {
      currentUrlParams.delete('search');
    } else {
      currentUrlParams.set('search', debouncedSearch);
    }

    navigate(window.location.pathname + '?' + currentUrlParams.toString());
  };

  return (
    <div className='App'>
      <h1>Leetlist</h1>
      <div className='question-module'>
        <BasicSearch
          search={search}
          setSearch={setSearch}
          difficultySelected={difficulty}
          setDifficultySelected={setDifficulty}
        />
        <QuestionList questions={questions} />
        <PaginationNavigation
          items={paginationOptions}
          selected={limit}
          setLimit={setLimit}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default App;

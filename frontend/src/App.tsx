import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaginationNavigation from '../components/pagination/PaginationNavigation';
import QuestionList from '../components/QuestionList';
import BasicSearch from '../components/search/BasicSearch';

const App = () => {
  let localStorageLimit = localStorage.getItem('limit');
  localStorageLimit = localStorageLimit ? JSON.parse(localStorageLimit) : 50;

  const navigate = useNavigate();
  let currentUrlParams = new URLSearchParams(window.location.search);
  const pageParam = currentUrlParams.get('page');
  const difficultyParam = currentUrlParams.get('difficulty');

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(pageParam ? Number(pageParam) : 1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [limit, setLimit] = useState(localStorageLimit);
  const [difficulty, setDifficulty] = useState<string[]>(
    difficultyParam ? difficultyParam.split(',') : [],
  );

  const paginationOptions = [{ value: 20 }, { value: 50 }, { value: 100 }, { value: 200 }];

  const queryParams = `/?offset=${
    (page - 1) * Number(limit)
  }&limit=${limit}&difficulty=${difficulty}`;

  useEffect(() => {
    getQuestions();
    currentUrlParams.set('page', page.toString());
    if (difficulty.length === 0) {
      currentUrlParams.delete('difficulty');
    } else {
      currentUrlParams.set('difficulty', difficulty.toString());
    }
    navigate(window.location.pathname + '?' + currentUrlParams.toString());
  }, [limit, page, difficulty]);

  useEffect(() => {
    getTotalPages();
  }, [limit, difficulty]);

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
    setTotalPages(Math.ceil(data / Number(limit)));
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

  return (
    <div className='App'>
      <h1>Leetlist</h1>
      <div className='question-module'>
        <BasicSearch difficultySelected={difficulty} setDifficultySelected={setDifficulty} />
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

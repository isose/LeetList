import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionList from '../components/QuestionList';
import PaginationNavigation from '../components/pagination/PaginationNavigation';

const App = () => {
  let localStorageLimit = localStorage.getItem('limit');
  localStorageLimit = localStorageLimit ? JSON.parse(localStorageLimit) : 50;

  const navigate = useNavigate();
  let currentUrlParams = new URLSearchParams(window.location.search);
  const pageParam = currentUrlParams.get('page');

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(pageParam ? Number(pageParam) : 1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [limit, setLimit] = useState(localStorageLimit);

  const paginationOptions = [{ value: 20 }, { value: 50 }, { value: 100 }, { value: 200 }];

  useEffect(() => {
    getQuestions();
    currentUrlParams.set('page', page.toString());
    navigate(window.location.pathname + '?' + currentUrlParams.toString());
  }, [limit, page]);

  useEffect(() => {
    getTotalPages();
  }, [limit]);

  useEffect(() => {
    handlePageBounds();
  }, [totalPages]);

  const getQuestions = async () => {
    const questions = await fetchQuestions();
    setQuestions(questions);
  };

  const getTotalPages = async () => {
    const res = await fetch('/questions/count');
    const data = await res.json();
    setTotalPages(Math.ceil(data / Number(limit)));
  };

  const handlePageBounds = () => {
    if (totalPages !== null && page > totalPages) {
      setPage(totalPages);
    }
  };

  const fetchQuestions = async () => {
    const res = await fetch(`/questions/?offset=${(page - 1) * Number(limit)}&limit=${limit}`);
    const data = await res.json();
    return data;
  };

  return (
    <div className='App'>
      <h1>Leetlist</h1>
      <div className='question-module'>
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

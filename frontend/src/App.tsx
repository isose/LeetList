import React, { useEffect, useState } from 'react';
import QuestionList from '../components/QuestionList';
import PaginationNavigation from '../components/pagination/PaginationNavigation';

const App = () => {
  let localStorageLimit = localStorage.getItem('limit');
  localStorageLimit = localStorageLimit ? JSON.parse(localStorageLimit) : 50;

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(localStorageLimit);

  const paginationOptions = [{ value: 20 }, { value: 50 }, { value: 100 }, { value: 200 }];

  useEffect(() => {
    getQuestions();
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
    if (page > totalPages) {
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

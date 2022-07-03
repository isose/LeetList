import React, { useEffect, useState } from 'react';
import QuestionList from '../components/QuestionList';
import PaginationNavigation from '../components/pagination/PaginationNavigation';

const App = () => {
  let localStorageLimit = localStorage.getItem('limit');
  localStorageLimit = localStorageLimit ? JSON.parse(localStorageLimit) : 50;

  const [questions, setQuestions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(localStorageLimit);

  const paginationOptions = [{ value: 20 }, { value: 50 }, { value: 100 }, { value: 200 }];

  useEffect(() => {
    getQuestions();
  }, [offset, limit]);

  const getQuestions = async () => {
    const questions = await fetchQuestions();
    setQuestions(questions);
  };

  const fetchQuestions = async () => {
    const res = await fetch(`/questions/?offset=${offset}&limit=${limit}`);
    const data = await res.json();
    return data;
  };

  return (
    <div className='App'>
      <h1>Leetlist</h1>
      <div className='question-module'>
        <QuestionList questions={questions} />
        <PaginationNavigation items={paginationOptions} selected={limit} onClick={setLimit} />
      </div>
    </div>
  );
};

export default App;

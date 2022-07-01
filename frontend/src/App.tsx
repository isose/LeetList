import React, { useEffect, useState } from 'react';
import QuestionList from '../components/QuestionList';

const App = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await fetchQuestions();
      setQuestions(questions);
    };
    getQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch('/questions');
    const data = await res.json();
    return data;
  };

  return (
    <div className='App'>
      <h1>Leetlist</h1>
      <QuestionList questions={questions} />
    </div>
  );
};

export default App;

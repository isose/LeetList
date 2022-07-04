import React from 'react';
import Question from './Question';

const QuestionList = ({ questions }: any) => {
  return (
    <div className='question-list'>
      {questions.map((question: any, index: number) => {
        return <Question key={index} {...question} />;
      })}
    </div>
  );
};

export default QuestionList;

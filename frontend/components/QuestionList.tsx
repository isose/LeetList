import React from 'react';
import Question from './Question';

const QuestionList = ({ questions }: any) => {
  return (
    <div className='question-list'>
      {questions.map((question: any) => {
        return <Question key={question.questionId} {...question} />;
      })}
    </div>
  );
};

export default QuestionList;

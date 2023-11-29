import Question from 'components/Question';
import React from 'react';

const QuestionList = ({ questions }: any) => {
  return (
    <div className='question-list'>
      {questions.map((question: any) => {
        return <Question key={question.questionId} question={question} />;
      })}
    </div>
  );
};

export default QuestionList;

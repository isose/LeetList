import React from 'react';
import Question from 'src/pages/Questions/Component/Question';

const QuestionList = ({ questions }: any) => {
  return (
    <div className='question-list' data-testid='question-list'>
      {questions.map((question: any) => {
        return <Question key={question.questionId} question={question} />;
      })}
    </div>
  );
};

export default QuestionList;

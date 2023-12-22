import React from 'react';
import Question, { IQuestion } from 'src/pages/Questions/Component/Question';

interface QuestionListProps {
  questions: IQuestion[];
}

const QuestionList = ({ questions }: QuestionListProps) => {
  return (
    <div className='question-list' data-testid='question-list'>
      {questions.map((question: IQuestion) => {
        return <Question key={question.questionId} question={question} />;
      })}
    </div>
  );
};

export default QuestionList;

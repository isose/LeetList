import React from 'react';
import Question, { IQuestion } from 'src/pages/Questions/Component/Question';
import styles from 'styles/pages/Questions/Component/Question.module.css';

interface QuestionListSelectableProps {
  questions: IQuestion[];
  selectedQuestions: IQuestion[];
  setSelectedQuestions: (questions: IQuestion[]) => void;
}

const QuestionListSelectable = ({
  questions,
  selectedQuestions,
  setSelectedQuestions,
}: QuestionListSelectableProps) => {
  const isSelected = (question: IQuestion): boolean => {
    return selectedQuestions.some((item: IQuestion) => item.questionId === question.questionId);
  };

  const handleClick = (question: IQuestion) => {
    if (isSelected(question)) {
      setSelectedQuestions(
        selectedQuestions.filter((item: IQuestion) => item.questionId !== question.questionId),
      );
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  return (
    <div className='question-list'>
      {questions.map((question: IQuestion) => {
        return (
          <Question
            style={`${styles['question__selectable']} ${
              isSelected(question) ? styles['question--selected'] : ''
            }`}
            key={question.questionId}
            question={question}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default QuestionListSelectable;

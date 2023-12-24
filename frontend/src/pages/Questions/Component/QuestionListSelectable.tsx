import React from 'react';
import Question, { IQuestion } from 'src/pages/Questions/Component/Question';
import questionStyle from 'styles/pages/Questions/Component/Question.module.css';
import style from 'styles/pages/Questions/Component/QuestionList.module.css';

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
    <>
      {questions.length > 0 ? (
        <div className='question-list'>
          {questions.map((question: IQuestion) => {
            return (
              <Question
                style={`${questionStyle['question__selectable']} ${
                  isSelected(question) ? questionStyle['question--selected'] : ''
                }`}
                key={question.questionId}
                question={question}
                onClick={handleClick}
              />
            );
          })}
        </div>
      ) : (
        <div className={style['question-list__empty-state']}>
          <div className={style['question-list__no-results']}>
            No results found
            <br />
            We couldn't find what you're looking for
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionListSelectable;

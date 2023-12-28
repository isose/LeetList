import React from 'react';
import Spinner from 'src/components/ui/Spinner';
import Question, { IQuestion } from 'src/pages/Questions/Component/Question';
import questionStyles from 'styles/pages/Questions/Component/Question.module.css';
import styles from 'styles/pages/Questions/Component/QuestionList.module.css';

interface QuestionListSelectableProps {
  loading: boolean;
  questions: IQuestion[];
  selectedQuestions: IQuestion[];
  setSelectedQuestions: (questions: IQuestion[]) => void;
}

const QuestionListSelectable = ({
  loading,
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
        <div className={styles['question-list']}>
          {loading && <Spinner />}
          {questions.map((question: IQuestion) => {
            return (
              <Question
                style={`${questionStyles['question__selectable']} ${
                  isSelected(question) ? questionStyles['question--selected'] : ''
                }`}
                key={question.questionId}
                question={question}
                onClick={handleClick}
              />
            );
          })}
        </div>
      ) : (
        <div className={styles['question-list__empty-state']}>
          {loading && <Spinner />}
          <div className={styles['question-list__empty-state__message']}>
            No results found
            <br />
            We couldn&apos;t find what you&apos;re looking for
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionListSelectable;

import Question from 'pages/Questions/Component/Question';
import React from 'react';
import styles from 'styles/pages/Questions/Component/Question.module.css';

const QuestionListSelectable = ({ questions, selectedQuestions, setSelectedQuestions }: any) => {
  const isSelected = (question: any): boolean => {
    return selectedQuestions.some((item: any) => item.questionId === question.questionId);
  };

  const handleClick = (question: any) => {
    if (isSelected(question)) {
      setSelectedQuestions(
        selectedQuestions.filter((item: any) => item.questionId !== question.questionId),
      );
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  return (
    <div className='question-list'>
      {questions.map((question: any) => {
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

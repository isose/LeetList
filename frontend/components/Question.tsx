import React from 'react';
import TagList from './TagList';

const Question = (question: any) => {
  return (
    <div className='Question'>
      <span>
        <a href={question.url}>
          {question.questionId}
          {'. '}
          {question.title}
        </a>
      </span>
      <span>{question.difficulty} </span>
      <span>{question.upVotes} </span>
      <span>{question.downVotes} </span>
      <span>{question.numberOfAccepted} </span>
      <span>{question.numberOfSubmissions} </span>
      <TagList tags={question.tags} />
    </div>
  );
};

export default Question;

import React from 'react';
import TagList from './TagList';

const COMMA_SEPARATED_NUMBER_REGEX = /\B(?=(\d{3})+(?!\d))/g;

const Question = (question: any) => {
  const upVotes = question.upVotes?.toString().replace(COMMA_SEPARATED_NUMBER_REGEX, ',');
  const downVotes = question.downVotes?.toString().replace(COMMA_SEPARATED_NUMBER_REGEX, ',');
  const acceptance = ((question.numberOfAccepted / question.numberOfSubmissions) * 100).toFixed(2);

  return (
    <div className='question'>
      <div className='question-container'>
        <div>
          <div className='question-title'>
            <a href={question.url} target='_blank'>
              {question.questionId}
              {'. '}
              {question.title}
            </a>
          </div>
          <TagList tags={question.tags} />
        </div>
        <div>
          <div className={`difficulty difficulty-${question.difficulty.toLowerCase()}`}>
            {question.difficulty}{' '}
          </div>
          <div className='votes'>
            <div>🠉{upVotes}</div>
            <div>🠋{downVotes}</div>
          </div>
          <div className='submissions'>
            <div>acceptance: </div>
            <div>{acceptance}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;

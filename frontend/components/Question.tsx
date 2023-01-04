import React, { useEffect, useRef, useState } from 'react';
import { TiArrowDownThick, TiArrowUpThick } from 'react-icons/ti';
import TagList from './TagList';
import Tooltip from './ui/Tooltip';

const COMMA_SEPARATED_NUMBER_REGEX = /\B(?=(\d{3})+(?!\d))/g;

const Question = (question: any) => {
  const title = `${question.questionId}. ${question.title}`;
  const upVotes = question.upVotes?.toString().replace(COMMA_SEPARATED_NUMBER_REGEX, ',');
  const downVotes = question.downVotes?.toString().replace(COMMA_SEPARATED_NUMBER_REGEX, ',');
  const acceptance = ((question.numberOfAccepted / question.numberOfSubmissions) * 100).toFixed(2);

  const [isOverflowed, setIsOverflowed] = useState(false);
  const textElementRef = useRef<any>();

  const checkOverflow = () => {
    setIsOverflowed(textElementRef.current.scrollWidth > textElementRef.current.clientWidth);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
  }, []);

  useEffect(
    () => () => {
      window.removeEventListener('resize', checkOverflow);
    },
    [],
  );

  return (
    <div className='question'>
      <div className='question-wrapper-left'>
        <Tooltip text={title} disabled={!isOverflowed}>
          <div className='question-title'>
            <a
              className='truncate'
              href={question.url}
              target='_blank'
              rel='noreferrer'
              ref={textElementRef}
            >
              {title}
            </a>
          </div>
        </Tooltip>
        <TagList tags={question.tags} />
      </div>
      <div>
        <div className={`difficulty difficulty-${question.difficulty.toLowerCase()}`}>
          {question.difficulty}
        </div>
        <div className='votes'>
          <div className='svg-container'>
            <TiArrowUpThick />
            {upVotes}
          </div>
          <div className='svg-container'>
            <TiArrowDownThick />
            {downVotes}
          </div>
        </div>
        <div className='submissions'>
          <div>acceptance: </div>
          <div>{acceptance}%</div>
        </div>
      </div>
    </div>
  );
};

export default Question;

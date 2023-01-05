import React, { useEffect, useRef, useState } from 'react';
import { TiArrowDownThick, TiArrowUpThick } from 'react-icons/ti';
import styles from '../styles/components/Question.module.css';
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
    <div className={styles.question}>
      <div className={styles['question__wrapper-left']}>
        <Tooltip text={title} disabled={!isOverflowed}>
          <div className={styles['question__title']}>
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
        <div
          className={`${styles['question__difficulty']} ${
            styles[`question__difficulty--${question.difficulty.toLowerCase()}`]
          }`}
        >
          {question.difficulty}
        </div>
        <div className={styles['question__votes']}>
          <div className='svg-container'>
            <TiArrowUpThick />
            {upVotes}
          </div>
          <div className='svg-container'>
            <TiArrowDownThick />
            {downVotes}
          </div>
        </div>
        <div className={styles['question__submissions']}>
          <div>acceptance: </div>
          <div>{acceptance}%</div>
        </div>
      </div>
    </div>
  );
};

export default Question;

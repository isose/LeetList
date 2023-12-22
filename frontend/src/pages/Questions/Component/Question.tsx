import React from 'react';
import { TiArrowDownThick, TiArrowUpThick } from 'react-icons/ti';
import useOverflow from 'src/hooks/useOverflow';
import { ITag } from 'src/pages/Questions/Component/Tag';
import TagList from 'src/pages/Questions/Component/TagList';
import styles from 'styles/pages/Questions/Component/Question.module.css';

const COMMA_SEPARATED_NUMBER_REGEX = /\B(?=(\d{3})+(?!\d))/g;

export interface IQuestion {
  difficulty: string;
  downVotes: number;
  numberOfAccepted: number;
  numberOfSubmissions: number;
  questionId: string;
  tags: ITag[];
  title: string;
  upVotes: number;
  url: string;
}

interface QuestionProps {
  question: IQuestion;
  style?: string;
  onClick?: (question: IQuestion) => void;
}

const Question = ({ question, style, onClick }: QuestionProps) => {
  const title = `${question.questionId}. ${question.title}`;
  const upVotes = question.upVotes?.toString().replace(COMMA_SEPARATED_NUMBER_REGEX, ',');
  const downVotes = question.downVotes?.toString().replace(COMMA_SEPARATED_NUMBER_REGEX, ',');
  const acceptance = ((question.numberOfAccepted / question.numberOfSubmissions) * 100).toFixed(2);

  const [overflow, textElementRef] = useOverflow();

  return (
    <div
      className={`${styles.question}${style !== undefined ? ' ' + style : ''}`}
      data-testid='question'
      onClick={() => {
        onClick && onClick(question);
      }}
    >
      <div className={styles['question__wrapper-left']}>
        <div className={styles['question__title']} data-testid='question__title'>
          <a
            className='truncate'
            href={question.url}
            target='_blank'
            rel='noreferrer'
            ref={textElementRef}
            title={overflow ? title : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </a>
        </div>
        <TagList tags={question.tags} />
      </div>
      <div>
        <div
          className={`${styles['question__difficulty']} ${
            styles[`question__difficulty--${question.difficulty.toLowerCase()}`]
          }`}
          data-testid={`question__difficulty--${question.difficulty.toLowerCase()}`}
        >
          {question.difficulty}
        </div>
        <div className={styles['question__votes']} data-testid='question__votes'>
          <div className='svg-container'>
            <TiArrowUpThick />
            {upVotes}
          </div>
          <div className='svg-container'>
            <TiArrowDownThick />
            {downVotes}
          </div>
        </div>
        <div className={styles['question__submissions']} data-testid='question__submissions'>
          <div>acceptance: </div>
          <div>{acceptance}%</div>
        </div>
      </div>
    </div>
  );
};

export default Question;

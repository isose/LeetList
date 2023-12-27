import {
  DragDropContext,
  Droppable,
  type DraggableProvided,
  type DraggableRubric,
  type DraggableStateSnapshot,
  type DroppableProvided,
  type DropResult,
} from '@hello-pangea/dnd';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { BsXSquareFill } from 'react-icons/bs';
import { HiOutlineTrash } from 'react-icons/hi';
import { IoMdListBox } from 'react-icons/io';
import { RxDragHandleHorizontal } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from 'src/api/axios';
import ButtonModal from 'src/components/modal/ButtonModal';
import CustomButtonModal from 'src/components/modal/CustomButtonModal';
import UnsavedChangesModal from 'src/components/modal/UnsavedChangesModal';
import ToggleSwitch from 'src/components/ui/ToggleSwitch';
import VirtualList from 'src/components/ui/VirtualList';
import useAuth from 'src/hooks/useAuth';
import useOverflow from 'src/hooks/useOverflow';
import LoginForm from 'src/pages/Login/Component/LoginForm';
import { IQuestion } from 'src/pages/Questions/Component/Question';
import { ITag } from 'src/pages/Questions/Component/Tag';
import { reorder } from 'src/utils/utils';
import styles from 'styles/pages/Questions/Component/CreateListSidepanel.module.css';

export interface ListState {
  name: string;
  private: boolean;
  id?: string;
  questions: IQuestion[];
}

interface CreateListPanelHeaderProps {
  listState: ListState;
  setListState: Dispatch<ListState>;
  toggleCollapsed: () => void;
}

const CreateListPanelHeader = ({
  listState,
  setListState,
  toggleCollapsed,
}: CreateListPanelHeaderProps) => {
  const questionCount = listState.questions.length;

  const clearQuestions = () => {
    setListState({ ...listState, questions: [] });
  };

  return (
    <div className={styles['create-list-panel__header']}>
      <CustomButtonModal
        button={<BsXSquareFill size={33} />}
        buttonStyle={styles['sidepanel__icon']}
        modalContents={
          <UnsavedChangesModal
            handleDiscard={() => {
              setListState({ name: '', private: false, questions: [] });
              toggleCollapsed();
            }}
          />
        }
        testid='close-button'
      />
      <div className={styles['create-list-panel__header-wrapper']}>
        <h1>{listState.id ? 'Edit LeetList' : 'New LeetList'}</h1>
        {questionCount > 0 && (
          <>
            <div
              className={styles['create-list-panel__header-counter']}
              data-testid='create-list-panel__header-counter'
            >
              <span>{questionCount}</span>
            </div>
            <div className={styles['create-list-panel__header-clear']} onClick={clearQuestions}>
              Clear
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface QuestionListProps {
  listState: ListState;
  setListState: Dispatch<ListState>;
}

const QuestionList = ({ listState, setListState }: QuestionListProps) => {
  const removeQuestion = useCallback(
    (item: IQuestion) => {
      setListState({
        ...listState,
        questions: listState.questions.filter(
          (question: IQuestion) => item.questionId !== question.questionId,
        ),
      });
    },
    [listState.questions],
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }
    setListState({
      ...listState,
      questions: reorder(listState.questions, result.source.index, result.destination.index),
    });
  };

  return listState.questions.length > 0 ? (
    <>
      <div className={`${styles['question-list--outer']} ${styles['question-list--border']}`}>
        <div className={styles['question-list--inner']}>
          <div className={styles['question-list']}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId='question-list'
                mode='virtual'
                renderClone={(
                  provided: DraggableProvided,
                  snapshot: DraggableStateSnapshot,
                  rubric: DraggableRubric,
                ) => (
                  <Question
                    item={listState.questions[rubric.source.index]}
                    provided={provided}
                    isDragging={snapshot.isDragging}
                    index={rubric.source.index}
                    props={{}}
                    style={{ margin: 0 }}
                  />
                )}
              >
                {(droppableProvided: DroppableProvided) => (
                  <VirtualList
                    items={listState.questions}
                    component={Question}
                    props={{ removeQuestion: removeQuestion }}
                    droppableProvided={droppableProvided}
                  />
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
      <DifficultyCounter listState={listState} />
    </>
  ) : (
    <div className={styles['question-list__empty-state']}>
      <div className={styles['question-list__empty-state__message']}>
        Your list is currently empty
        <br />
        Select some questions to add to your list
      </div>
    </div>
  );
};

const Question = (props: any) => {
  const { item, index, style, provided, isDragging } = props;
  const { ref, removeQuestion } = props.props;

  const [questionTitleOverflow, questionTitleRef] = useOverflow();
  const [questionTagsOverflow, questionTagsRef] = useOverflow();

  const getQuestionTitle = (question: IQuestion): string => {
    return `${question.questionId}. ${question.title}`;
  };

  const getQuestionTags = (question: IQuestion): string => {
    let tags = '';
    question.tags.map((tag: ITag) => (tags = tags.concat(tag.tagName, ', ')));
    return tags.slice(0, -2);
  };

  const questionTitle = getQuestionTitle(item);
  const questionTags = getQuestionTags(item);

  const getTitleAttribute = (title: string, enabled: boolean): string | undefined => {
    return enabled ? title : undefined;
  };

  return (
    <div
      className={styles['question-list__item-border']}
      {...provided.draggableProps}
      ref={provided.innerRef}
      data-is-dragging={isDragging}
      data-index={index}
      style={{ ...style, ...provided.draggableProps.style }}
    >
      <div className={styles['question-list__item']} data-testid='question-list__item' ref={ref}>
        <div className={styles[`question-list__item--${item.difficulty.toLowerCase()}`]} />
        <div className={styles['question-list__item-handle-container']}>
          <div {...provided.dragHandleProps}>
            <RxDragHandleHorizontal className={styles['grab-cursor']} size={20} />
          </div>
        </div>
        <div className={styles['question-list__item-container']}>
          <div className={styles['question-list__item-header']}>
            <a
              className='truncate'
              href={item.url}
              target='_blank'
              rel='noreferrer'
              ref={questionTitleRef}
              title={getTitleAttribute(questionTitle, questionTitleOverflow)}
            >
              {questionTitle}
            </a>
            <div data-testid='remove-button'>
              <HiOutlineTrash
                className={styles['pointer-cursor']}
                size={20}
                color='red'
                onClick={() => removeQuestion(item)}
              />
            </div>
          </div>
          <div
            className={`${styles['question-list__item-tags']} truncate`}
            ref={questionTagsRef}
            title={getTitleAttribute(questionTags, questionTagsOverflow)}
          >
            {questionTags}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DifficultyCount {
  [key: string]: number;
}

interface DifficultyCounterProps {
  listState: ListState;
}

const DifficultyCounter = ({ listState }: DifficultyCounterProps) => {
  const [difficultyCount, setDifficultyCount] = useState<DifficultyCount>({});

  useEffect(() => {
    const getDifficultyCount = () => {
      const difficultyCount: DifficultyCount = { easy: 0, medium: 0, hard: 0 };
      listState.questions.map((question: IQuestion) => {
        difficultyCount[question.difficulty.toLowerCase()]++;
      });
      return difficultyCount;
    };

    setDifficultyCount(getDifficultyCount());
  }, [listState.questions]);

  return (
    <div className={styles['difficulty-counter']}>
      <div className={styles['difficulty-counter--inner']}>
        {Object.keys(difficultyCount).map((difficulty, index) => {
          return (
            difficultyCount[difficulty] > 0 && (
              <div key={index} className={styles['difficulty-counter__item']}>
                <span className={styles[`color--${difficulty}`]}>{difficulty}:</span>{' '}
                {difficultyCount[difficulty]}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

interface CreateListFormProps {
  listState: ListState;
  setListState: Dispatch<ListState>;
}

const CreateListForm = ({ listState, setListState }: CreateListFormProps) => {
  const navigate = useNavigate();

  const [listNameError, setListNameError] = useState<string>('');

  useEffect(() => {
    setListNameError('');
  }, [listState.name]);

  const setPrivateList = (privateStatus: boolean) => {
    setListState({ ...listState, private: privateStatus });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (listNameError) {
      return;
    }

    if (listState.name === '') {
      setListNameError('List name cannot be empty.');
      return;
    }

    if (listState.name.length > 255) {
      setListNameError('List name maximum length is 255.');
      return;
    }

    try {
      const questions = listState.questions.map((question: IQuestion, index: number) => ({
        questionId: question.questionId,
        index,
      }));

      let res: any = {};
      if (listState.id) {
        res = await axiosPrivate.put(`/api/list/${listState.id}`, {
          ...listState,
          questions,
        });
      } else {
        res = await axiosPrivate.post(
          '/api/list',
          JSON.stringify({
            ...listState,
            questions,
          }),
        );
      }
      navigate(`/list/${res.data.location}`);
    } catch (err: any) {
      if (err?.response) {
        const data = err.response.data;
        setListNameError(data.listName);
      }
    }
  };

  return (
    <form className={styles['create-list-panel__form']} onSubmit={handleSubmit}>
      <label>List name</label>
      <input
        className={listNameError ? styles.invalid : ''}
        placeholder='list name'
        defaultValue={listState.name}
        onChange={(e) => setListState({ ...listState, name: e.target.value })}
      />
      {listNameError && <p>{listNameError}</p>}
      <ToggleSwitch
        style={styles['toggle-switch']}
        height={20}
        value={listState.private}
        setValue={setPrivateList}
        label='private list'
      />
      <button disabled={listNameError !== ''}>{listState.id ? 'Save changes' : 'Create'}</button>
    </form>
  );
};

const CreateListLoginForm = () => {
  return (
    <div className={styles['create-list-panel__form']}>
      <label>Login to create a list.</label>
      <ButtonModal text={'Login'}>
        <LoginForm />
      </ButtonModal>
    </div>
  );
};

interface CreateListSidepanelProps {
  listState: ListState;
  setListState: Dispatch<ListState>;
}

const CreateListSidepanel = ({ listState, setListState }: CreateListSidepanelProps) => {
  const { isLoggedIn } = useAuth();

  const [collapsed, setCollasped] = useState<boolean>(true);

  useEffect(() => {
    if (collapsed && (listState.id || listState.questions.length > 0)) {
      setCollasped(false);
    }
  }, [listState.questions]);

  const toggleCollapsed = () => setCollasped(!collapsed);

  const display = (visible: boolean): { display: string } => {
    return { display: visible ? 'flex' : 'none' };
  };

  return (
    <div className={styles.sidepanel} data-testid='sidepanel'>
      <div
        className={styles['sidepanel__icon']}
        data-testid='sidepanel__icon'
        style={display(collapsed)}
        onClick={() => {
          toggleCollapsed();
        }}
      >
        <IoMdListBox size={42} />
        <span>New list</span>
      </div>
      {!collapsed && (
        <div className={styles['create-list-panel']} data-testid='create-list-panel'>
          <CreateListPanelHeader
            listState={listState}
            setListState={setListState}
            toggleCollapsed={toggleCollapsed}
          />
          <QuestionList listState={listState} setListState={setListState} />
          {isLoggedIn?.() ? (
            <CreateListForm listState={listState} setListState={setListState} />
          ) : (
            <CreateListLoginForm />
          )}
        </div>
      )}
    </div>
  );
};

export default CreateListSidepanel;

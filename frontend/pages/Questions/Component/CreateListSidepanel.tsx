import {
  DragDropContext,
  Droppable,
  type DraggableProvided,
  type DraggableRubric,
  type DraggableStateSnapshot,
  type DroppableProvided,
  type DropResult,
} from '@hello-pangea/dnd';
import { axiosPrivate } from 'api/axios';
import ButtonModal from 'components/modal/ButtonModal';
import CustomButtonModal from 'components/modal/CustomButtonModal';
import UnsavedChangesModal from 'components/modal/UnsavedChangesModal';
import ToggleSwitch from 'components/ui/ToggleSwitch';
import VirtualList from 'components/ui/VirtualList';
import useAuth from 'hooks/useAuth';
import useOverflow from 'hooks/useOverflow';
import LoginForm from 'pages/Login/Component/LoginForm';
import React, { useCallback, useEffect, useState } from 'react';
import { BsXSquareFill } from 'react-icons/bs';
import { HiOutlineTrash } from 'react-icons/hi';
import { IoMdListBox } from 'react-icons/io';
import { RxDragHandleHorizontal } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import styles from 'styles/pages/Questions/Component/CreateListSidepanel.module.css';
import { reorder } from 'utils/utils';

const CreateListPanelHeader = ({ listState, setListState, toggleCollapsed }: any) => {
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
      />
      <div className={styles['create-list-panel__header-wrapper']}>
        <h1>{listState.id ? 'Edit Leetlist' : 'New Leetlist'}</h1>
        {questionCount > 0 && (
          <>
            <div className={styles['create-list-panel__header-counter']}>
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

const QuestionList = ({ listState, setListState }: any) => {
  const removeQuestion = useCallback(
    (item: any) => {
      setListState({
        ...listState,
        questions: listState.questions.filter(
          (question: any) => item.questionId !== question.questionId,
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
    <div className={styles['question-list__empty-prompt']}>
      Your list is currently empty. Select some questions to add to your list.
    </div>
  );
};

const Question = (props: any) => {
  const { item, index, style, provided, isDragging } = props;
  const { ref, removeQuestion } = props.props;

  const [questionTitleOverflow, questionTitleRef] = useOverflow();
  const [questionTagsOverflow, questionTagsRef] = useOverflow();

  const getQuestionTitle = (question: any): string => {
    return `${question.questionId}. ${question.title}`;
  };

  const getQuestionTags = (question: any): string => {
    let tags = '';
    question.tags.map((tag: any) => (tags = tags.concat(tag.tagName, ', ')));
    return tags.slice(0, -2);
  };

  const questionTitle = getQuestionTitle(item);
  const questionTags = getQuestionTags(item);

  const getTitleAttribute = (title: string, enabled: boolean) => {
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
      <div className={styles['question-list__item']} ref={ref}>
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
            <div>
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

const DifficultyCounter = ({ listState }: any) => {
  const [difficultyCount, setDifficultyCount] = useState<any>({});

  useEffect(() => {
    const getDifficultyCount = () => {
      const difficultyCount: any = { easy: 0, medium: 0, hard: 0 };
      listState.questions.map((question: any) => {
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

const CreateListForm = ({ listState, setListState }: any) => {
  const navigate = useNavigate();

  const [listNameError, setListNameError] = useState('');

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
      const questions = listState.questions.map((question: any, index: number) => ({
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

const CreateListSidepanel = ({ listState, setListState }: any) => {
  const { isLoggedIn } = useAuth();

  const [collapsed, setCollasped] = useState(true);

  useEffect(() => {
    if (collapsed && (listState.id || listState.questions.length > 0)) {
      setCollasped(false);
    }
  }, [listState.questions]);

  const toggleCollapsed = () => setCollasped(!collapsed);

  const display = (visible: boolean) => {
    return { display: visible ? 'flex' : 'none' };
  };

  return (
    <div className={styles.sidepanel}>
      <div
        className={styles['sidepanel__icon']}
        style={display(collapsed)}
        onClick={() => {
          toggleCollapsed();
        }}
      >
        <IoMdListBox size={42} />
        <span>New list</span>
      </div>
      {!collapsed && (
        <div className={styles['create-list-panel']}>
          <CreateListPanelHeader
            listState={listState}
            setListState={setListState}
            toggleCollapsed={toggleCollapsed}
          />
          <QuestionList listState={listState} setListState={setListState} />
          {isLoggedIn() ? (
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

import React, { Dispatch, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosPrivate } from 'src/api/axios';
import ButtonModal from 'src/components/modal/ButtonModal';
import ErrorModal from 'src/components/modal/ErrorModal';
import ToggleSwitch from 'src/components/ui/ToggleSwitch';
import useAuth from 'src/hooks/useAuth';
import useOverflow from 'src/hooks/useOverflow';
import Error from 'src/pages/Error/Error';
import NotFound from 'src/pages/Error/NotFound';
import { IQuestion } from 'src/pages/Questions/Component/Question';
import QuestionList from 'src/pages/Questions/Component/QuestionList';
import { formatDate } from 'src/utils/utils';
import modalStyles from 'styles/components/modal/Modal.module.css';
import styles from 'styles/pages/List/List.module.css';

interface DeleteListModalProps {
  setError: Dispatch<boolean>;
  toggleOpen?: () => void;
}

const DeleteListModal = ({ setError, toggleOpen }: DeleteListModalProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const deleteList = async () => {
    try {
      await axiosPrivate.delete(`/api/list/${id}`);
      navigate('/my-lists');
    } catch (err) {
      setError(true);
      toggleOpen!();
    }
  };

  return (
    <div className={modalStyles.modal}>
      <h2>Delete list?</h2>
      <p>This list will be permanently deleted. This action cannot be undone.</p>
      <div className={modalStyles['modal__footer']}>
        <button
          className={modalStyles.button}
          onClick={async () => {
            await deleteList();
          }}
        >
          Delete
        </button>
        <button className={modalStyles.button} onClick={toggleOpen}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export interface IList {
  createdAt?: string;
  id?: string;
  name?: string;
  private?: boolean;
  username?: string;
}

const List = () => {
  const { id } = useParams();
  const { auth } = useAuth();

  const navigate = useNavigate();

  const [noPrivateAccess, setNoPrivateAccess] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [list, setList] = useState<IList>({});
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const [displayEditMenu, setDisplayEditMenu] = useState<boolean>(false);
  const [privateList, setPrivateList] = useState<boolean>();

  const [overflow, textElementRef] = useOverflow();

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    setDisplayEditMenu(auth?.username == list.username);
  }, [list]);

  const updateList = async (value: boolean) => {
    try {
      list.private = value;
      await axiosPrivate.put(`/api/list/${id}`, { ...list });
    } catch (err) {
      setError(true);
    }
  };

  const fetchList = async () => {
    try {
      const res = await axiosPrivate.get(`/api/list/${id}`);
      setList(res.data.questionList);
      setPrivateList(res.data.questionList.private);
      setQuestions(res.data.questions);
    } catch (err: any) {
      const status = err.response.status;
      switch (status) {
        case 403:
          setNoPrivateAccess(true);
          break;
        case 404:
          setNotFound(true);
          break;
        default:
      }
    }
  };

  const handleEdit = () => {
    navigate('/', { state: { ...list, questions } });
  };

  return (
    <>
      <ErrorModal open={error} setOpen={setError} />
      {noPrivateAccess && (
        <Error
          title={'403 Forbidden'}
          message={'You do not have access to view this private list.'}
          buttonText={'Back to lists'}
          path={'/lists'}
        />
      )}
      {notFound && <NotFound />}
      {!noPrivateAccess && !notFound && (
        <div className={styles.list}>
          <div className={styles['list__wrapper']}>
            <div className={styles['list__name']} data-testid='list__name'>
              <h1
                className='truncate'
                ref={textElementRef}
                title={overflow ? list.name : undefined}
              >
                {list.name}
              </h1>
            </div>
            <div className={styles['list__info']}>
              <span data-testid='user'>{list.username}</span>
              <span data-testid='date'>{formatDate(list.createdAt!)}</span>
            </div>
            {displayEditMenu ? (
              <div className={styles['list__edit-menu']}>
                <ToggleSwitch
                  style={styles['toggle-switch']}
                  height={20}
                  value={privateList}
                  setValue={setPrivateList}
                  label='private list'
                  onChange={updateList}
                />
                <button className={styles.button} onClick={handleEdit}>
                  Edit
                </button>
                <ButtonModal style={styles.button} text={'Delete'}>
                  <DeleteListModal setError={setError} />
                </ButtonModal>
              </div>
            ) : (
              <></>
            )}
            {questions.length > 0 ? (
              <QuestionList questions={questions} />
            ) : (
              <div className={styles['list__empty-state']}>
                <div className={styles['list__empty-state__message']}>
                  This list currently does not contain any questions
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default List;

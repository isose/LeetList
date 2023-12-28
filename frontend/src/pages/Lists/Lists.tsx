import React, { CSSProperties, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { axiosPrivate } from 'src/api/axios';
import SpanModal from 'src/components/modal/SpanModal';
import PaginationButtons from 'src/components/pagination/PaginationButtons';
import SearchBar from 'src/components/search/SearchBar';
import Dropdown from 'src/components/ui/Dropdown';
import Spinner from 'src/components/ui/Spinner';
import VirtualList from 'src/components/ui/VirtualList';
import useAuth from 'src/hooks/useAuth';
import useOverflow from 'src/hooks/useOverflow';
import usePagination from 'src/hooks/usePagination';
import { IList } from 'src/pages/List/List';
import { LISTS_SORT_ORDER } from 'src/pages/Lists/ListsEnum';
import LoginForm from 'src/pages/Login/Component/LoginForm';
import { formatDate } from 'src/utils/utils';
import styles from 'styles/pages/Lists/Lists.module.css';
import { useDebounce } from 'use-debounce';

const List = (props: any) => {
  const { item, style }: { item: IList; style: CSSProperties } = props;
  const { ref } = props.props;

  const [overflow, textElementRef] = useOverflow();

  return (
    <div className={styles.list} data-testid='list' ref={ref} style={style}>
      <div className={styles['list__name']} data-testid='list__name'>
        <Link
          to={`../list/${item.id}`}
          className='truncate'
          ref={textElementRef}
          title={overflow ? item.name : undefined}
        >
          {item.name}
        </Link>
      </div>
      <div className={styles['list__footer']}>
        <span data-testid='user'>{item.username}</span>
        <span data-testid='date'>{formatDate(item.createdAt!)}</span>
      </div>
    </div>
  );
};

interface ListsContentsProps {
  lists: IList[];
  search: string;
}

const ListsContents = ({ lists, search }: ListsContentsProps): JSX.Element => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  if (lists.length > 0) {
    return <VirtualList items={lists} component={List} />;
  }

  let Message = (
    <>
      No results found
      <br />
      We couldn&apos;t find what you&apos;re looking for
    </>
  );

  if (location.pathname == '/my-lists' && !isLoggedIn?.()) {
    Message = (
      <>
        <SpanModal text='Login'>
          <LoginForm from={'/my-lists'} />
        </SpanModal>{' '}
        to view your lists
      </>
    );
  } else if (location.pathname == '/my-lists' && search === '') {
    Message = (
      <>
        You have not created any lists yet
        <br />
        Navigate to <Link to='/'>questions page</Link> to create a new list
      </>
    );
  }

  return (
    <div className={styles['lists__container__empty-state']}>
      <div className={styles['lists__container__empty-state__message']}>{Message}</div>
    </div>
  );
};

const Lists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const getSearchUrlParam = (): string => {
    const searchParam = searchParams.get('search');
    return searchParam ? searchParam : '';
  };

  const limit = 20;
  const [page, setPage, totalPages, setTotalPages] = usePagination();
  const [search, setSearch] = useState<string>(getSearchUrlParam());
  const [debouncedSearch] = useDebounce(search, 250);
  const [sortOrder, setSortOrder] = useState<{ text: string; value: string }>({
    text: LISTS_SORT_ORDER.NEW,
    value: LISTS_SORT_ORDER.NEW,
  });
  const [lists, setLists] = useState<IList[]>([]);
  const [listsLoading, setListsLoading] = useState<boolean>(true);

  const queryParams = `/?page=${page - 1}&limit=${limit}&search=${debouncedSearch}&sort=${
    sortOrder.value
  }`;

  useEffect(() => {
    fetchLists();
    updateUrlParams();
  }, [location.pathname, page, debouncedSearch, sortOrder, isLoggedIn]);

  const fetchLists = async () => {
    setListsLoading(true);
    axiosPrivate
      .get(`/api${location.pathname}${queryParams}`)
      .then((res) => {
        setLists(res.data.results);
        setListsLoading(false);

        const pages = Math.ceil(res.data.total / limit);
        setTotalPages(Math.max(pages, 1));
      })
      .catch((err) => {
        setLists([]);
        setListsLoading(false);
        setTotalPages(1);
      });
  };

  const updateUrlParams = () => {
    searchParams.set('page', page.toString());

    if (debouncedSearch.length === 0) {
      searchParams.delete('search');
    } else {
      searchParams.set('search', debouncedSearch);
    }

    searchParams.set('sort', sortOrder.value);

    setSearchParams(searchParams);
  };

  const switchTabs = (path: string) => {
    navigate(path);
    setPage(1);
    setSearch('');
  };

  const getTabSelectedStyle = (tab: string) => {
    return location.pathname === tab ? ` ${styles['lists__tab--selected']}` : '';
  };

  return (
    <div className={styles.lists}>
      <div className={styles['lists__wrapper']}>
        <div className={styles['lists__tabs']} data-testid='lists__tabs'>
          <div
            className={`${styles['lists__tab']}${getTabSelectedStyle('/lists')}`}
            onClick={() => switchTabs('/lists')}
          >
            All
          </div>
          <div
            className={`${styles['lists__tab']}${getTabSelectedStyle('/my-lists')}`}
            onClick={() => switchTabs('/my-lists')}
          >
            My lists
          </div>
        </div>
        <div
          className={`${styles['lists__body']}${
            location.pathname !== '/lists' ? ` ${styles['rounded-border']}` : ''
          }`}
        >
          <div className={styles['lists__search-wrapper']}>
            <SearchBar input={search} setInput={setSearch} placeholder='Search Lists' />
            <Dropdown
              selected={sortOrder}
              setSelected={setSortOrder}
              optionsEnum={LISTS_SORT_ORDER}
              width={165}
            />
          </div>
          <div className={styles['lists__container']}>
            {listsLoading && <Spinner />}
            <ListsContents lists={lists} search={debouncedSearch} />
          </div>
          <div className={styles['pagination-buttons']}>
            <PaginationButtons
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              numberOfButtons={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lists;

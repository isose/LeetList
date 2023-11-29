import { axiosPrivate } from 'api/axios';
import PaginationButtons from 'components/pagination/PaginationButtons';
import SearchBar from 'components/search/SearchBar';
import Dropdown from 'components/ui/Dropdown';
import VirtualList from 'components/ui/VirtualList';
import useOverflow from 'hooks/useOverflow';
import usePagination from 'hooks/usePagination';
import { LISTS_SORT_ORDER } from 'pages/ListsEnum';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/pages/Lists.module.css';
import { useDebounce } from 'use-debounce';
import { formatDate } from 'utils/utils';

const List = (props: any) => {
  const { item, style } = props;
  const { ref } = props.props;

  const [overflow, textElementRef] = useOverflow();

  return (
    <div className={styles.list} ref={ref} style={style}>
      <div className={styles['list__name']}>
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
        <span>{item.username}</span>
        <span>{formatDate(item.createdAt)}</span>
      </div>
    </div>
  );
};

const Lists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const getSearchUrlParam = () => {
    const searchParam = searchParams.get('search');
    return searchParam ? searchParam : '';
  };

  const limit = 20;
  const [page, setPage, totalPages, setTotalPages] = usePagination();
  const [search, setSearch] = useState(getSearchUrlParam());
  const [debouncedSearch] = useDebounce(search, 250);
  const [sortOrder, setSortOrder] = useState({
    text: LISTS_SORT_ORDER.NEW,
    value: LISTS_SORT_ORDER.NEW,
  });
  const [lists, setLists] = useState([]);

  const queryParams = `/?page=${page - 1}&limit=${limit}&search=${debouncedSearch}&sort=${
    sortOrder.value
  }`;

  useEffect(() => {
    fetchLists();
    updateUrlParams();
  }, [location.pathname, page, debouncedSearch, sortOrder]);

  const fetchLists = async () => {
    try {
      const res = await axiosPrivate.get(`/api${location.pathname}${queryParams}`);
      setLists(res.data.results);

      const pages = Math.ceil(res.data.total / limit);
      setTotalPages(Math.max(pages, 1));
    } catch (err) {
      setLists([]);
      setTotalPages(1);
    }
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
        <div className={styles['lists__tabs']}>
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
            <VirtualList items={lists} component={List} />
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

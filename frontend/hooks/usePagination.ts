import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const usePagination = () => {
  const getPageUrlParam = () => {
    const pageParam = searchParams.get('page');
    if (pageParam && Number(pageParam) > 0) {
      return Number(pageParam);
    }
    return 1;
  };

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(getPageUrlParam());
  const [totalPages, setTotalPages] = useState<number | null>(null);

  useEffect(() => {
    handlePageBounds();
  }, [totalPages]);

  const handlePageBounds = () => {
    if (totalPages !== null && page > totalPages) {
      setPage(totalPages);
    }
  };

  return [page, setPage, totalPages, setTotalPages] as const;
};

export default usePagination;

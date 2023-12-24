import { useEffect, useState } from 'react';

const useLocalStorage = (key: string, initialValue: any) => {
  const valueJson = localStorage.getItem(key);
  const [value, setValue] = useState<any>(
    valueJson !== null ? JSON.parse(valueJson) : initialValue,
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;

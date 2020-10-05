import { useState, useEffect } from 'react';

export default function usePersistentState(key, defaultValue) {

  const [state, setState] = useState(() => {
    const persistentState = localStorage.getItem(key);
    return persistentState ? JSON.parse(persistentState) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
};

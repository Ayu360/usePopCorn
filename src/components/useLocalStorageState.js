import { useEffect, useState } from "react";

export function useLocalStorageState(intialState, key) {
  const [value, setvalue] = useState(() => {
    const storageData = localStorage.getItem(key);
    console.log(storageData);
    return storageData ? JSON.parse(storageData) : intialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setvalue];
}

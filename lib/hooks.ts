import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<TParams, TResult = void>(
  callback: (value: TParams) => TResult | Promise<TResult>,
  value: TParams,
  delay: number,
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, callback]);
}

export function useSearch<T>(
  callback: (value: string) => Promise<T[]> | T[],
  search: string,
  delay: number,
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setResults] = useState<T[]>([]);

  useDebouncedCallback(
    async (searchValue) => {
      try {
        setIsLoading(true);
        const results = await callback(searchValue);
        setResults(results);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    search,
    delay,
  );
  return { isLoading, data };
}

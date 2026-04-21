import { useEffect, useState } from 'react';
import { fetchRequest } from '@/shared/api';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { addNotification } from '@/entities/notifications';

const API_URL = import.meta.env.VITE_API_URL;

export const parseFetchError = (error: unknown) => {
  if (
    error instanceof Error ||
    (typeof error === 'object' && error !== null && (error as any).message)
  ) {
    return (error as any).message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'Something went wrong';
  }
};

export default function useRequest<T>(
  url: string,
  init: RequestInit,
  onSubmitSuccess?: (response?: T) => void,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();

    const requestData = async () => {
      setIsLoading(true);

      try {
        const result = await fetchRequest<T>(`${API_URL}/${url}`, init);

        setData(result);

        onSubmitSuccess?.(result);
      } catch (error) {
        dispatch(addNotification({ type: 'error', text: parseFetchError(error) }));
      } finally {
        setIsLoading(false);
      }
    };

    requestData();

    return () => controller.abort();
  }, [url, init]);

  return { isLoading, data };
}

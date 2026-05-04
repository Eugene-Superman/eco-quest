import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { addNotification } from '@/entities/notifications';

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

export default function useRequest<TResponse>(
  requestCallback: () => Promise<TResponse>,
  onSubmitSuccess?: (response?: TResponse) => void,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TResponse>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();

    const requestData = async () => {
      setIsLoading(true);

      try {
        const result = await requestCallback();

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
  }, []);

  return { isLoading, data };
}

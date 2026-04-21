import { useState } from 'react';
import { fetchRequest } from '@/shared/api';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { addNotification } from '@/entities/notifications';
import { parseFetchError } from './useRequest';

const API_URL = import.meta.env.VITE_API_URL;

export default function useMutationRequest<TResponse, TRequest extends object>(
  url: string,
  init: RequestInit,
  onSubmitSuccess?: (response?: TResponse) => void,
) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const mutate = async (requestData: TRequest) => {
    setIsLoading(true);

    try {
      const result = await fetchRequest<TResponse>(`${API_URL}/${url}`, {
        ...init,
        body: JSON.stringify(requestData),
      });

      onSubmitSuccess?.(result);
    } catch (error) {
      dispatch(addNotification({ type: 'error', text: parseFetchError(error) }));
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, mutate };
}

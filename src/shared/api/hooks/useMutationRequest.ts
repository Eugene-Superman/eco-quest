import { useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { addNotification } from '@/entities/notifications';
import { parseFetchError } from './useRequest';

export default function useMutationRequest<TRequestBody extends object, TResponse>(
  requestCallback: (data: TRequestBody) => Promise<TResponse>,
  onSubmitSuccess?: (response: TResponse) => void,
) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const mutate = async (requestData: TRequestBody) => {
    setIsLoading(true);

    try {
      const result = await requestCallback(requestData);

      onSubmitSuccess?.(result);
    } catch (error) {
      dispatch(addNotification({ type: 'error', text: parseFetchError(error) }));
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, mutate };
}

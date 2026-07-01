import { useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { addNotification } from '@/entities/notifications';
import { parseFetchError } from './useRequest';

type MutationOptions<TResponse> = {
  onSuccess?: (response: TResponse) => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
};

export default function useMutationRequest<TRequestBody extends object, TResponse>(
  requestCallback: (data: TRequestBody) => Promise<TResponse>,
  { onSuccess, onError, onSettled }: MutationOptions<TResponse> = {},
) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const mutate = async (requestData?: TRequestBody) => {
    setIsLoading(true);

    try {
      const result = await requestCallback(requestData as TRequestBody);

      onSuccess?.(result);
    } catch (error) {
      console.log('error', error);
      dispatch(addNotification({ type: 'error', text: parseFetchError(error) }));
      onError?.(error);
    } finally {
      setIsLoading(false);
      onSettled?.();
    }
  };

  return { isLoading, mutate };
}

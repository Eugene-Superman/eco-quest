import { setUserToStore } from '@/entities/user';
import useMutationRequest from '@/shared/api/hooks/useMutationRequest';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import type { UserAccessData } from '../auth.types';

export default function useAuth<TRequest extends object, TResponse extends UserAccessData>(
  requestFn: (data: TRequest) => Promise<TResponse>,
  onSubmitSuccess?: (data?: TResponse) => void,
) {
  const dispatch = useAppDispatch();

  const saveUserData = (accessData: TResponse) => {
    dispatch(setUserToStore(accessData));
    onSubmitSuccess?.(accessData);
  };

  return useMutationRequest(requestFn, { onSuccess: saveUserData });
}

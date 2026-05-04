import { setUserToStore, type UserAccessData } from '@/entities/user';
import { accessTokenProvider } from '@/shared/api';
import useMutationRequest from '@/shared/api/hooks/useMutationRequest';
import { useAppDispatch } from '@/shared/lib/hooks/redux';

export default function useAuth<TRequest extends object, TResponse extends UserAccessData>(
  requestFn: (data: TRequest) => Promise<TResponse>,
  onSubmitSuccess?: (data?: TResponse) => void,
) {
  const dispatch = useAppDispatch();

  const saveUserData = (accessData: TResponse) => {
    dispatch(setUserToStore(accessData.user));

    if (accessData.accessToken) {
      accessTokenProvider.setToken(accessData.accessToken);
    }

    onSubmitSuccess?.(accessData);
  };

  return useMutationRequest(requestFn, saveUserData);
}

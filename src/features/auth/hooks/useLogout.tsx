import useMutationRequest from '@/shared/api/hooks/useMutationRequest';
import { authApi } from '../authApi';
import { accessTokenProvider } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { userStorage } from '@/entities/user';

export default function useLogout() {
  const { isLoading, mutate } = useMutationRequest(authApi.logout, {
    onSettled: () => {
      // localStorage survives the reload — clear it explicitly, or the seeded
      // store would resurrect the logged-out user on the next boot.
      userStorage.clear();
      accessTokenProvider.clear();
      window.location.replace(ROUTES.LOGIN);
    },
  });

  return { isLoggingOut: isLoading, logout: mutate };
}

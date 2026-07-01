import { setUserToStore, resetUserStore, type IUser } from '@/entities/user';
import useMutationRequest from '@/shared/api/hooks/useMutationRequest';
import { useAppDispatch } from '@/shared/lib/hooks/redux';

import { authApi } from '../authApi';
import { useEffect } from 'react';

export default function useRestoreSession() {
  const dispatch = useAppDispatch();

  const saveUserData = (user: IUser | null) => {
    // Restore resolved: real user -> store + cache; no session -> drop the
    // (possibly stale) seed so a dead session doesn't leave a ghost user.
    dispatch(user ? setUserToStore(user) : resetUserStore());
  };

  const { isLoading, mutate } = useMutationRequest(authApi.refresh, { onSuccess: saveUserData });

  useEffect(() => {
    mutate();
  }, []);

  return isLoading;
}

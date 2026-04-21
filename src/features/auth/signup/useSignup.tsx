import { useState } from 'react';
import { requestImitation } from '@/shared/api';
import { type UserAccessData, type UserRole } from '@/entities/user/model';
import { setAccessTokenToStore, setUserToStore } from '@/entities/user/model/userSlice';
import type { ISignupForm } from './signupTypes';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import useMutationRequest from '@/shared/api/hooks/useMutationRequest';

export default function useSignup() {
  const dispatch = useAppDispatch();

  const saveUser = (accessData?: UserAccessData) => {
    if (!accessData) {
      return;
    }
    dispatch(setUserToStore(accessData.user));
    dispatch(setAccessTokenToStore(accessData.accessToken));
  };

  const { isLoading, mutate } = useMutationRequest<UserAccessData>(
    'signup',
    { method: 'POST' },
    saveUser,
  );

  return { isLoading, mutate };
}

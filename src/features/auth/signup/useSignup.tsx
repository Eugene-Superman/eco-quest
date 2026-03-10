import { useState } from 'react';
import { requestImitation } from '@/shared/api';
import { type UserRole } from '@/entities/user/model';
import { setAccessTokenToStore, setUserToStore } from '@/entities/user/model/userSlice';
import { useDispatch } from 'react-redux';
import type { ISignupForm } from './signupTypes';

const mockUserState = {
  user: {
    fullname: 'Test Smith',
    nickname: 'Quasimodo',
    email: 'test@test.test',
    role: 'participant' as UserRole,
  },
  accessToken: 'test-token',
};

export default function useSignup(onSubmitSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const signupRequest = async (formData: Omit<ISignupForm, 'repeatPassword'>) => {
    setIsLoading(true);

    try {
      const result = await requestImitation(mockUserState);
      if (!result) {
        throw new Error('Registration Error');
      }

      dispatch(setUserToStore(result.user));
      dispatch(setAccessTokenToStore(result.accessToken));

      onSubmitSuccess?.();
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, signupRequest };
}

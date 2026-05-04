import { createAsyncThunk } from '@reduxjs/toolkit';
import { requestImitation } from '@/shared/api';
import type { UserAccessData } from './userTypes';

const mockUserState: UserAccessData = {
  user: {
    fullname: 'Test Smith',
    nickname: 'Quasimodo',
    email: 'test@test.test',
    role: 'participant',
  },
};

const guestUserState: UserAccessData = {
  user: {
    nickname: 'guest',
    email: '-',
    role: 'visitor',
  },
};

export const refreshUserData = createAsyncThunk('user/refresh-token', async (_, api) => {
  const loggedUserState: UserAccessData | null = await requestImitation(null);

  return loggedUserState || guestUserState;
});

import type { IUser, UserState } from '@/entities/user';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { userStorage } from './userStorage';

const emptyState: UserState = {};
// Seed from the display cache so the Header renders the real user immediately,
// before session restore resolves. Restore reconciles / overwrites it.
const initialState: UserState = { user: userStorage.get() };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    resetAll: () => emptyState,
  },
});

export const { setUser: setUserToStore, resetAll: resetUserStore } = userSlice.actions;

export default userSlice.reducer;

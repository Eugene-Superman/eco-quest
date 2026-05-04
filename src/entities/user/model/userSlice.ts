import type { IUser, UserState } from '@/entities/user';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { refreshUserData } from './thunks';

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    resetAll: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(refreshUserData.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
  },
});

export const { setUser: setUserToStore, resetAll: resetAllUserStore } = userSlice.actions;

export default userSlice.reducer;

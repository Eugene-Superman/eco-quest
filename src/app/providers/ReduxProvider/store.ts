import { tokenListenerMiddleware } from '@/app/middlewares';
import { userReducer } from '@/entities/user/model';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: { user: userReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(tokenListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

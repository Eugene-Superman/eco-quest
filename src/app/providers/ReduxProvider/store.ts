import { notificationReducer } from '@/entities/notifications';
import { userReducer, userPersistMiddleware } from '@/entities/user';
import { challengesReducer } from '@/pages/challenges/model';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: { user: userReducer, challenges: challengesReducer, notifications: notificationReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(userPersistMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

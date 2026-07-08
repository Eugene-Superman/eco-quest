import type { PropsWithChildren } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { notificationReducer } from '@/entities/notifications';
import { userReducer } from '@/entities/user';

// A per-test store with the slices middle-layer tests touch (user + notifications)
// and no persist middleware, so tests never write to localStorage.
export const createTestStore = () =>
  configureStore({ reducer: { user: userReducer, notifications: notificationReducer } });

// Returns a fresh store and a matching <Provider> wrapper for render()/renderHook().
export const storeWrapper = (store = createTestStore()) => ({
  store,
  wrapper: ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>,
});

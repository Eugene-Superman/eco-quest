import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setUserToStore, resetUserStore } from './userSlice';
import { userStorage } from './userStorage';

// Keeps the display-only localStorage cache in sync with the user slice:
// write on every user update, drop it on reset.
export const userPersistMiddleware = createListenerMiddleware();

userPersistMiddleware.startListening({
  actionCreator: setUserToStore,
  effect: (action) => userStorage.set(action.payload),
});

userPersistMiddleware.startListening({
  actionCreator: resetUserStore,
  effect: () => userStorage.clear(),
});

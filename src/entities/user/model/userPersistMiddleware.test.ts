import { configureStore } from '@reduxjs/toolkit';
import type { IUser } from './userTypes';
import userReducer, { setUserToStore, resetUserStore } from './userSlice';
import { userPersistMiddleware } from './userPersistMiddleware';
import { userStorage } from './userStorage';

const user: IUser = {
  fullname: 'Ada Lovelace',
  nickname: 'ada',
  email: 'ada@example.com',
  role: 'participant',
};

// Minimal store wired with just the user slice + the persist listener, so the
// test exercises the middleware in isolation from the real app store.
const makeStore = () =>
  configureStore({
    reducer: { user: userReducer },
    middleware: (getDefault) => getDefault().prepend(userPersistMiddleware.middleware),
  });

describe('userPersistMiddleware', () => {
  beforeEach(() => {
    vi.spyOn(userStorage, 'set').mockImplementation(() => {});
    vi.spyOn(userStorage, 'clear').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes the user to storage on setUserToStore', () => {
    const store = makeStore();

    store.dispatch(setUserToStore(user));

    expect(userStorage.set).toHaveBeenCalledTimes(1);
    expect(userStorage.set).toHaveBeenCalledWith(user);
    expect(userStorage.clear).not.toHaveBeenCalled();
  });

  it('clears storage on resetUserStore', () => {
    const store = makeStore();

    store.dispatch(resetUserStore());

    expect(userStorage.clear).toHaveBeenCalledTimes(1);
    expect(userStorage.set).not.toHaveBeenCalled();
  });
});

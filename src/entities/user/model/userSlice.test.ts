import type { IUser, UserState } from './userTypes';
import reducer, { setUserToStore, resetUserStore } from './userSlice';

const user: IUser = {
  fullname: 'Ada Lovelace',
  nickname: 'ada',
  email: 'ada@example.com',
  role: 'participant',
};

describe('userSlice', () => {
  it('setUser puts the user into state', () => {
    const next = reducer({}, setUserToStore(user));

    expect(next.user).toEqual(user);
  });

  it('setUser overwrites an already-present user', () => {
    const other: IUser = { ...user, nickname: 'grace', email: 'grace@example.com' };

    const next = reducer({ user }, setUserToStore(other));

    expect(next.user).toEqual(other);
  });

  it('resetAll clears the user back to an empty state', () => {
    const state: UserState = { user };

    const next = reducer(state, resetUserStore());

    expect(next).toEqual({});
    expect(next.user).toBeUndefined();
  });
});

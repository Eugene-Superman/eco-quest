import type { PropsWithChildren } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, renderHook } from '@testing-library/react';
import { notificationReducer } from '@/entities/notifications';
import { userReducer } from '@/entities/user';
import type { UserAccessData } from '../auth.types';
import useAuth from './useAuth';

const accessData: UserAccessData = {
  nickname: 'ada',
  email: 'ada@example.com',
  role: 'participant',
  accessToken: 'token-123',
};

const setup = () => {
  const store = configureStore({
    reducer: { user: userReducer, notifications: notificationReducer },
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, wrapper };
};

describe('useAuth', () => {
  it('saves the returned user to the store on success', async () => {
    const { store, wrapper } = setup();
    const signin = vi.fn().mockResolvedValue(accessData);

    const { result } = renderHook(() => useAuth(signin), { wrapper });

    expect(store.getState().user.user).toBeUndefined();

    await act(() => result.current.mutate({ email: accessData.email, password: 'password1' }));

    expect(store.getState().user.user).toEqual(accessData);
  });

  it('forwards the response to onSubmitSuccess', async () => {
    const { wrapper } = setup();
    const signin = vi.fn().mockResolvedValue(accessData);
    const onSubmitSuccess = vi.fn();

    const { result } = renderHook(() => useAuth(signin, onSubmitSuccess), { wrapper });

    await act(() => result.current.mutate({ email: accessData.email, password: 'password1' }));

    expect(onSubmitSuccess).toHaveBeenCalledWith(accessData);
  });
});

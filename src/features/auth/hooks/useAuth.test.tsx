import { act, renderHook } from '@testing-library/react';
import { storeWrapper } from '@/shared/lib/test';
import type { UserAccessData } from '../auth.types';
import useAuth from './useAuth';

const accessData: UserAccessData = {
  nickname: 'ada',
  email: 'ada@example.com',
  role: 'participant',
  accessToken: 'token-123',
};

describe('useAuth', () => {
  it('saves the returned user to the store on success', async () => {
    const { store, wrapper } = storeWrapper();
    const signin = vi.fn().mockResolvedValue(accessData);

    const { result } = renderHook(() => useAuth(signin), { wrapper });

    expect(store.getState().user.user).toBeUndefined();

    await act(() => result.current.mutate({ email: accessData.email, password: 'password1' }));

    expect(store.getState().user.user).toEqual(accessData);
  });

  it('forwards the response to onSubmitSuccess', async () => {
    const { wrapper } = storeWrapper();
    const signin = vi.fn().mockResolvedValue(accessData);
    const onSubmitSuccess = vi.fn();

    const { result } = renderHook(() => useAuth(signin, onSubmitSuccess), { wrapper });

    await act(() => result.current.mutate({ email: accessData.email, password: 'password1' }));

    expect(onSubmitSuccess).toHaveBeenCalledWith(accessData);
  });
});

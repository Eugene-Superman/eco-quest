import type { PropsWithChildren } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, renderHook } from '@testing-library/react';
import { notificationReducer } from '@/entities/notifications';
import { userReducer } from '@/entities/user';
import { muteConsole } from '@/shared/lib/test';
import useMutationRequest from './useMutationRequest';

// Fresh store per test + a Provider wrapper, since the hook uses useAppDispatch.
const setup = () => {
  const store = configureStore({
    reducer: { user: userReducer, notifications: notificationReducer },
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, wrapper };
};

describe('useMutationRequest', () => {
  it('starts idle', () => {
    const { wrapper } = setup();
    const { result } = renderHook(() => useMutationRequest(vi.fn()), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });

  it('on success: shows loading, then calls onSuccess and settles', async () => {
    const { wrapper } = setup();
    const requestFn = vi.fn().mockResolvedValue({ id: 1 });
    const onSuccess = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderHook(
      () => useMutationRequest(requestFn, { onSuccess, onSettled }),
      { wrapper },
    );

    // setIsLoading(true) runs synchronously before the awaited request, so we
    // observe the loading state by checking before awaiting the mutation.
    let mutatePromise!: Promise<void>;
    act(() => {
      mutatePromise = result.current.mutate({ name: 'Ada' });
    });
    expect(result.current.isLoading).toBe(true);

    await act(() => mutatePromise);

    expect(result.current.isLoading).toBe(false);
    expect(requestFn).toHaveBeenCalledWith({ name: 'Ada' });
    expect(onSuccess).toHaveBeenCalledWith({ id: 1 });
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it('on error: dispatches an error notification, calls onError and onSettled', async () => {
    const restore = muteConsole();
    const { wrapper, store } = setup();
    const requestFn = vi.fn().mockRejectedValue(new Error('Nope'));
    const onError = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderHook(
      () => useMutationRequest(requestFn, { onError, onSettled }),
      { wrapper },
    );

    await act(() => result.current.mutate({}));

    const { notificationList } = store.getState().notifications;
    expect(notificationList).toHaveLength(1);
    expect(notificationList[0]).toMatchObject({ type: 'error', text: 'Nope' });
    expect(onError).toHaveBeenCalledWith(new Error('Nope'));
    expect(onSettled).toHaveBeenCalledTimes(1);

    restore();
  });
});

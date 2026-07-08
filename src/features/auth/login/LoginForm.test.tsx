import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { storeWrapper } from '@/shared/lib/test';
import { authApi } from '../authApi';
import type { UserAccessData } from '../auth.types';
import LoginForm from './LoginForm';

const accessData: UserAccessData = {
  nickname: 'ada',
  email: 'ada@example.com',
  role: 'participant',
  accessToken: 'token-123',
};

const renderForm = () => {
  const { store, wrapper } = storeWrapper();
  return { store, ...render(<LoginForm />, { wrapper }) };
};

describe('LoginForm', () => {
  afterEach(() => vi.restoreAllMocks());

  it('blocks submit and shows required errors when fields are empty', async () => {
    const signin = vi.spyOn(authApi, 'signin');
    const user = userEvent.setup();

    renderForm();
    // The form is `noValidate`, so native constraints don't preempt submit —
    // an empty submit reaches yup and surfaces one required error per field.
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findAllByText('This field is required')).toHaveLength(2);
    expect(signin).not.toHaveBeenCalled();
  });

  it('calls authApi.signin with the entered credentials on a valid submit', async () => {
    const signin = vi.spyOn(authApi, 'signin').mockResolvedValue(accessData);
    const user = userEvent.setup();

    renderForm();
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'password1');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() =>
      expect(signin).toHaveBeenCalledWith({
        email: 'ada@example.com',
        password: 'password1',
      }),
    );
  });
});

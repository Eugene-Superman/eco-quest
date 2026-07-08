import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { storeWrapper } from '@/shared/lib/test';
import { authApi } from '../authApi';
import type { UserAccessData } from '../auth.types';
import SignupForm from './SignupForm';

const accessData: UserAccessData = {
  nickname: 'ada',
  email: 'ada@example.com',
  role: 'participant',
  accessToken: 'token-123',
};

const renderForm = () => {
  const { store, wrapper } = storeWrapper();
  return { store, ...render(<SignupForm />, { wrapper }) };
};

// Fills every field required for a valid submit; overrides let a test bend one.
const fillValid = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Email'), 'ada@example.com');
  await user.type(screen.getByLabelText('Nickname'), 'ada');
  await user.type(screen.getByLabelText('Password'), 'password1');
  await user.type(screen.getByLabelText('Repeat Password'), 'password1');
};

describe('SignupForm', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows a required error per required field and blocks submit when empty', async () => {
    const signup = vi.spyOn(authApi, 'signup');
    const user = userEvent.setup();

    renderForm();
    await user.click(screen.getByRole('button', { name: /create account/i }));

    // email, nickname, password, repeatPassword are required; fullname is optional
    expect(await screen.findAllByText('This field is required')).toHaveLength(4);
    expect(signup).not.toHaveBeenCalled();
  });

  it('blocks submit when the passwords do not match', async () => {
    const signup = vi.spyOn(authApi, 'signup');
    const user = userEvent.setup();

    renderForm();
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Nickname'), 'ada');
    await user.type(screen.getByLabelText('Password'), 'password1');
    await user.type(screen.getByLabelText('Repeat Password'), 'different1');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Passwords must match')).toBeInTheDocument();
    expect(signup).not.toHaveBeenCalled();
  });

  it('submits without repeatPassword on a valid form', async () => {
    const signup = vi.spyOn(authApi, 'signup').mockResolvedValue(accessData);
    const user = userEvent.setup();

    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(signup).toHaveBeenCalledTimes(1));
    const payload = signup.mock.calls[0][0];
    expect(payload).toMatchObject({
      email: 'ada@example.com',
      nickname: 'ada',
      password: 'password1',
    });
    expect(payload).not.toHaveProperty('repeatPassword');
  });
});

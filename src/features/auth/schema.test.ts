import { signupSchema } from './schema';

const validSignup = {
  email: 'ada@example.com',
  password: 'password1',
  nickname: 'ada',
  repeatPassword: 'password1',
};

describe('signupSchema', () => {
  // Our cross-field rule (yup.ref), not a yup built-in — easy to break silently.
  it('rejects when repeatPassword does not match password', async () => {
    await expect(
      signupSchema.validate({ ...validSignup, repeatPassword: 'different1' }),
    ).rejects.toThrow('Passwords must match');
  });

  // Guards the loginSchema.concat(...) composition — signup must keep login's rules.
  it('still enforces the inherited login rules (invalid email)', async () => {
    await expect(
      signupSchema.validate({ ...validSignup, email: 'bad' }),
    ).rejects.toThrow('Email is not valid');
  });
});

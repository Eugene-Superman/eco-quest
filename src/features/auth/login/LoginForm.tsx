import { InputField } from '@/shared/lib/forms/InputField';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import type { ILoginForm } from './loginTypes';
import useLogin from './useLogin';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../schema';

interface Props {
  onSubmitSuccess?: () => void;
}

export default function LoginForm({ onSubmitSuccess }: Props) {
  const methods = useForm<ILoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { isLoading, loginRequest } = useLogin(onSubmitSuccess);

  const onSubmit: SubmitHandler<ILoginForm> = (data) => loginRequest(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <InputField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={isLoading}
          required
        />
        <InputField
          type="password"
          label="Password"
          name="password"
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading}>
          Log in
        </button>
      </form>
    </FormProvider>
  );
}

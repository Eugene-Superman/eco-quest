import { InputField } from '@/shared/lib/forms/InputField';
import { Button } from '@/shared/ui';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import type { ILoginForm } from './loginTypes';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../schema';
import { authApi } from '../authApi';
import useAuth from '../hooks/useAuth';
import styles from '../ui/auth.module.css';

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

  const { isLoading, mutate } = useAuth(authApi.signin, onSubmitSuccess);
  const onSubmit: SubmitHandler<ILoginForm> = (data) => mutate(data);

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <InputField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isLoading}
          required
        />
        <InputField
          type="password"
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isLoading}
          required
        />
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </FormProvider>
  );
}

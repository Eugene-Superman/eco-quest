import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputField, type InputFieldProps } from '@/shared/lib/forms';
import { Button } from '@/shared/ui';
import { signupSchema } from '../schema';
import type { ISignupForm } from './signupTypes';
import { authApi } from '../authApi';
import useAuth from '../hooks/useAuth';
import styles from '../ui/auth.module.css';

const fieldsList: InputFieldProps<ISignupForm>[] = [
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
  },
  { label: 'Nickname', name: 'nickname' },
  { label: 'Full Name', name: 'fullname' },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    label: 'Repeat Password',
    name: 'repeatPassword',
    type: 'password',
  },
];

interface Props {
  onSubmitSuccess?: () => void;
}

export default function SignupForm({ onSubmitSuccess }: Props) {
  const methods = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      fullname: '',
      nickname: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const { isLoading, mutate } = useAuth(authApi.signup, onSubmitSuccess);
  const onSubmit: SubmitHandler<ISignupForm> = ({ repeatPassword, ...data }) => mutate(data);

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
        {fieldsList.map((field) => (
          <InputField key={field.name} {...field} disabled={isLoading} />
        ))}
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </FormProvider>
  );
}

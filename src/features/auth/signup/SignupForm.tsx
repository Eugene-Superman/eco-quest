import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputField, type InputFieldProps } from '@/shared/lib/forms';
import { signupSchema } from '../schema';
import type { ISignupForm } from './signupTypes';
import useSignup from './useSignup';

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
  const { isLoading, signupRequest } = useSignup(onSubmitSuccess);

  const onSubmit: SubmitHandler<ISignupForm> = ({ repeatPassword, ...data }) => signupRequest(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {fieldsList.map((field) => (
          <InputField key={field.name} {...field} disabled={isLoading} />
        ))}
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
    </FormProvider>
  );
}

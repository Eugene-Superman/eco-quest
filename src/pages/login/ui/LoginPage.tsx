import { InputField } from '@/shared/lib/forms/InputField';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';

interface IFormInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  const methods = useForm<IFormInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <div>
      <FormProvider {...methods}>
        <h2>Log in</h2>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputField label="Email" name="email" type="email" autoComplete="email" required />
          <InputField type="password" label="Password" name="password" required />
          <button type="submit">Log in</button>
        </form>
      </FormProvider>
    </div>
  );
}

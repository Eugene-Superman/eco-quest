import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import { InputField } from './InputField';

type Values = { email: string };

// Renders the field inside a real react-hook-form context, optionally seeding a
// field error so we can assert the error branch.
function renderField({ error }: { error?: string } = {}) {
  function Harness() {
    const methods = useForm<Values>({ defaultValues: { email: '' } });

    useEffect(() => {
      if (error) methods.setError('email', { type: 'manual', message: error });
    }, []);

    return (
      <FormProvider {...methods}>
        <InputField<Values> name="email" label="Email" />
      </FormProvider>
    );
  }

  return render(<Harness />);
}

describe('InputField', () => {
  it('renders the label and a valid input by default', () => {
    renderField();

    expect(screen.getByText('Email')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText('Email is not valid')).not.toBeInTheDocument();
  });

  it('shows the error message and marks the input invalid when the field errors', async () => {
    renderField({ error: 'Email is not valid' });

    expect(await screen.findByText('Email is not valid')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

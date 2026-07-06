import clsx from 'clsx';
import { get, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import styles from './InputField.module.css';

export interface InputFieldProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: Path<T>;
}

export function InputField<T extends FieldValues>({
  label = '',
  name,
  className,
  ...inputAttributes
}: InputFieldProps<T>) {
  const { register, formState } = useFormContext<T>();

  const error = get(formState.errors, name);
  const errorMessage = typeof error?.message === 'string' ? error.message : null;

  return (
    <label className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        className={clsx(styles.input, { [styles.inputError]: !!errorMessage }, className)}
        aria-invalid={!!errorMessage}
        {...register(name)}
        {...inputAttributes}
      />
      {!!errorMessage && <span className={styles.error}>{errorMessage}</span>}
    </label>
  );
}

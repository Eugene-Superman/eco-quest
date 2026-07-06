import clsx from 'clsx';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/** Reusable button. Defaults to a solid primary action. */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        { [styles.fullWidth]: fullWidth },
        className,
      )}
      {...rest}
    />
  );
}

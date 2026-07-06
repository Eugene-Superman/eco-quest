import { Container } from '@/shared/ui';
import styles from './auth.module.css';

interface Props {
  title: string;
  subtitle?: string;
  /** Rendered under the form — typically a link to the other auth screen. */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/** Centered card shell shared by the login and signup screens. */
export function AuthCard({ title, subtitle, footer, children }: Props) {
  return (
    <Container className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </Container>
  );
}

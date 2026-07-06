import { ROUTES } from '@/shared/config';
import clsx from 'clsx';
import { Link } from 'react-router';
import styles from './Logo.module.css';

interface Props {
  /** Hide the wordmark, show only the leaf mark. */
  iconOnly?: boolean;
  className?: string;
}

/** Eco Quest brand mark: leaf glyph + wordmark, links home. */
export function Logo({ iconOnly = false, className }: Props) {
  return (
    <Link to={ROUTES.HOME} className={clsx(styles.logo, className)} aria-label="Eco Quest — home">
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M6.05 8.05c-2.73 2.73-2.73 7.17 0 9.9C7.4 15.6 9.8 13 12 11c-1.9 2.4-3.4 5.2-4.2 8.3 2.5 1 5.4.5 7.4-1.5C18.4 14.5 20 4 20 4S9.5 4.6 6.05 8.05z" />
        </svg>
      </span>
      {!iconOnly && <span className={styles.wordmark}>Eco Quest</span>}
    </Link>
  );
}

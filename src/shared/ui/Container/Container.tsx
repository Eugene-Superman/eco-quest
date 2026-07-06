import clsx from 'clsx';
import styles from './Container.module.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a different element (e.g. 'section', 'main'). Defaults to 'div'. */
  as?: React.ElementType;
}

/**
 * Horizontal layout wrapper: caps content at --container-max and centers it with
 * consistent side padding. Full-bleed surfaces (Header/Footer) put their background
 * on the outer element and use Container for the inner row.
 */
export function Container({ as: Tag = 'div', className, ...rest }: Props) {
  return <Tag className={clsx(styles.container, className)} {...rest} />;
}

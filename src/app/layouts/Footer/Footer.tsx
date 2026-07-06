import { ROUTES } from '@/shared/config';
import { Container, Logo } from '@/shared/ui';
import { Link } from 'react-router';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>Small actions, greener planet.</p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <Link to={ROUTES.HOME} className={styles.link}>
            Home
          </Link>
          <Link to={ROUTES.CHALLENGES} className={styles.link}>
            Challenges
          </Link>
        </nav>

        <p className={styles.copyright}>© {new Date().getFullYear()} Eco Quest</p>
      </Container>
    </footer>
  );
}

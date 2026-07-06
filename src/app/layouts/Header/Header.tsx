import type { IUser, UserRole } from '@/entities/user';
import useLogout from '@/features/auth/hooks/useLogout';
import { ROUTES } from '@/shared/config';
import { Container, Logo } from '@/shared/ui';
import clsx from 'clsx';
import { NavLink } from 'react-router';
import styles from './Header.module.css';

type NavItem = { path: string; title: string; end?: boolean };

const home: NavItem = { path: ROUTES.HOME, title: 'Home', end: true };
const challenges: NavItem = { path: ROUTES.CHALLENGES, title: 'Challenges' };
const dashboard: NavItem = { path: ROUTES.DASHBOARD, title: 'Dashboard' };

// Primary nav per role. Guests get only Home here — Login/Sign Up render as
// dedicated action buttons on the right.
const navItems: Partial<Record<UserRole, NavItem[]>> = {
  admin: [home, challenges, dashboard],
  moderator: [home, challenges, dashboard],
  participant: [home, challenges, dashboard],
};

interface Props {
  user?: IUser;
}

export function Header({ user }: Props) {
  const { isLoggingOut, logout } = useLogout();
  const navList = (user && navItems[user.role]) || [home];

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Logo />

        <nav className={styles.nav} aria-label="Primary">
          {navList.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                clsx(styles.navLink, { [styles.navLinkActive]: isActive })
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <span className={styles.greeting}>
                Hi, <strong>{user.nickname}</strong>
              </span>
              <button
                type="button"
                className={styles.logout}
                disabled={isLoggingOut}
                onClick={logout}
              >
                {isLoggingOut ? 'Logging out…' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <NavLink to={ROUTES.LOGIN} className={styles.loginLink}>
                Login
              </NavLink>
              <NavLink to={ROUTES.SIGN_UP} className={styles.signupBtn}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}

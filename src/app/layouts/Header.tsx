import type { IUser, UserRole } from '@/entities/user';
import useLogout from '@/features/auth/hooks/useLogout';
import logo from '@/shared/assets/react.svg';
import { ROUTES } from '@/shared/config';
import { Link } from 'react-router';

type NavItem = { path: string; title: string };

const home = { path: ROUTES.HOME, title: 'Home' };
const challenges = { path: ROUTES.CHALLENGES, title: 'Challenges' };

const guestNavItems: NavItem[] = [
  home,
  { path: ROUTES.LOGIN, title: 'Login' },
  { path: ROUTES.SIGN_UP, title: 'Sign Up' },
];

const navItems: Partial<Record<UserRole, NavItem[]>> = {
  admin: [home, challenges],
  moderator: [home, challenges],
  participant: [home, challenges],
};

interface Props {
  user?: IUser;
}

export function Header({ user }: Props) {
  const { isLoggingOut, logout } = useLogout();
  const navList = (user && navItems[user.role]) || guestNavItems;

  return (
    <header>
      <img src={logo} alt="Logo" />
      <p>Hello, {user?.nickname || 'Guest'}</p>
      <nav>
        {navList.map((nav, i) => (
          <Link key={i} to={nav.path}>
            {nav.title}
          </Link>
        ))}
      </nav>
      {!!user && (
        <button disabled={isLoggingOut} onClick={logout}>
          Logout
        </button>
      )}
    </header>
  );
}

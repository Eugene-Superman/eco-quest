import type { UserRole } from '@/entities/user/model';
import logo from '@/shared/assets/react.svg';
import { ROUTES } from '@/shared/config';
import { Link } from 'react-router';

const home = { path: ROUTES.HOME, title: 'Home' };

const navItems = {
  admin: [home],
  moderator: [home],
  participant: [home],
  visitor: [
    { path: ROUTES.LOGIN, title: 'Login' },
    { path: ROUTES.SIGN_UP, title: 'Sign Up' },
  ],
};

interface Props {
  userRole?: UserRole;
}

export function Header({ userRole }: Props) {
  return (
    <header>
      <img src={logo} alt="Logo" />
      {!!userRole && (
        <nav>
          {navItems[userRole].map((nav, i) => (
            <Link key={i} to={nav.path}>
              {nav.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

import type { UserRole } from '@/entities/user';
import logo from '@/shared/assets/react.svg';
import { ROUTES } from '@/shared/config';
import { Link } from 'react-router';

const home = { path: ROUTES.HOME, title: 'Home' };
const challenges = { path: ROUTES.CHALLENGES, title: 'Challenges' };

const navItems = {
  admin: [home, challenges],
  moderator: [home, challenges],
  participant: [home, challenges],
  visitor: [
    { path: ROUTES.LOGIN, title: 'Login' },
    { path: ROUTES.SIGN_UP, title: 'Sign Up' },
    challenges,
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

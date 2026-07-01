import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { ROUTES } from '@/shared/config';

export default function GuestRoute() {
  const user = useAppSelector((state) => state.user.user);

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}

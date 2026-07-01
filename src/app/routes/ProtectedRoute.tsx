import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { ROUTES } from '@/shared/config';
import type { UserRole } from '@/entities/user';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <Outlet />;
}

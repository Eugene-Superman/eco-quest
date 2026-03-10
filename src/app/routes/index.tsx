import { ROUTES } from '@/shared/config';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router';
import AppLayout from '../layouts/AppLayout';
import {
  HomePage,
  LoginPage,
  SignupPage,
  NotFoundPage,
  DashboardPage,
  AdminPage,
  ForbiddenPage,
} from '@/pages';
import type { UserRole } from '@/entities/user/model';
import { store } from '../providers/ReduxProvider/store';

function loadWithLimitedRoles(rolesWithAccess: UserRole[]) {
  return function () {
    const userRole = store.getState().user.user?.role;

    if (!userRole || !rolesWithAccess.includes(userRole)) {
      throw redirect(ROUTES.FORBIDDEN);
    }
  };
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.SIGN_UP, element: <SignupPage /> },
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.ADMIN, element: <AdminPage />, loader: loadWithLimitedRoles(['admin']) },
      { path: ROUTES.FORBIDDEN, element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

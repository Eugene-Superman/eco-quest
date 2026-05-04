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
import type { UserRole } from '@/entities/user';
import { store } from '../providers/ReduxProvider/store';
import ChallengesPage from '@/pages/challenges/catalog/ui/ChallengesPage';
import DetailedPage from '@/pages/challenges/detailed/DetailedPage';

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
      { path: ROUTES.CHALLENGES, element: <ChallengesPage /> },
      { path: ROUTES.CHALLENGE_DETAILS(), element: <DetailedPage /> },
      { path: ROUTES.ADMIN, element: <AdminPage />, loader: loadWithLimitedRoles(['admin']) },
      { path: ROUTES.FORBIDDEN, element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

import { ROUTES } from '@/shared/config';
import { createBrowserRouter } from 'react-router';
import AppLayout from '../layouts/AppLayout';
import RootLayout from '../layouts/RootLayout';
import {
  HomePage,
  LoginPage,
  SignupPage,
  NotFoundPage,
  DashboardPage,
  AdminPage,
  ForbiddenPage,
} from '@/pages';
import ChallengesPage from '@/pages/challenges/catalog/ui/ChallengesPage';
import DetailedPage from '@/pages/challenges/detailed/DetailedPage';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

export const router = createBrowserRouter([
  {
    // Shared chrome (Header/Footer) for every page — no session restore here
    element: <RootLayout />,
    children: [
      // Auth entry points — no session restore.
      // GuestRoute bounces already-authenticated users back to home.
      {
        element: <GuestRoute />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.SIGN_UP, element: <SignupPage /> },
        ],
      },

      // App area — restores the session, then picks the role layout (<Outlet/> lives inside it)
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: ROUTES.CHALLENGES, element: <ChallengesPage /> },
          { path: ROUTES.CHALLENGE_DETAILS(), element: <DetailedPage /> },
          { path: ROUTES.FORBIDDEN, element: <ForbiddenPage /> },
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },

          // Role-guarded subtree
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [{ path: ROUTES.ADMIN, element: <AdminPage /> }],
          },
        ],
      },

      // 404 — shares the chrome, no restore
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

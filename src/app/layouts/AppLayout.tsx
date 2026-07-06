import { useAppSelector } from '@/shared/lib/hooks/redux';
import { Outlet } from 'react-router';
import useRestoreSession from '@/features/auth/hooks/useRestoreSession';
import { Container, Loader } from '@/shared/ui';

// Shared content shell for the app area. Role-specific chrome (e.g. an admin
// sidebar) can be layered on per role below.
function AppShell({ children }: { children?: React.ReactNode }) {
  return <Container as="section">{children ?? <Outlet />}</Container>;
}

function AdminLayout() {
  return <AppShell />;
}

function ModeratorLayout() {
  return <AppShell />;
}

function ParticipantLayout() {
  return <AppShell />;
}

function VisitorLayout() {
  return <AppShell />;
}

// Wraps only the app area: restores the session, then renders the role layout.
// Resolving identity before any role layout (and its <Outlet/>) mounts avoids the
// undefined -> role swap that would remount the routed subtree.
export default function AppLayout() {
  const isSessionRestoring = useRestoreSession();
  const user = useAppSelector((state) => state.user.user);

  if (isSessionRestoring) {
    return <Loader />;
  }

  switch (user?.role) {
    case 'admin':
      return <AdminLayout />;
    case 'moderator':
      return <ModeratorLayout />;
    case 'participant':
      return <ParticipantLayout />;
    default:
      return <VisitorLayout />;
  }
}

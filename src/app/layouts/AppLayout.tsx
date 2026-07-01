import { useAppSelector } from '@/shared/lib/hooks/redux';
import { Outlet } from 'react-router';
import useRestoreSession from '@/features/auth/hooks/useRestoreSession';
import { Loader } from '@/shared/ui';

function AdminLayout() {
  return (
    <div>
      <h1>Admin Layout</h1> <Outlet />
    </div>
  );
}

function ModeratorLayout() {
  return (
    <div>
      <h1>Moderator Layout</h1> <Outlet />
    </div>
  );
}

function ParticipantLayout() {
  return (
    <div>
      <h1>Participant Layout</h1> <Outlet />
    </div>
  );
}

function VisitorLayout() {
  return (
    <div>
      <h1>Visitor Layout</h1> <Outlet />
    </div>
  );
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

import { useAppSelector } from '@/shared/lib/hooks/redux';
import { Outlet } from 'react-router';
import { Header } from '../Header';
import { Footer } from '../Footer';
import NotificationList from '@/widgets/NotificationList/NotificationList';
import styles from './RootLayout.module.css';

// Shell shared by every page (auth pages, app pages, 404). No session restore here —
// just the chrome around the routed content.
export default function RootLayout() {
  const user = useAppSelector((state) => state.user.user);

  return (
    <>
      <Header user={user} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      {/* Overlay, rendered outside the main flow */}
      <NotificationList />
    </>
  );
}

import { useAppSelector } from '@/shared/lib/hooks/redux';
import NotificationItem from './NotificationItem';

export default function NotificationList() {
  const notificationList = useAppSelector((state) => state.notifications.notificationList);

  if (!notificationList.length) {
    return null;
  }

  return (
    <div>
      {notificationList.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}

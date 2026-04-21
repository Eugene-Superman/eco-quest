import { removeNotification } from '@/entities/notifications';
import type {
  NotificationEntity,
  NotificationType,
} from '@/entities/notifications/model/notificationsTypes';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { useEffect } from 'react';

const LIFETIME: Record<NotificationType, number> = {
  success: 3000,
  info: 4000,
  error: 0,
  warning: 5000,
};

interface Props {
  notification: NotificationEntity;
}

export default function NotificationItem({ notification }: Props) {
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(removeNotification(notification.id));

  useEffect(() => {
    const currentLifeTime = LIFETIME[notification.type];
    if (!currentLifeTime) {
      return;
    }

    const timeoutId = setTimeout(() => handleClose(), currentLifeTime);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      <p>
        {notification.type}
        <span onClick={handleClose}>X</span>
      </p>
      <p>{notification.text}</p>
    </div>
  );
}

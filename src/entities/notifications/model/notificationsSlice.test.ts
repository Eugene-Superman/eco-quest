import type { NotificationsState } from './notificationsTypes';
import reducer, {
  addNotification,
  removeNotification,
  resetAllNotifications,
} from './notificationsSlice';

const empty: NotificationsState = { notificationList: [] };

describe('notificationsSlice', () => {
  describe('addNotification', () => {
    it('appends a notification with a generated id', () => {
      const next = reducer(empty, addNotification({ type: 'error', text: 'Boom' }));

      expect(next.notificationList).toHaveLength(1);
      expect(next.notificationList[0]).toMatchObject({ type: 'error', text: 'Boom' });
      expect(next.notificationList[0].id).toEqual(expect.any(String));
    });

    it('keeps existing notifications and gives each a unique id', () => {
      const afterFirst = reducer(empty, addNotification({ type: 'info', text: 'A' }));
      const afterSecond = reducer(afterFirst, addNotification({ type: 'success', text: 'B' }));

      expect(afterSecond.notificationList).toHaveLength(2);
      const [a, b] = afterSecond.notificationList;
      expect(a.id).not.toEqual(b.id);
    });
  });

  describe('removeNotification', () => {
    it('removes only the notification with the matching id', () => {
      const seeded: NotificationsState = {
        notificationList: [
          { id: '1', type: 'info', text: 'A' },
          { id: '2', type: 'error', text: 'B' },
        ],
      };

      const next = reducer(seeded, removeNotification('1'));

      expect(next.notificationList).toEqual([{ id: '2', type: 'error', text: 'B' }]);
    });

    it('is a no-op when the id is not present', () => {
      const seeded: NotificationsState = {
        notificationList: [{ id: '1', type: 'info', text: 'A' }],
      };

      const next = reducer(seeded, removeNotification('nope'));

      expect(next.notificationList).toHaveLength(1);
    });
  });

  describe('resetAllNotifications', () => {
    it('empties the notification list', () => {
      const seeded: NotificationsState = {
        notificationList: [
          { id: '1', type: 'info', text: 'A' },
          { id: '2', type: 'error', text: 'B' },
        ],
      };

      const next = reducer(seeded, resetAllNotifications());

      expect(next.notificationList).toEqual([]);
    });
  });
});

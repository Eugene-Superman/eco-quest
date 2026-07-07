import type { IUser } from './userTypes';
import { userStorage } from './userStorage';

const USER_KEY = 'eco-quest:user';

const user: IUser = {
  fullname: 'Ada Lovelace',
  nickname: 'ada',
  email: 'ada@example.com',
  role: 'participant',
};

describe('userStorage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('set', () => {
    it('persists exactly the display fields', () => {
      userStorage.set(user);

      expect(JSON.parse(localStorage.getItem(USER_KEY)!)).toEqual(user);
    });

    it('drops any field that is not a display field', () => {
      // Types are erased at runtime — the object flowing into `set` is really a
      // UserAccessData (login response) and may carry extra props. toEqual(user)
      // asserts the full invariant: only the display fields survive, so a leaked
      // token, card number, or anything else can never reach storage.
      const withExtras = {
        ...user,
        accessToken: 'secret-token',
        cardNumber: '4111 1111 1111 1111',
        password: 'hunter2',
      };

      userStorage.set(withExtras as IUser);

      expect(JSON.parse(localStorage.getItem(USER_KEY)!)).toEqual(user);
    });

    it('swallows write failures (quota / private mode) instead of throwing', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => userStorage.set(user)).not.toThrow();
    });
  });

  describe('get', () => {
    it('round-trips a previously stored user', () => {
      userStorage.set(user);

      expect(userStorage.get()).toEqual(user);
    });

    it('returns undefined when nothing is stored', () => {
      expect(userStorage.get()).toBeUndefined();
    });

    it('returns undefined on malformed JSON instead of throwing', () => {
      localStorage.setItem(USER_KEY, '{ not json');

      expect(userStorage.get()).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('removes the stored user', () => {
      userStorage.set(user);
      userStorage.clear();

      expect(userStorage.get()).toBeUndefined();
      expect(localStorage.getItem(USER_KEY)).toBeNull();
    });
  });
});

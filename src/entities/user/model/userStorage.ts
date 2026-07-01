import type { IUser } from './userTypes';

const USER_KEY = 'eco-quest:user';

// Display-only cache of the current user, used to seed the store on boot and
// avoid a "guest" flash in the Header before session restore completes.
// NEVER stores the access token — that lives in memory only.
export const userStorage = {
  get(): IUser | undefined {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as IUser) : undefined;
    } catch {
      return undefined;
    }
  },

  set(user: IUser) {
    // Persist display fields only — strip anything else (e.g. an accessToken
    // that may ride along on the login response).
    const { fullname, nickname, email, role } = user;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify({ fullname, nickname, email, role }));
    } catch {
      // ignore quota / private-mode write failures
    }
  },

  clear() {
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  },
};

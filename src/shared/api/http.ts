import type { UserAccessData } from '@/features/auth/auth.types';
import { ROUTES } from '../config';
import { accessTokenProvider } from './accessTokenProvider';
import { fetchRequest } from './fetch/fetchRequest';
import { FetchError } from './FetchError';
import type { IUser } from '@/entities/user';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthorizationHeaders = (init: RequestInit, auth: boolean) => {
  if (!auth) {
    return init.headers;
  }

  const headers = new Headers(init.headers);
  const token = accessTokenProvider.getToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

let refreshPromise: Promise<IUser | null> | null = null;

export const refreshRequest = async () => {
  if (!refreshPromise) {
    refreshPromise = http
      .post<UserAccessData | null, {}>('auth/refresh', {}, {}, false)
      .then((userAccessData) => {
        if (!userAccessData) {
          return null;
        }

        const { accessToken, ...userData } = userAccessData;

        accessTokenProvider.setToken(accessToken);
        return userData;
      })
      .catch(() => {
        // Failed refresh means there is no valid session. Resolve to "guest"
        // silently — the caller decides the policy (restore -> guest renders,
        // 401 interceptor -> redirect to login).
        accessTokenProvider.clear();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const requestData = async <T>(url: string, init: RequestInit = {}, auth = true) => {
  const doRequest = () =>
    fetchRequest<T>(`${API_URL}/${url}`, {
      ...init,
      headers: getAuthorizationHeaders(init, auth),
    });

  try {
    return await doRequest();
  } catch (error) {
    if (auth && error instanceof FetchError && error.status === 401) {
      const refreshedUserData = await refreshRequest();
      if (refreshedUserData) {
        return doRequest();
      }
      // Mid-session request failed and the session can't be refreshed -> it's dead.
      window.location.href = ROUTES.LOGIN;
    }

    throw error;
  }
};

export const http = {
  get: <T>(url: string, init: RequestInit = {}, auth = true) =>
    requestData<T>(url, { ...init, method: 'GET' }, auth),

  post: <T, R>(url: string, data: R, init: RequestInit = {}, auth = true) =>
    requestData<T>(
      url,
      {
        ...init,
        credentials: 'include',
        headers: {
          ...init.headers,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      },
      auth,
    ),
};

import { ROUTES } from '../config';
import { accessTokenProvider } from './accessTokenProvider';
import { fetchRequest } from './fetch/fetchRequest';
import { FetchError } from './FetchError';

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

let refreshPromise: Promise<boolean> | null = null;

const refresh = async () => {
  if (!refreshPromise) {
    refreshPromise = fetchRequest<string | undefined>(`${API_URL}/refresh`)
      .then((token) => {
        if (token) {
          accessTokenProvider.setToken(token);
          return true;
        }

        return false;
      })
      .catch((error) => {
        console.log(error);
        accessTokenProvider.clear();
        window.location.href = ROUTES.LOGIN;
        return false;
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
      const isRefreshed = await refresh();
      if (isRefreshed) {
        return doRequest();
      }
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

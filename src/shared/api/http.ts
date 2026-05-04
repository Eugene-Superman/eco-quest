import { accessTokenProvider } from './accessTokenProvider';
import { fetchRequest } from './fetch/fetchRequest';

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

export const http = {
  get: <T>(url: string, init: RequestInit = {}, auth = true) =>
    fetchRequest<T>(`${API_URL}/${url}`, {
      ...init,
      headers: getAuthorizationHeaders(init, auth),
      method: 'GET',
    }),

  post: <T, R>(url: string, data: R, init: RequestInit = {}, auth = true) =>
    fetchRequest<T>(`${API_URL}/${url}`, {
      ...init,
      headers: getAuthorizationHeaders(init, auth),
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

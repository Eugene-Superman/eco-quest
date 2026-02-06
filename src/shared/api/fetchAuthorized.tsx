import { fetchRequest } from './fetchRequest';
import { accessTokenProvider } from './accessTokenProvider';

export function fetchAuthorized(url: string, init: RequestInit = {}) {
  const token = accessTokenProvider.getToken();
  const { headers, ...requestInit } = init;

  return fetchRequest(url, {
    ...requestInit,
    headers: token
      ? {
          authorization: 'Bearer ' + token,
          ...headers,
        }
      : headers,
  });
}

import { CONSTANTS } from './constants';

const SERVER_ERROR = 'ServerError';

const setRequestKey = (url: string, body?: BodyInit | null) => {
  if (!body) {
    return url;
  }

  if (body instanceof Blob) {
    return url + '-blob-size-' + body.size;
  }

  if (body instanceof FormData) {
    return url + '-' + JSON.stringify([...body.entries()]);
  }

  if (typeof body === 'string') {
    return url + '-' + body;
  }

  if (typeof body === 'object') {
    try {
      return url + '-' + JSON.stringify(body);
    } catch {
      return url;
    }
  }

  return url;
};
const abortControllerTable: Record<string, AbortController> = {};

export function fetchRequest<T>(url: string, init: RequestInit = {}, attempt: number = 0) {
  const requestKey = setRequestKey(url, init?.body);

  if (abortControllerTable[requestKey]) {
    abortControllerTable[requestKey].abort();
  }

  const controller = new AbortController();
  const signal = controller.signal;

  abortControllerTable[requestKey] = controller;

  const requestData = async (): Promise<T | undefined> => {
    try {
      const response = await fetch(url, {
        signal,
        ...init,
      });

      if (!response.ok) {
        throw new Error(
          `Error: status code is ${response.status}`,
          response.status >= 500 ? { cause: SERVER_ERROR } : undefined,
        );
      }

      if (response.status === 204) {
        return;
      }

      const parsedResponse = await response.json();
      return parsedResponse;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log(`Request is aborted: ${url}`);
        throw error;
      }

      if (
        error instanceof Error &&
        error.cause === SERVER_ERROR &&
        attempt < CONSTANTS.MAX_REFETCH_ATTEMPTS
      ) {
        const newAttemptCount = attempt + 1;
        console.warn(error.message);
        console.info(`Attempting refetch №${newAttemptCount}: ${url}`);

        await new Promise((resolve) =>
          setTimeout(() => resolve(null), CONSTANTS.BASE_TIMEOUT * 2 ** attempt),
        );
        return fetchRequest(url, init, newAttemptCount);
      }

      console.warn(error);
      throw error;
    } finally {
      if (abortControllerTable[requestKey] === controller) {
        delete abortControllerTable[requestKey];
      }
    }
  };

  return requestData();
}

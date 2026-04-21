import { CONSTANTS } from '../constants';

const SERVER_ERROR = 'ServerError';

export function fetchRequest<T>(url: string, init: RequestInit = {}, attempt = 0) {
  const requestData = async (): Promise<T | undefined> => {
    try {
      const response = await fetch(url, init);

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
        ((error instanceof Error && error.cause === SERVER_ERROR) || error instanceof TypeError) &&
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
    }
  };

  return requestData();
}

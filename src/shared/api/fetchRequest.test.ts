import { afterAll, beforeAll, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { fetchRequest } from './fetchRequest';
import { CONSTANTS } from './constants';
import { muteConsole } from '../lib/test';

vi.stubGlobal('fetch', vi.fn());

beforeEach(() => {
  vi.clearAllMocks();
});

describe('fetchRequest', () => {
  let cleanUpMuteConsole: null | (() => void) = null;

  beforeAll(() => (cleanUpMuteConsole = muteConsole()));
  afterAll(() => cleanUpMuteConsole?.());

  it('Returns parsed JSON on success', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    const result = await fetchRequest('api/test');
    expect(result).toEqual({ success: true });
  });

  it(`Retries request on server error up to ${CONSTANTS.MAX_REFETCH_ATTEMPTS} times`, async () => {
    (fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchRequest('api/test/500')).rejects.toThrow();
    expect(fetch).toHaveBeenCalledTimes(CONSTANTS.MAX_REFETCH_ATTEMPTS + 1);
  });

  it('Gets Network Error', async () => {
    const networkError = 'Network Error';
    (fetch as Mock).mockRejectedValue(new TypeError(networkError));

    await expect(fetchRequest('api/test/network-error')).rejects.toThrow(networkError);
    expect(fetch).toHaveBeenCalledTimes(CONSTANTS.MAX_REFETCH_ATTEMPTS + 1);
  });

  it("Doesn't do additional requests for 4xx errors", async () => {
    (fetch as Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad Request' }),
    });

    await expect(fetchRequest('api/test/400-error')).rejects.toThrow();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('Returns 204 response', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await fetchRequest('api/test/204');
    expect(result).toBeUndefined();
  });

  it('Returns Abort error', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    (fetch as Mock).mockRejectedValueOnce(abortError);

    await expect(fetchRequest('api/test/abort-request')).rejects.toThrow(DOMException);
  });
});

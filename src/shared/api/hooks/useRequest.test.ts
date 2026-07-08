import { parseFetchError } from './useRequest';

describe('parseFetchError', () => {
  it('returns the message of an Error instance', () => {
    expect(parseFetchError(new Error('Boom'))).toBe('Boom');
  });

  it('returns the message of a plain error-like object', () => {
    expect(parseFetchError({ message: 'Bad request' })).toBe('Bad request');
  });

  it('returns a string error as-is', () => {
    expect(parseFetchError('offline')).toBe('offline');
  });

  it('falls back for values with no usable message', () => {
    expect(parseFetchError(42)).toBe('Something went wrong');
    expect(parseFetchError(null)).toBe('Something went wrong');
    expect(parseFetchError(undefined)).toBe('Something went wrong');
  });
});

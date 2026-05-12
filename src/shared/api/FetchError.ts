import { CONSTANTS } from './constants';

export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message, status >= 500 ? { cause: CONSTANTS.SERVER_ERROR } : undefined);
    this.status = status;
  }
}

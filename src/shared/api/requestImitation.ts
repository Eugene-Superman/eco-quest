/**
 * Only for development usage.
 * Simulates a delayed async request.
 */
export const requestImitation = <T>(response: T) =>
	new Promise<T>((resolve) => setTimeout(() => resolve(response), 3000));

import { vi } from 'vitest';

export const muteConsole = () => {
  const mutes = [
    vi.spyOn(console, 'log').mockImplementation(() => {}),
    vi.spyOn(console, 'warn').mockImplementation(() => {}),
    vi.spyOn(console, 'info').mockImplementation(() => {}),
  ];

  return () => mutes.forEach((m) => m.mockRestore());
};

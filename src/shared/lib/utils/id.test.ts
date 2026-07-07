import { generateId } from './id';

describe('generateId', () => {
  it('returns a `<timestamp>-<counter>` shaped string', () => {
    expect(generateId()).toMatch(/^\d+-\d+$/);
  });

  it('produces a different id on every call', () => {
    const ids = Array.from({ length: 100 }, () => generateId());
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('monotonically increments the counter suffix', () => {
    const counterOf = (id: string) => Number(id.split('-')[1]);

    const first = counterOf(generateId());
    const second = counterOf(generateId());

    expect(second).toBe(first + 1);
  });
});

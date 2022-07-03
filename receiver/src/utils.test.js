import { key2timestamp } from './utils';

describe('test key2timestamp', () => {
  test('should convert key to timestamp', () => {
    const key = '9006193817940991';
    expect(key2timestamp(key)).toBe(1005436800000)
  })

  test('should convert key at bounds', () => {
    const lowerBoundKey = '0000000000000000';
    expect(key2timestamp(lowerBoundKey)).toBe(9007199254740991);
    const upperBoundKey = '9007199254740991';
    expect(key2timestamp(upperBoundKey)).toBe(0);
  });

  test('should error if key is out of bounds', () => {
    expect(() => key2timestamp(`${9007199254740991 + 200}`)).toThrow();
    expect(() => key2timestamp('-1')).toThrow();
  });
});
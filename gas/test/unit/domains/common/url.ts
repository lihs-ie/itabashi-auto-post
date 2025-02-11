import { URL, ValueObject } from '@/domains/common';
import 'jest-to-equal-type';
import { ValueObjectTest } from '../common';

describe('Package common', () => {
  describe('URL', () => {
    it('instantiate returns URL.', () => {
      const value = 'https://example.com';
      const url = URL({ value });

      expect(url).toEqualType<ValueObject<URL>>();
      expect(url.value).toBe(value);
    });

    const value = 'https://example.com';

    ValueObjectTest<URL>(
      URL,
      { value },
      [
        {
          value: 'https://example.com/1',
        },
      ],
      [{ value: 'invalid' }, { value: '' }, { value: 123 }]
    );
  });
});

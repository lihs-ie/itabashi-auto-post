import { Properties, ValueObject } from '../../../src/domains/common';

export const ValueObjectTest = <T>(
  generator: (properties: Properties<ValueObject<T>>) => ValueObject<T>,
  valid: Properties<ValueObject<T>>,
  variations: Array<Properties<ValueObject<T>>>,
  invalids: Array<object>
) => {
  describe('value-object', () => {
    describe('equals', () => {
      it.each(variations)(
        'returns true when the values are the same',
        variation => {
          const left = generator(variation);
          const right = generator(variation);

          expect(left.equals(right)).toBe(true);
        }
      );

      it.each(variations)(
        'returns false when the values are different',
        variation => {
          const left = generator(valid);
          const right = generator(variation);

          expect(left.equals(right)).toBe(false);
        }
      );
    });

    describe('validate', () => {
      it.each(invalids)(
        'throws zod error when the value is invalid',
        invalid => {
          expect(() => generator(invalid as any)).toThrow();
        }
      );
    });
  });
};

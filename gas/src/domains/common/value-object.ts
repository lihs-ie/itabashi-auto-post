import { z } from 'zod';

import { ExcludeFunctions, Unbrand } from '../../aspects/type';
import { sha256 } from '@/aspects/hash';

export const valueObjectSchema = <T extends z.ZodRawShape, B extends string>(
  schema: z.ZodObject<T>,
  brand: B
) =>
  schema
    .merge(
      z.object({
        hashCode: z.function().args(schema).returns(z.string()),
        equals: z.function().args(z.unknown()).returns(z.boolean()),
      })
    )
    .brand(brand);

export type ValueObject<T> = T & {
  equals: (other: T) => boolean;
  hashCode: () => string;
};

export type Properties<T> = ExcludeFunctions<Unbrand<T>>;

export const ValueObject = <T extends Record<string, unknown>>(
  properties: Properties<T>,
  validate: z.ZodBranded<z.ZodTypeAny, string>
): ValueObject<T> => {
  const isSameType = (other: unknown): other is ValueObject<T> => {
    return (
      typeof other === 'object' &&
      other !== null &&
      Object.getPrototypeOf(other) === Object.getPrototypeOf(properties)
    );
  };

  const equals = (other: unknown): boolean => {
    if (properties === other) {
      return true;
    }

    if (isSameType(other)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { equals, hashCode: Hash, ...otherProperties } = other;
      return (
        hashCode(JSON.stringify(properties)) ===
        hashCode(JSON.stringify(otherProperties))
      );
    }

    return false;
  };

  const hashCode = (message: string): string => {
    return sha256(message);
  };

  return validate.parse({
    ...properties,
    equals,
    hashCode,
  });
};

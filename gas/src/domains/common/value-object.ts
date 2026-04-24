import { z } from 'zod';

// Properties type intentionally inlined (zod 4 で Unbrand の深い再帰が型 instantiation 上限を超えるため、Extract<keyof T, string> で string キーを取り出し function を除外する形に簡素化)
import { sha256 } from '@/aspects/hash';

export const valueObjectSchema = <T extends z.ZodRawShape, B extends string>(
  schema: z.ZodObject<T>,
  brand: B
) =>
  schema
    .extend({
      hashCode: z.any(),
      equals: z.any(),
    })
    .brand(brand);

export type ValueObject<T> = T & {
  equals: (other: T) => boolean;
  hashCode: () => string;
};

type StripPrimitiveBrand<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T;

export type Properties<T> = {
  [K in Exclude<
    Extract<keyof T, string>,
    'hashCode' | 'equals' | 'verify'
  > as T[K] extends (...args: any[]) => any
    ? never
    : K]: T[K] extends (infer E)[]
    ? StripPrimitiveBrand<E>[]
    : StripPrimitiveBrand<T[K]>;
};

export const ValueObject = <T extends Record<string, unknown>>(
  properties: Properties<T>,
  validate: z.ZodTypeAny
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
  }) as ValueObject<T>;
};

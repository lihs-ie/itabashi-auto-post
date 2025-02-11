import { UnionToIntersection } from 'type-fest';
import { z } from 'zod';

export type Commit<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type ValueOf<T> = T[keyof T];

export type ClassPropertyValues<T> = T[{
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T]];

export type ClassMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type ClassMethodType<T, K extends ClassMethodNames<T>> = T[K] extends (
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never;

export type ClassMethodArgs<T, K extends ClassMethodNames<T>> = Parameters<
  ClassMethodType<T, K>
>;

export type ExcludeFunctions<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? never
    : K]: T[K] extends object ? ExcludeFunctions<T[K]> : T[K];
};

export type NonEmptyArray<T> = [T, ...T[]] | [...T[], T];

type Primitive =
  | string
  | number
  | boolean
  | undefined
  | null
  | bigint
  | Function
  | Symbol
  | Date
  | never
  | void;

type IterateOnTuple<T extends [...any[]]> = T extends [
  infer Head,
  ...infer Tail,
]
  ? [Unbrand<Head>, ...IterateOnTuple<Tail>]
  : [];

type RemoveBrand<T> =
  T extends z.BRAND<infer Brand>
    ? T extends (
        | z.BRAND<Brand>
        | UnionToIntersection<{ [K in Brand]: z.BRAND<K> }[Brand]>
      ) &
        infer X
      ? RemoveBrand<X>
      : never
    : T;

export type Unbrand<T> = T extends Primitive
  ? RemoveBrand<T>
  : T extends Promise<infer E>
    ? Promise<Unbrand<E>>
    : T extends [any, ...any[]]
      ? IterateOnTuple<RemoveBrand<T>>
      : T extends Array<infer E>
        ? Array<Unbrand<E>>
        : T extends Set<infer E>
          ? Set<Unbrand<E>>
          : T extends Map<infer E, infer F>
            ? Map<Unbrand<E>, Unbrand<F>>
            : {
                [k in Exclude<keyof T, keyof z.BRAND<any>>]: Unbrand<T[k]>;
              };

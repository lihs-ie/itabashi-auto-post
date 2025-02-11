import { Range, List, Set, isSet } from 'immutable';

import { scramble } from '../helpers/math';
import { EnumLike, z } from 'zod';

type FactoryDelegate<T, P extends {}> = {
  instantiate: (properties: P) => T;
  prepare: (overrides: Partial<P>, seed: number) => P;
  retrieve: (instance: T) => P;
};

export type Factory<T, P extends {}> = FactoryDelegate<T, P> & {
  create: (overrides: Partial<P>, seed: number) => T;
  duplicate: (instance: T, overrides: Partial<P>) => T;
};

type Builder<T> = {
  build: (overrides?: Partial<T>) => T;
  buildList: (size: number, overrides?: Partial<T>) => T[];
  buildWith: (seed: number, overrides?: Partial<T>) => T;
  buildListWith: (size: number, seed: number, overrides?: Partial<T>) => T[];
  duplicate: (instance: T, overrides?: Partial<T>) => T;
};

export const Builder = <T, P extends {}>(factory: Factory<T, P>) => {
  const seeds = Set<number>();

  const nextSeed = (): number => {
    return nextSeeds(1).first() as number;
  };

  const nextSeeds = (size: number): List<number> => {
    const next = Range(0, seeds.size + size)
      .toList()
      .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
      .filter(candidate => !seeds.has(candidate));

    next.forEach(seed => {
      seeds.add(seed);
    });

    return next;
  };

  const build = (overrides: Partial<P> = {}): T => {
    return factory.create(overrides, nextSeed());
  };

  const buildList = (size: number, overrides: Partial<P> = {}): Array<T> => {
    return nextSeeds(size)
      .map(seed => factory.create(overrides, seed))
      .toArray();
  };

  const buildWith = (seed: number, overrides: Partial<P> = {}): T => {
    return factory.create(overrides, seed);
  };

  const buildListWith = (
    size: number,
    seed: number,
    overrides: Partial<P> = {}
  ): Array<T> => {
    return Range(0, size)
      .toList()
      .map(index => buildWith(seed + index, overrides))
      .toArray();
  };

  const duplicate = (instance: T, overrides: Partial<P> = {}): T => {
    return factory.duplicate(instance, overrides);
  };

  return {
    build,
    buildList,
    buildWith,
    buildListWith,
    duplicate,
  };
};

export const Factory = <T, P extends {}>(
  delegate: FactoryDelegate<T, P>
): Factory<T, P> => {
  const create = (overrides: Partial<P>, seed: number): T => {
    return delegate.instantiate(delegate.prepare(overrides, seed));
  };

  const duplicate = (instance: T, overrides: Partial<P>): T => {
    return delegate.instantiate({
      ...delegate.retrieve(instance),
      ...overrides,
    });
  };

  return {
    ...delegate,
    create,
    duplicate,
  };
};

export const EnumFactory = <T extends EnumLike, B extends string>(
  choices: T,
  schema: z.ZodBranded<z.ZodNativeEnum<T>, B>
) => {
  type Choice = T[keyof T];
  type Properties = { value: Choice; exclusion?: Choice | Set<Choice> };

  const candidates = Set<Choice>(Object.values(choices as object));

  const determineExclusions = (
    exclusions?: Choice | Set<Choice>
  ): Set<Choice> => {
    return exclusions === undefined
      ? Set()
      : Set.isSet(exclusions)
        ? exclusions
        : Set([exclusions]);
  };

  return Factory<Choice, Properties>({
    instantiate: (properties: Properties): Choice => {
      return schema.parse(properties.value);
    },
    prepare: (overrides: Partial<Properties>, seed: number): Properties => {
      const exclusions = determineExclusions(overrides.exclusion);

      const actuals = candidates.subtract(exclusions).toList();

      if (actuals.isEmpty()) {
        throw new Error('Candidates does not exist.');
      }

      return { value: actuals.get(seed % actuals.count())!, ...overrides };
    },
    retrieve: (instance: Choice): Properties => {
      return { value: instance };
    },
  });
};

export type ModelOf<T extends Factory<any, any>> =
  T extends Factory<infer M, any> ? M : never;

export type PropertiesOf<T extends Factory<any, any>> =
  T extends Factory<any, infer P> ? P : never;

type StringProperties = {
  value: string;
};

export const StringFactory = (
  min?: number | null,
  max?: number | null,
  candidates?: Set<string>
) => {
  const minLength = min ?? 1;
  const maxLength = max ?? 255;
  const characters = (candidates ?? Characters.ALPHANUMERIC).toList();

  return Factory<string, StringProperties>({
    instantiate(properties: StringProperties): string {
      return properties.value;
    },
    prepare(
      overrides: Partial<StringProperties>,
      seed: number
    ): StringProperties {
      const offset = seed % (maxLength - minLength + 1);
      const length = minLength + offset;

      const value = Range(0, length)
        .toList()
        .map(index => {
          return characters.get(scramble(seed + index) % characters.size);
        })
        .join('');

      return { value, ...overrides };
    },
    retrieve(instance: string): StringProperties {
      return {
        value: instance,
      };
    },
  });
};

export const Characters = {
  ALPHANUMERIC: Set([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ]),
  ALPHA: Set([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]),
  NUMERIC: Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']),
  SYMBOL: Set([
    '!',
    '"',
    '#',
    '$',
    '%',
    '&',
    "'",
    '(',
    ')',
    '*',
    '+',
    ',',
    '-',
    '.',
    '/',
    ':',
    ';',
    '<',
    '=',
    '>',
    '?',
    '@',
    '[',
    '\\',
    ']',
    '^',
    '_',
    '`',
    '{',
    ' |',
    '}',
    '~',
  ]),
};

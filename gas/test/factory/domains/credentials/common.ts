import { sha256 } from '@/aspects/hash';
import { HashedPassword, Password, Repository } from '@/domains/credentials';
import { List, Map } from 'immutable';
import { Builder, Factory, StringFactory } from 'test/factory/common';

export type PasswordProperties = {
  value: string;
};

export const PasswordFactory = Factory<Password, PasswordProperties>({
  instantiate: properties => Password(properties),
  prepare: (overrides, seed) => ({
    value: Builder(StringFactory(8, 255)).buildWith(seed),
    ...overrides,
  }),
  retrieve: instance => ({
    value: instance.value,
  }),
});

export type HashedPasswordProperties = {
  value: string;
};

export const HashedPasswordFactory = Factory<
  HashedPassword,
  HashedPasswordProperties
>({
  instantiate: properties => HashedPassword(properties),
  prepare: (overrides, seed) => ({
    value: Builder(StringFactory(64, 64)).buildWith(seed),
    ...overrides,
  }),
  retrieve: instance => ({
    value: instance.value,
  }),
});

export type RepositoryProperties = {
  instances: Array<HashedPassword>;
};

export const RepositoryFactory = Factory<Repository, RepositoryProperties>({
  instantiate: properties => {
    let instances: Map<string, HashedPassword> = List(properties.instances)
      .toMap()
      .mapKeys((_, value) => value.value);

    return {
      verify: password => {
        const target = sha256(password.value);

        return instances.has(target);
      },
    };
  },
  prepare: (overrides, seed) => ({
    instances: Builder(HashedPasswordFactory).buildListWith(10, seed),
    ...overrides,
  }),
  retrieve: _ => {
    throw new Error('Repository cannot be retrieved.');
  },
});

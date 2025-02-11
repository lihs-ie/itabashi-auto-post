import {
  Authentication,
  AuthenticationIdentifier,
  Repository,
  Type,
} from '@/domains/authentication';
import { Code, ScopeType } from '@/domains/authorization';
import { Builder, Factory, StringFactory } from '../../../factory/common';
import { v7 as uuid } from 'uuid';
import { TypeFactory } from './token';
import { List, Map } from 'immutable';
import { ScopeTypeFactory } from '../authorization/common';
import { sha256 } from '@/aspects/hash';

export type AuthenticationIdentifierProperties = {
  value: string;
};

export const AuthenticationIdentifierFactory = Factory<
  AuthenticationIdentifier,
  AuthenticationIdentifierProperties
>({
  instantiate: properties => AuthenticationIdentifier(properties),
  prepare: (overrides, seed) => ({
    value: uuid(undefined, undefined, seed),
    ...overrides,
  }),
  retrieve: instance => ({ value: instance.value }),
});

export type AuthenticationProperties = {
  identifier: AuthenticationIdentifier;
  accessToken: string;
  refreshToken: string;
  type: Type;
  expiresIn: number;
  scope: Array<ScopeType>;
  verify: () => boolean;
};

export const AuthenticationFactory = Factory<
  Authentication,
  AuthenticationProperties
>({
  instantiate: properties => Authentication(properties),
  prepare: (overrides, seed) => {
    const authentication = {
      identifier: Builder(AuthenticationIdentifierFactory).buildWith(seed),
      accessToken: sha256(Builder(StringFactory(1, 255)).build()),
      refreshToken: sha256(Builder(StringFactory(1, 255)).build()),
      type: Builder(TypeFactory).buildWith(seed) as Type,
      expiresIn: Math.floor(Math.random() * 1000),
      scope: Builder(ScopeTypeFactory).buildListWith(
        2,
        seed
      ) as Array<ScopeType>,
    };

    return {
      ...authentication,
      verify: () => {
        if (authentication.expiresIn < Date.now()) {
          return false;
        }

        return true;
      },
      ...overrides,
    };
  },
  retrieve: instance => ({
    identifier: instance.identifier,
    accessToken: instance.accessToken,
    refreshToken: instance.refreshToken,
    type: instance.type,
    expiresIn: instance.expiresIn,
    scope: instance.scope,
    verify: instance.verify,
  }),
});

export type RepositoryProperties = {
  instances: Array<Authentication>;
  onPersist?: (entity: Authentication) => void;
  onRemove?: (entity: Array<Authentication>) => void;
};

export const RepositoryFactory = Factory<Repository, RepositoryProperties>({
  instantiate: properties => {
    let instances: Map<AuthenticationIdentifier, Authentication> = List(
      properties.instances
    )
      .toMap()
      .mapKeys((_, value) => value.identifier);
    const onPersist: RepositoryProperties['onPersist'] = properties.onPersist;
    const onRemove: RepositoryProperties['onRemove'] = properties.onRemove;

    const persist = (authentication: Authentication) => {
      instances = instances.set(authentication.identifier, authentication);

      properties.onPersist?.(authentication);
    };

    return {
      create: (_: Code) => {
        const authentication = Builder(AuthenticationFactory).build();
        persist(authentication);

        return authentication;
      },
      refresh: authentication => {
        const next = Builder(AuthenticationFactory).build({
          identifier: authentication.identifier,
        });
        instances = instances.set(next.identifier, next);

        onPersist?.(next);

        return next;
      },
      remove: identifier => {
        if (!instances.has(identifier)) {
          throw new Error('Not found');
        }

        const target = instances.get(identifier)!;

        instances = instances.remove(identifier);

        onRemove?.([target]);
      },
      persist,
      find: identifier => {
        if (!instances.has(identifier)) {
          throw new Error('Not found');
        }

        return instances.get(identifier)!;
      },
      list: () => instances.toList().toArray(),
    };
  },
  prepare: (overrides, seed) => ({
    instances: Builder(AuthenticationFactory).buildListWith(3, seed),
    ...overrides,
  }),
  retrieve: _ => {
    throw new Error('Repository cannot be retrieved.');
  },
});

expect.extend({
  toBeSameAuthentication(actual: Authentication, expected: Authentication) {
    try {
      expect(expected.identifier.equals(actual.identifier)).toBeTruthy();
      expect(actual.accessToken).toBe(expected.accessToken);
      expect(actual.refreshToken).toBe(expected.refreshToken);
      expect(actual.type).toBe(expected.type);
      expect(actual.expiresIn).toBe(expected.expiresIn);
      expect(actual.scope).toEqual(expected.scope);

      return {
        message: () => 'OK.',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSameAuthentication(expected: Authentication): R;
    }
  }
}

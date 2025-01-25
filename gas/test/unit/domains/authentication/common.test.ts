import {
  Authentication,
  AuthenticationIdentifier,
} from '@/domains/authentication';
import { Builder, StringFactory } from 'test/factory/common';
import {
  AuthenticationIdentifierFactory,
  AuthenticationIdentifierProperties,
  AuthenticationProperties,
} from 'test/factory/domains/authentication/common';
import { TypeFactory } from 'test/factory/domains/authentication/token';
import { ScopeTypeFactory } from 'test/factory/domains/authorization/common';
import 'jest-to-equal-type';
import { v7 as uuid } from 'uuid';
import { ValueObjectTest } from '../common';

describe('Package common', () => {
  describe('AuthenticationIdentifier', () => {
    describe('instantiate', () => {
      it('successfully returns AuthenticationIdentifier.', () => {
        const value = uuid();

        const identifier = AuthenticationIdentifier({ value });

        expect(identifier.value).toBe(value);
      });
    });

    ValueObjectTest<AuthenticationIdentifier>(
      AuthenticationIdentifier,
      {
        value: uuid(),
      },
      [{ value: uuid() }],
      [{ value: 'invalid' }]
    );
  });

  describe('Authentication', () => {
    describe('instantiate', () => {
      it('successfully returns AuthenticationIdentifier.', () => {
        const identifier = Builder(AuthenticationIdentifierFactory).build();
        const accessToken = Builder(StringFactory(1, 255)).build();
        const refreshToken = Builder(StringFactory(1, 255)).build();
        const type = Builder(TypeFactory).build();
        const expiresIn = Math.floor(Math.random() * 1000);
        const scope = Builder(ScopeTypeFactory).buildList(2);

        const authentication = Authentication({
          identifier,
          accessToken,
          refreshToken,
          type,
          expiresIn,
          scope,
        });

        expect(identifier.equals(authentication.identifier)).toBeTruthy();
        expect(authentication.accessToken).toBe(accessToken);
        expect(authentication.refreshToken).toBe(refreshToken);
        expect(authentication.type).toBe(type);
        expect(authentication.expiresIn).toBe(expiresIn);
        expect(authentication.scope).toEqual(scope);
      });

      it.each<Partial<AuthenticationProperties>>([
        {
          accessToken: '',
        },
        {
          accessToken: 'a'.repeat(256),
        },
        {
          refreshToken: '',
        },
        {
          refreshToken: 'a'.repeat(256),
        },
        {
          expiresIn: -1,
        },
        {
          scope: [],
        },
      ])('unsuccessfully throws error with invalid properties %s.', invalid => {
        const identifier = Builder(AuthenticationIdentifierFactory).build();
        const accessToken = Builder(StringFactory(1, 255)).build();
        const refreshToken = Builder(StringFactory(1, 255)).build();
        const type = Builder(TypeFactory).build();
        const expiresIn = Math.floor(Math.random() * 1000);
        const scope = Builder(ScopeTypeFactory).buildList(2);

        const properties = {
          identifier,
          accessToken,
          refreshToken,
          type,
          expiresIn,
          scope,
          ...invalid,
        };

        expect(() => Authentication(properties)).toThrow();
      });
    });
  });
});

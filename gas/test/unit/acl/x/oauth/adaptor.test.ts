import {
  Adaptor,
  PersistedAuthentication,
  Reader,
  Translator,
  Writer,
} from '@/acl/x/oauth';
import { persistClient } from '@/aspects/script-properties';
import {
  Authentication,
  authenticationIdentifierSchema,
} from '@/domains/authentication';
import { codeSchema } from '@/domains/authorization';
import { List } from 'immutable';
import 'jest-to-equal-type';
import { Builder } from 'test/factory/common';
import {
  AuthenticationFactory,
  AuthenticationIdentifierFactory,
} from 'test/factory/domains/authentication/common';
import { CodeFactory } from 'test/factory/domains/authorization/common';
import { PropertiesServiceMock } from 'test/mock/google';
import { ScriptPropertyMock } from 'test/mock/google/properties-service/script-property';
import { Type } from 'test/mock/upstreams/common';
import { prepare } from 'test/mock/upstreams/x';

const endpoint = 'http://localhost/api';
const clientId = 'client_id';
const clientSecret = 'client_secret';
const redirectURI = 'http://localhost/callback';

const createAdaptor = (parameters?: Parameters<typeof Adaptor>) =>
  Adaptor(
    parameters?.[0] ?? Reader(),
    parameters?.[1] ?? Writer(redirectURI, clientId, clientSecret),
    Translator(),
    persistClient(),
    clientId,
    clientSecret,
    endpoint
  );

describe('Package adaptor', () => {
  describe('Adaptor', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1000);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('instantiate', () => {
      it('successfully returns Adaptor.', () => {
        const adaptor = createAdaptor();

        expect(adaptor).toEqualType<ReturnType<typeof Adaptor>>();
      });
    });

    describe('create', () => {
      it('successfully returns Authentication.', () => {
        const adaptor = createAdaptor();

        const expected = Builder(AuthenticationFactory).build();

        prepare(endpoint, upstream => upstream.addOauth(Type.OK, expected));

        const actual = adaptor.create(
          codeSchema.parse(Builder(CodeFactory).build())
        );

        expect(
          authenticationIdentifierSchema.safeParse(actual.identifier).success
        ).toBeTruthy();
        expect(actual.accessToken).toBe(expected.accessToken);
        expect(actual.refreshToken).toBe(expected.refreshToken);
        expect(actual.expiresIn).toBe(expected.expiresIn * 1000 + Date.now());
        expect(actual.scope).toEqual(expected.scope);
        expect(actual.type).toBe(expected.type);
      });

      it.each(Object.values(Type).filter(type => type !== 'ok'))(
        'throws an error.',
        type => {
          const adaptor = createAdaptor();

          prepare(endpoint, upstream => upstream.addOauth(type));

          expect(() =>
            adaptor.create(codeSchema.parse(Builder(CodeFactory).build()))
          ).toThrow();
        }
      );
    });

    describe('refresh', () => {
      it('successfully returns Authentication.', () => {
        const adaptor = createAdaptor();

        const expected = Builder(AuthenticationFactory).build();

        prepare(endpoint, upstream => upstream.addOauth(Type.OK, expected));

        const actual = adaptor.refresh(expected);

        expect(expected.identifier.equals(actual.identifier)).toBeTruthy();
        expect(actual.accessToken).toBe(expected.accessToken);
        expect(actual.refreshToken).toBe(expected.refreshToken);
        expect(actual.expiresIn).toBe(expected.expiresIn * 1000 + Date.now());
        expect(actual.scope).toEqual(expected.scope);
        expect(actual.type).toBe(expected.type);
      });

      it.each(Object.values(Type).filter(type => type !== 'ok'))(
        'throws an error.',
        type => {
          const adaptor = createAdaptor();

          prepare(endpoint, upstream => upstream.addOauth(type));

          expect(() =>
            adaptor.refresh(Builder(AuthenticationFactory).build())
          ).toThrow();
        }
      );
    });

    describe('remove', () => {
      const authentications: List<Authentication> = List(
        Builder(AuthenticationFactory).buildList(3)
      );

      const propertyMock = new ScriptPropertyMock({
        AUTHENTICATIONS: JSON.stringify(authentications.toArray()),
      });

      beforeEach(() => {
        global.PropertiesService = new PropertiesServiceMock(propertyMock);
      });

      it('successfully removes Authentication.', () => {
        const target = authentications.get(Math.floor(Math.random() * 3))!;

        expect(propertyMock.getProperty('AUTHENTICATIONS')).toContain(
          target.identifier.value
        );

        const adaptor = createAdaptor();

        adaptor.remove(target.identifier);

        expect(propertyMock.getProperty('AUTHENTICATIONS')).not.toContain(
          target.identifier.value
        );
      });

      it('unsuccessfully with missing identifier.', () => {
        const adaptor = createAdaptor();

        expect(() =>
          adaptor.remove(Builder(AuthenticationIdentifierFactory).build())
        ).toThrow();
      });
    });

    describe('find', () => {
      const authentications: List<Authentication> = List(
        Builder(AuthenticationFactory).buildList(3)
      );

      const propertyMock = new ScriptPropertyMock({
        AUTHENTICATIONS: JSON.stringify(authentications.toArray()),
      });

      beforeEach(() => {
        global.PropertiesService = new PropertiesServiceMock(propertyMock);

        jest.spyOn(Date, 'now').mockReturnValue(1000);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('successfully returns Authentication.', () => {
        const target = authentications.get(Math.floor(Math.random() * 3))!;

        const adaptor = createAdaptor();

        const actual = adaptor.find(target.identifier);

        expect(actual).toBeSameAuthentication(target);
      });
    });

    describe('persist', () => {
      const authentications: List<Authentication> = List(
        Builder(AuthenticationFactory).buildList(3)
      );

      const propertyMock = new ScriptPropertyMock({
        AUTHENTICATIONS: JSON.stringify(authentications.toArray()),
      });

      beforeEach(() => {
        global.PropertiesService = new PropertiesServiceMock(propertyMock);

        jest.spyOn(Date, 'now').mockReturnValue(1000);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      describe('successfully ', () => {
        it('persists new-authentication.', () => {
          const adaptor = createAdaptor();

          const expected = Builder(AuthenticationFactory).build();

          adaptor.persist(expected);

          const actuals = JSON.parse(
            propertyMock.getProperty('AUTHENTICATIONS')!
          ) as Array<PersistedAuthentication>;

          const target = actuals.find(
            actual => actual.identifier.value === expected.identifier.value
          );

          expect(target).toBeDefined();

          expect(target?.identifier.value).toBe(expected.identifier.value);
          expect(target?.accessToken).toBe(expected.accessToken);
          expect(target?.refreshToken).toBe(expected.refreshToken);
          expect(target?.expiresIn).toBe(expected.expiresIn);
          expect(target?.scope).toEqual(expected.scope);
          expect(target?.type).toBe(expected.type);
        });
      });
    });

    describe('list', () => {
      const expecteds: List<Authentication> = List(
        Builder(AuthenticationFactory).buildList(3)
      );

      const propertyMock = new ScriptPropertyMock({
        AUTHENTICATIONS: JSON.stringify(expecteds.toArray()),
      });

      beforeEach(() => {
        global.PropertiesService = new PropertiesServiceMock(propertyMock);

        jest.spyOn(Date, 'now').mockReturnValue(1000);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('successfully returns Authentication.', () => {
        const adaptor = createAdaptor();

        const actuals = adaptor.list();

        List(expecteds)
          .zip(List(actuals))
          .forEach(([expected, actual]) => {
            expect(expected).not.toBeNull();
            expect(actual).not.toBeNull();

            expect(actual).toBeSameAuthentication(expected);
          });
      });
    });
  });
});

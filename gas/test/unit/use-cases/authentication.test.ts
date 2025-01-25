import {
  Authentication as Entity,
  AuthenticationIdentifier,
  Repository,
} from '@/domains/authentication';
import { codeSchema } from '@/domains/authorization';
import { Authentication } from '@/use-cases/authentication';
import { Builder } from 'test/factory/common';
import {
  AuthenticationFactory,
  RepositoryFactory,
  RepositoryProperties,
} from 'test/factory/domains/authentication/common';
import 'jest-to-equal-type';
import { createPersistUseCase, createRemoveUseCase } from './helper';
import { CodeFactory } from 'test/factory/domains/authorization/common';

describe('Authentication', () => {
  const createRepository = (overrides?: RepositoryProperties) =>
    Builder(RepositoryFactory).build(overrides);

  describe('instantiate', () => {
    it('successfully returns Authentication.', () => {
      const authentication = Authentication(createRepository());

      expect(authentication).toBeDefined();
    });
  });

  describe('login', () => {
    it('successfully returns AuthenticationIdentifier.', async () => {
      const code = Builder(CodeFactory).build();

      const [useCase, persisted] = createPersistUseCase<
        ReturnType<typeof Authentication>,
        Entity,
        Repository,
        RepositoryProperties
      >(Authentication, RepositoryFactory, []);

      const actual = useCase.login(code.value, code.verifier);

      expect(actual).toEqualType<AuthenticationIdentifier>();
      const target = persisted.current.find(entity =>
        entity.identifier.equals(actual)
      );

      expect(target).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('successfully returns void.', async () => {
      const entity = Builder(AuthenticationFactory).build();

      const [useCase, persisted] = createPersistUseCase<
        ReturnType<typeof Authentication>,
        Entity,
        Repository,
        RepositoryProperties
      >(Authentication, RepositoryFactory, [entity]);

      useCase.refresh(entity);

      const target = persisted.current.find(entity =>
        entity.identifier.equals(entity.identifier)
      );

      expect(target).toBeDefined();

      expect(target).not.toBeSameAuthentication(entity);
    });
  });

  describe('logout', () => {
    it('successfully returns void.', async () => {
      const entity = Builder(AuthenticationFactory).build();

      const [useCase, removed] = createRemoveUseCase<
        ReturnType<typeof Authentication>,
        Entity,
        Repository,
        RepositoryProperties
      >(Authentication, RepositoryFactory, [entity]);

      useCase.remove(entity.identifier.value);

      removed.current.forEach(entity => {
        expect(entity).toBeSameAuthentication(entity);
      });
    });
  });

  describe('verify', () => {
    it('successfully returns true with valid authentication.', async () => {
      const entity = Builder(AuthenticationFactory).build({
        expiresIn: Date.now() + 1000,
      });

      const useCase = Authentication(createRepository({ instances: [entity] }));

      const actual = useCase.verify(entity.identifier.value);

      expect(actual).toBeTruthy();
    });

    it('successfully returns false with invalid authentication.', async () => {
      const entity = Builder(AuthenticationFactory).build({
        expiresIn: Date.now() - 1000,
      });

      const useCase = Authentication(createRepository({ instances: [entity] }));

      const actual = useCase.verify(entity.identifier.value);

      expect(actual).toBeFalsy();
    });
  });

  describe('list', () => {
    it('successfully returns list of Authentication.', async () => {
      const expecteds = Builder(AuthenticationFactory).buildList(2);

      const useCase = Authentication(
        createRepository({ instances: expecteds })
      );

      const actual = useCase.list();

      expecteds.forEach(expected => {
        const target = actual.find(entity =>
          entity.identifier.equals(expected.identifier)
        );

        expect(target).toBeDefined();
        expect(target).toBeSameAuthentication(expected);
      });
    });
  });
});

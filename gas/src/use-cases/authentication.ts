import {
  Repository,
  Authentication as Entity,
  AuthenticationIdentifier,
} from '../domains/authentication';
import { Code } from '../domains/authorization';

export const Authentication = (repository: Repository) => ({
  login: (value: string, verifier: string): AuthenticationIdentifier => {
    const entity = repository.create(Code({ value, verifier }));

    repository.persist(entity);

    return entity.identifier;
  },
  refresh: (entity: Entity): void => {
    const next = repository.refresh(entity);

    repository.persist(next);
  },
  remove: (identifier: string): void => {
    repository.remove(AuthenticationIdentifier({ value: identifier }));
  },
  list: (): Array<Entity> => {
    return repository.list();
  },
  verify: (identifier: string): boolean => {
    try {
      const target = repository.find(
        AuthenticationIdentifier({ value: identifier })
      );

      return target.verify();
    } catch (_) {
      return false;
    }
  },
});

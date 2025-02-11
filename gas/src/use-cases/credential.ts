import { Password, Repository } from '../domains/credentials';

export const Credential = (repository: Repository) => ({
  verify: (password: string): boolean => {
    return repository.verify(Password({ value: password }));
  },
});

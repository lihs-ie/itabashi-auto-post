import { Repository, UserIdentifier, User as Entity } from '../domains/user';

export const User = (repository: Repository) => ({
  find: async (identifier: string) => {
    return await repository.find(UserIdentifier({ value: identifier }));
  },
  ofToken: async (token: string) => {
    return await repository.ofToken(token);
  },
  persist: async (identifier: string, name: string) => {
    await repository.persist(
      Entity({ identifier: UserIdentifier({ value: identifier }), name })
    );
  },
});

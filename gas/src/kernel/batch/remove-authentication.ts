import { Authentication } from '@/use-cases/authentication';

export const removeAuthentication = (
  useCase: ReturnType<typeof Authentication>
) => {
  const authentications = useCase.list();

  authentications.forEach(async authentication => {
    if (!authentication.verify()) {
      useCase.remove(authentication.identifier.value);
    }
  });
};

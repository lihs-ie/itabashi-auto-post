import { Authentication } from '../../use-cases';

export const allRefresh = (useCase: ReturnType<typeof Authentication>) => {
  const authentications = useCase.list();

  authentications.forEach(async authentication => {
    try {
      useCase.refresh(authentication);
    } catch (error) {
      Logger.log(
        `Failed to refresh authentication: ${authentication.identifier.value}`
      );
    }
  });
};

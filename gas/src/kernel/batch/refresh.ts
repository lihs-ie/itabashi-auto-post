import { Authentication } from '../../use-cases';

export const allRefresh = (useCase: ReturnType<typeof Authentication>) => {
  const authentications = useCase.list();

  authentications.forEach(async authentication => {
    useCase.refresh(authentication);
  });
};

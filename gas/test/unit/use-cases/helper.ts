import { Builder, Factory } from '../../factory/common';

const createPersistHandler = <T>(): [
  onPersist: (instance: T) => void,
  persisted: { current: Array<T> },
] => {
  const persisted: { current: Array<T> } = { current: [] };

  const onPersist = (instance: T) => {
    persisted.current.push(instance);
  };

  return [onPersist, persisted];
};

type RepositoryOverrides<T> = {
  instances: Array<T>;
  onPersist?: (instance: T) => void;
  onRemove?: (instances: Array<T>) => void;
};

export const createPersistUseCase = <
  U,
  I,
  R,
  RO extends RepositoryOverrides<I>,
>(
  target: (repository: R) => U,
  repositoryFactory: Factory<R, RO>,
  instances: Array<I> = []
): [useCase: U, persisted: { current: Array<I> }] => {
  const [onPersist, persisted] = createPersistHandler<I>();

  const overrides = { instances, onPersist } as RO;

  const useCase = target(Builder(repositoryFactory).build(overrides));

  return [useCase, persisted];
};

const createRemoveHandler = <T>(): [
  onRemove: (instances: Array<T>) => void,
  removed: { current: Array<T> },
] => {
  const removed: { current: Array<T> } = { current: [] };

  const onRemove = (instances: Array<T>) => {
    removed.current = instances;
  };

  return [onRemove, removed];
};

export const createRemoveUseCase = <U, I, R, RO extends RepositoryOverrides<I>>(
  target: (repository: R) => U,
  repositoryFactory: ReturnType<typeof Factory<R, RO>>,
  instances: Array<I> = []
): [useCase: U, removed: { current: Array<I> }] => {
  const [onRemove, removed] = createRemoveHandler<I>();

  const overrides = { instances, onRemove } as RO;

  const useCase = target(Builder(repositoryFactory).build(overrides));

  return [useCase, removed];
};

import { Authentication } from '../../use-cases';
import { repository } from '../infrastructures/authentication';

const useCase = Authentication(repository);

export { useCase };

import { Credential } from '../../use-cases';
import { repository } from '../infrastructures/credential';

const useCase = Credential(repository);

export { useCase };

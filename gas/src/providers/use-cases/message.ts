import { Message } from '../../use-cases';
import { repository } from '../infrastructures/message';

const useCase = Message(repository);

export { useCase };

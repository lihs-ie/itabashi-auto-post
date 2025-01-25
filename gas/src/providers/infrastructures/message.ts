import { ACLMessageRepository } from '../../infrastructures';
import { adaptor } from '../acl/x/tweet';

const repository = ACLMessageRepository(adaptor);

export { repository };

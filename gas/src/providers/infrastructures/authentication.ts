import { ACLAuthenticationRepository } from '../../infrastructures';
import { adaptor } from '../acl/x/oauth';

const repository = ACLAuthenticationRepository(adaptor);

export { repository };

import { ACLCredentialRepository } from '../../infrastructures';
import { adaptor } from '../acl/credentials';

const repository = ACLCredentialRepository(adaptor);

export { repository };

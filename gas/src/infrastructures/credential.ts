import { AbstractAdaptor } from '../acl/common';
import { Adaptor } from '../acl/credentials';
import { Password, Repository } from '../domains/credentials';

export const ACLCredentialRepository = (
  adaptor: AbstractAdaptor<Adaptor>
): Repository => ({
  verify: (password: Password): boolean => {
    return adaptor.verify(password);
  },
});

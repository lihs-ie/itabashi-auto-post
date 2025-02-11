import { Adaptor } from '../acl/x/oauth';
import { AbstractAdaptor } from '../acl/common';
import {
  Authentication,
  AuthenticationIdentifier,
  Repository,
} from '../domains/authentication';
import { Code } from '../domains/authorization';

export const ACLAuthenticationRepository = (
  adaptor: AbstractAdaptor<Adaptor>
): Repository => ({
  create: (code: Code): Authentication => {
    return adaptor.create(code);
  },
  refresh: (authentication: Authentication): Authentication => {
    return adaptor.refresh(authentication);
  },
  remove: (identifier: AuthenticationIdentifier): void => {
    return adaptor.remove(identifier);
  },
  persist: (authentication: Authentication): void => {
    return adaptor.persist(authentication);
  },
  find: (identifier: AuthenticationIdentifier): Authentication => {
    return adaptor.find(identifier);
  },
  list: (): Array<Authentication> => {
    return adaptor.list();
  },
});

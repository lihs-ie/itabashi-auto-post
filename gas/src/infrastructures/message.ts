import { AbstractAdaptor } from '../acl/common';
import { Adaptor } from '../acl/x/tweet';
import { Message, Repository } from '../domains/message';

export const ACLMessageRepository = (
  adaptor: AbstractAdaptor<Adaptor>
): Repository => ({
  send: (message: Message): void => {
    return adaptor.send(message);
  },
});

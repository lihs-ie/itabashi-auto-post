import { Message as Entity, Repository } from '../domains/message';
import { URL } from '../domains/common';
import { AuthenticationIdentifier } from '../domains/authentication';

export const Message = (repository: Repository) => ({
  send: (identifier: string, authentication: string, content: string): void => {
    repository.send(
      Entity({
        identifier: URL({ value: identifier }),
        authentication: AuthenticationIdentifier({ value: authentication }),
        content,
      })
    );
  },
});

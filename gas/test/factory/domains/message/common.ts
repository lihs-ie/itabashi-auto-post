import { Message } from '@/domains/message';
import { Builder, Factory, StringFactory } from 'test/factory/common';
import { URL } from '@/domains/common';
import { AuthenticationIdentifier } from '@/domains/authentication';
import { URLFactory } from '../common';
import { AuthenticationIdentifierFactory } from '../authentication/common';

type MessageProperties = {
  identifier: URL;
  authentication: AuthenticationIdentifier;
  content: string;
};

export const MessageFactory = Factory<Message, MessageProperties>({
  instantiate: properties => Message(properties),
  prepare: (overrides, seed) => ({
    identifier: Builder(URLFactory).buildWith(seed),
    authentication: Builder(AuthenticationIdentifierFactory).buildWith(seed),
    content: Builder(StringFactory(1, 255)).buildWith(seed),
    ...overrides,
  }),
  retrieve: instance => ({
    identifier: instance.identifier,
    authentication: instance.authentication,
    content: instance.content,
  }),
});

expect.extend({
  toBeSameMessage(actual: Message, expected: Message) {
    try {
      expect(actual.identifier.equals(expected.identifier)).toBeTruthy();
      expect(
        actual.authentication.equals(expected.authentication)
      ).toBeTruthy();
      expect(actual.content).toBe(expected.content);

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSameMessage(expected: Message): R;
    }
  }
}

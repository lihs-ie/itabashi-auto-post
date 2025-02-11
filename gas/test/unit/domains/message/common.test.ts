import { Message } from '@/domains/message';
import { Builder, StringFactory } from '../../../factory/common';
import { AuthenticationIdentifierFactory } from '../../../factory/domains/authentication/common';
import { URLFactory } from 'test/factory/domains/common';
import 'jest-to-equal-type';

describe('Package common', () => {
  describe('Message', () => {
    describe('instantiate', () => {
      it('successfully returns Message.', () => {
        const identifier = Builder(URLFactory).build();
        const authentication = Builder(AuthenticationIdentifierFactory).build();
        const content = Builder(StringFactory(1, 255)).build();

        const message = Message({ identifier, authentication, content });

        expect(message).toEqualType<Message>();
        expect(message.identifier.equals(identifier)).toBeTruthy();
        expect(message.authentication.equals(authentication)).toBeTruthy();
        expect(message.content).toBe(content);
      });
    });
  });
});

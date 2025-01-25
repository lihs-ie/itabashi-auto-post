import { Writer } from '@/acl/x/tweet';
import { Writer as BaseWriter } from '@/acl/common';
import { Message } from '@/domains/message';
import 'jest-to-equal-type';
import { Builder } from 'test/factory/common';
import { MessageFactory } from 'test/factory/domains/message';

describe('Package media-types', () => {
  describe('Writer', () => {
    describe('instantiate', () => {
      it('successfully returns Writer.', () => {
        const writer = Writer();

        expect(writer).toEqualType<BaseWriter<Message>>();
      });
    });

    describe('write', () => {
      it('successfully returns body string.', () => {
        const message = Builder(MessageFactory).build();
        const expected = JSON.stringify({
          text: `${message.content} / ニコ生配信中\n${message.identifier.value}`,
        });

        const writer = Writer();

        const actual = writer.write(message);

        expect(actual).toBe(expected.toString());
      });
    });
  });
});

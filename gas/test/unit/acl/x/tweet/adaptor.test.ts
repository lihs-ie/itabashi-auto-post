import { Adaptor, Writer } from '@/acl/x/tweet';
import { persistClient } from '@/aspects/script-properties';
import { Builder } from 'test/factory/common';
import { AuthenticationFactory } from 'test/factory/domains/authentication/common';
import { MessageFactory } from 'test/factory/domains/message';
import { PropertiesServiceMock } from 'test/mock/google';
import { ScriptPropertyMock } from 'test/mock/google/properties-service/script-property';
import { Type } from 'test/mock/upstreams/common';
import { prepare } from 'test/mock/upstreams/x';

const endpoint = 'http://localhost/api';

const createAdaptor = () => Adaptor(Writer(), endpoint, persistClient());

describe('Package adaptor', () => {
  describe('send', () => {
    const authentication = Builder(AuthenticationFactory).build();

    beforeEach(() => {
      global.PropertiesService = new PropertiesServiceMock(
        new ScriptPropertyMock({
          AUTHENTICATIONS: JSON.stringify([authentication]),
        })
      );
    });

    it('successfully sends message.', async () => {
      const message = Builder(MessageFactory).build({
        authentication: authentication.identifier,
      });

      prepare(endpoint, upstream => upstream.addTweet(Type.OK, message));

      const adaptor = createAdaptor();

      expect(adaptor.send(message)).toBeUndefined();
    });

    it('unsuccessfully with missing authentication.', async () => {
      const message = Builder(MessageFactory).build();

      prepare(endpoint, upstream => upstream.addTweet(Type.OK, message));

      const adaptor = createAdaptor();

      expect(() => adaptor.send(message)).toThrow();

      expect(Logger.getLog()).toContain('Failed to request upstream.');
    });

    it.each(Object.values(Type).filter(type => type !== Type.OK))(
      'unsuccessfully with %s.',
      async type => {
        const message = Builder(MessageFactory).build({
          authentication: authentication.identifier,
        });

        prepare(endpoint, upstream => upstream.addTweet(type, message));

        const adaptor = createAdaptor();

        expect(() => adaptor.send(message)).toThrow();

        expect(Logger.getLog()).toContain('Failed to request upstream.');
      }
    );
  });
});

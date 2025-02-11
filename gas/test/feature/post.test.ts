import { sha256 } from '@/aspects/hash';
import { PropertiesServiceMock } from 'test/mock/google';
import { PostEvent } from 'test/mock/google/event';
import { ScriptPropertyMock } from 'test/mock/google/properties-service/script-property';
import { prepare } from 'test/mock/upstreams/x';
import { POST } from '@/controllers/post';
import 'jest-to-equal-type';
import { Builder } from 'test/factory/common';
import { AuthenticationFactory } from 'test/factory/domains/authentication/common';
import { Authentication } from '@/domains/authentication';
import { v4 } from 'uuid';
import { MessageFactory } from 'test/factory/domains/message';
import { CodeFactory } from 'test/factory/domains/authorization/common';
import { URLFactory } from 'test/factory/domains/common';

const serializeAuthentication = (authentication: Authentication) => ({
  identifier: { value: authentication.identifier.value },
  accessToken: authentication.accessToken,
  type: authentication.type,
  expiresIn: authentication.expiresIn,
  refreshToken: authentication.refreshToken,
  scope: authentication.scope,
});

describe('Package post', () => {
  describe('login', () => {
    beforeEach(() => {
      PropertiesService = new PropertiesServiceMock(
        new ScriptPropertyMock({
          GAS_PASSWORD: JSON.stringify({
            value: sha256('password' + 'salt'),
          }),
          AUTHENTICATIONS: JSON.stringify([]),
        })
      );
    });

    describe('successfully', () => {
      it('return successful response.', async () => {
        const code = Builder(CodeFactory).build();

        const event = new PostEvent('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            action: 'login',
            payload: {
              code: { value: code.value, verifier: code.verifier },
              password: 'password',
            },
          }),
        });

        prepare('http://localhost/api', upstream => upstream.addOauth('ok'));

        const response = POST(event);
        expect(response.getMimeType()).toBe(ContentService.MimeType.JSON);
        const payload = JSON.parse(response.getContent()) as {
          status: number;
          payload: { authentication: string };
        };

        expect(payload.status).toBe(200);
        expect(payload.payload.authentication).not.toBe('');
      });
    });

    describe('unsuccessfully', () => {
      type Payload = {
        code?: {
          value?: string;
          verifier?: string;
        };
        password?: string;
      };

      it.each<Payload>([
        { code: { value: '' } },
        { code: { value: 'code', verifier: '' } },
        { password: '' },
        { password: 'password1' },
        { code: { value: '' }, password: 'password1' },
      ])(`return invalid request.`, async payload => {
        const event = new PostEvent('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            action: 'login',
            payload,
          }),
        });

        const response = POST(event);
        expect(response.getMimeType()).toBe(ContentService.MimeType.TEXT);
        expect(response.getContent()).toBe(
          JSON.stringify({ status: 400, payload: { message: 'Bad Request.' } })
        );
      });
    });
  });

  describe('logout', () => {
    const authentication = Builder(AuthenticationFactory).build({
      expiresIn: Date.now() + 1000,
    });

    beforeEach(() => {
      PropertiesService = new PropertiesServiceMock(
        new ScriptPropertyMock({
          GAS_PASSWORD: JSON.stringify({
            value: sha256('password' + 'salt'),
          }),
          AUTHENTICATIONS: JSON.stringify([
            serializeAuthentication(authentication),
          ]),
        })
      );
    });

    describe('successfully', () => {
      it('return successful response.', async () => {
        const event = new PostEvent('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            action: 'logout',
            payload: {
              authentication: authentication.identifier.value,
              password: 'password',
            },
          }),
        });

        prepare('http://localhost/api', upstream => upstream.addOauth('ok'));

        const response = POST(event);
        expect(response.getContent()).toBe(JSON.stringify({ status: 200 }));
      });

      it('returns failed response with missing authentication.', async () => {
        const event = new PostEvent('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            action: 'logout',
            payload: {
              authentication: v4(),
              password: 'password',
            },
          }),
        });

        const response = POST(event);
        expect(response.getMimeType()).toBe(ContentService.MimeType.TEXT);
        expect(response.getContent()).toBe(
          JSON.stringify({
            status: 500,
            payload: { message: 'Internal server error.' },
          })
        );
      });

      it.each([
        { authentication: '', password: 'password' },
        { authentication: authentication.identifier.value, password: '' },
      ])('returns invalid request.', async payload => {
        const event = new PostEvent('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            action: 'logout',
            payload,
          }),
        });

        const response = POST(event);
        expect(response.getMimeType()).toBe(ContentService.MimeType.TEXT);
        expect(response.getContent()).toBe(
          JSON.stringify({ status: 400, payload: { message: 'Bad Request.' } })
        );
      });
    });
  });

  describe('sendMessage', () => {
    const authentication = Builder(AuthenticationFactory).build({
      expiresIn: Date.now() + 1000,
    });

    beforeEach(() => {
      PropertiesService = new PropertiesServiceMock(
        new ScriptPropertyMock({
          GAS_PASSWORD: JSON.stringify({
            value: sha256('password' + 'salt'),
          }),
          AUTHENTICATIONS: JSON.stringify([
            serializeAuthentication(authentication),
          ]),
        })
      );
    });

    describe('successfully', () => {
      it('return successful response.', async () => {
        const message = Builder(MessageFactory).build({
          authentication: authentication.identifier,
          identifier: Builder(URLFactory).build({
            value: `https://live.nicovideo.jp/watch/lv${Math.floor(Math.random() * 10000)}?ref=sharetw_ss_${Date.now()}`,
          }),
        });

        const event = new PostEvent('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            action: 'sendMessage',
            payload: {
              identifier: message.identifier.value,
              authentication: authentication.identifier.value,
              content: message.content,
              password: 'password',
            },
          }),
        });

        prepare('http://localhost/api', upstream =>
          upstream.addTweet('ok', message)
        );

        const response = POST(event);

        expect(response.getMimeType()).toBe(ContentService.MimeType.TEXT);
        expect(response.getContent()).toBe(JSON.stringify({ status: 200 }));
      });
    });

    describe('unsuccessfully', () => {
      it('returns failed response with missing authentication.', async () => {
        const event = new PostEvent('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            action: 'sendMessage',
            payload: {
              identifier: 'http://localhost',
              authentication: v4(),
              content: 'content',
              password: 'password',
            },
          }),
        });

        const response = POST(event);

        expect(response.getMimeType()).toBe(ContentService.MimeType.TEXT);
        expect(response.getContent()).toBe(
          JSON.stringify({
            status: 500,
            payload: { message: 'Internal server error.' },
          })
        );
      });

      it.each([
        {
          identifier: '',
          authentication: authentication.identifier.value,
          content: 'content',
          password: 'password',
        },
        {
          identifier: 'http://localhost',
          authentication: '',
          content: 'content',
          password: 'password',
        },
        {
          identifier: 'http://localhost',
          authentication: authentication.identifier.value,
          content: '',
          password: 'password',
        },
      ])('returns invalid request with %s.', async payload => {
        const event = new PostEvent('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            action: 'sendMessage',
            payload,
          }),
        });

        const response = POST(event);
        expect(response.getMimeType()).toBe(ContentService.MimeType.TEXT);
        expect(response.getContent()).toBe(
          JSON.stringify({ status: 400, payload: { message: 'Bad Request.' } })
        );
      });
    });
  });
});

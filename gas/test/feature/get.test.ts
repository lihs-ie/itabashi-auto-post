import { Builder } from 'test/factory/common';
import { AuthenticationFactory } from 'test/factory/domains/authentication/common';
import { PropertiesServiceMock } from 'test/mock/google';
import { ScriptPropertyMock } from 'test/mock/google/properties-service/script-property';
import { GET } from '@/controllers/get';
import { GetEvent } from 'test/mock/google/event';
import { Authentication } from '@/domains/authentication';

const serializeAuthentication = (authentication: Authentication) => ({
  identifier: { value: authentication.identifier.value },
  accessToken: authentication.accessToken,
  type: authentication.type,
  expiresIn: authentication.expiresIn,
  refreshToken: authentication.refreshToken,
  scope: authentication.scope,
});

describe('Package get', () => {
  const expiredAuthentication = Builder(AuthenticationFactory).build({
    expiresIn: Date.now() - 1000,
  });

  const validAuthentication = Builder(AuthenticationFactory).build({
    expiresIn: Date.now() + 1000,
  });

  beforeAll(() => {
    global.PropertiesService = new PropertiesServiceMock(
      new ScriptPropertyMock({
        AUTHENTICATIONS: JSON.stringify([
          serializeAuthentication(expiredAuthentication),
          serializeAuthentication(validAuthentication),
        ]),
      })
    );
  });

  describe('successfully', () => {
    it('returns active status', async () => {
      const event = new GetEvent(
        `https://localhost/authentications/${validAuthentication.identifier.value}`
      );
      const response = GET(event);

      expect(response.getMimeType()).toEqual(ContentService.MimeType.JSON);
      expect(response.getContent()).toEqual(
        JSON.stringify({ status: 200, payload: { active: true } })
      );
    });

    it('returns inactive status', async () => {
      const event = new GetEvent(
        `https://localhost/authentications/${expiredAuthentication.identifier.value}`
      );
      const response = GET(event);

      expect(response.getMimeType()).toEqual(ContentService.MimeType.JSON);
      expect(response.getContent()).toEqual(
        JSON.stringify({ status: 200, payload: { active: false } })
      );
    });
  });
});

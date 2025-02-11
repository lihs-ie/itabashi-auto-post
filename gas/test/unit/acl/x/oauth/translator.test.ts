import { Media, Reader, Translator } from '@/acl/x/oauth';
import { Translator as BaseTranslator } from '@/acl/common';
import { Authentication } from '@/domains/authentication';
import { Builder } from 'test/factory/common';
import { AuthenticationFactory } from 'test/factory/domains/authentication/common';
import { OauthMedia } from 'test/mock/upstreams/x/media/oauth';
import 'jest-to-equal-type';

describe('Package translator', () => {
  describe('Translator', () => {
    describe('instantiate', () => {
      it('successfully returns Translator.', () => {
        const translator = Translator();

        expect(translator).toEqualType<BaseTranslator<Media, Authentication>>();
      });
    });

    describe('translate', () => {
      beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValue(1000);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('successfully returns Authentication.', () => {
        const expected = Builder(AuthenticationFactory).build();
        const media = new OauthMedia(expected);

        const translator = Translator();

        const reader = Reader();

        const actual = translator.translate(
          reader.read(media.createSuccessfulContent())
        );

        expect(actual.accessToken).toBe(expected.accessToken);
        expect(actual.refreshToken).toBe(expected.refreshToken);
        expect(actual.type).toBe(expected.type);
        expect(actual.expiresIn).toBe(expected.expiresIn * 1000 + Date.now());
        expect(actual.scope).toEqual(expected.scope);
      });
    });
  });
});

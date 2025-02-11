import { Reader as BaseReader, Writer as BaseWriter } from '@/acl/common';
import {
  Media as EntryMedia,
  GrantType,
  Reader,
  Value,
  Writer,
} from '@/acl/x/oauth';
import { sha256 } from '@/aspects/hash';
import 'jest-to-equal-type';
import { Builder } from 'test/factory/common';
import { CodeFactory } from 'test/factory/domains/authorization/common';
import { OauthMedia } from 'test/mock/upstreams/x/media/oauth';

describe('Package media-types', () => {
  describe('Reader', () => {
    describe('instantiate', () => {
      it('successfully returns Reader.', () => {
        const reader = Reader();

        expect(reader).toEqualType<BaseReader<EntryMedia>>();
      });
    });

    describe('read', () => {
      it('successfully returns Media.', () => {
        const media = new OauthMedia();

        const expected = media.data();

        const reader = Reader();

        const actual = reader.read(media.createSuccessfulContent());

        expect(actual).toBeExpectedOauthMedia(expected);
      });
    });
  });
  describe('Writer', () => {
    describe('instantiate', () => {
      it('successfully returns Writer.', () => {
        const writer = Writer(
          'https://localhost',
          'client_id',
          'client_secret'
        );

        expect(writer).toEqualType<
          BaseWriter<[grantType: GrantType, value: Value]>
        >();
      });
    });

    describe('write', () => {
      it('successfully returns string with grant_type code.', () => {
        const redirectURI = `https://localhost/${Math.floor(Math.random() * 1000)}`;
        const clientId = `client_id_${Math.floor(Math.random() * 1000)}`;
        const clientSecret = `client_secret_${Math.floor(Math.random() * 1000)}`;
        const code = Builder(CodeFactory).build();

        const writer = Writer(redirectURI, clientId, clientSecret);

        const actual = writer.write(['code', { code }]);

        const expected = new URLSearchParams({
          grant_type: 'authorization_code',
          code: code.value,
          code_verifier: code.verifier,
          redirect_uri: redirectURI,
          client_id: clientId,
          client_secret: clientSecret,
        });

        expect(actual).toBe(expected.toString());
      });

      it('successfully returns string with grant_type refresh.', () => {
        const redirectURI = `https://localhost/${Math.floor(Math.random() * 1000)}`;
        const clientId = `client_id_${Math.floor(Math.random() * 1000)}`;
        const clientSecret = `client_secret_${Math.floor(Math.random() * 1000)}`;

        const writer = Writer(redirectURI, clientId, clientSecret);

        const actual = writer.write([
          'refresh',
          { refreshToken: 'refresh_token' },
        ]);

        const expected = new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: 'refresh_token',
        });

        expect(actual).toBe(expected.toString());
      });
    });
  });
});

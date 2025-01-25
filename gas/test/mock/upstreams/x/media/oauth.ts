import { RawMedia, Media as ParsedMedia } from '@/acl/x/oauth';
import { Builder } from '../../../../factory/common';
import { Media } from '../../common';
import { Authentication, authenticationSchema } from '@/domains/authentication';
import { StringFactory } from 'test/factory/common';
import { sha256 } from '@/aspects/hash';

export class OauthMedia extends Media<Partial<RawMedia>, Authentication> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: 'unit',
          value: 'sku099',
        },
      ],
    });
  }

  protected fillByModel(overrides: Authentication): RawMedia {
    return {
      access_token: overrides.accessToken,
      token_type: 'bearer',
      expires_in: overrides.expiresIn,
      refresh_token: overrides.refreshToken,
      scope: overrides.scope
        .map(scope => {
          switch (scope) {
            case 'write':
              return 'tweet.write';
            case 'read':
              return 'tweet.read';
            case 'user':
              return 'users.read';
            case 'refresh':
              return 'offline.access';
            default:
              throw new Error(`Unknown scope: ${scope}`);
          }
        })
        .join(' '),
    };
  }

  protected fill(overrides?: Partial<RawMedia> | Authentication): RawMedia {
    if (this.isModel(overrides)) {
      return this.fillByModel(overrides as Authentication);
    }

    return {
      access_token: sha256(Builder(StringFactory(1, 255)).build()),
      refresh_token: sha256(Builder(StringFactory(1, 255)).build()),
      expires_in: 3600,
      scope: 'tweet.read',
      token_type: 'bearer',
      ...overrides,
    };
  }

  protected isModel(
    overrides?: Partial<RawMedia> | Authentication
  ): overrides is Authentication {
    return authenticationSchema.safeParse(overrides).success;
  }
}

expect.extend({
  toBeExpectedOauthMedia(actual: ParsedMedia, expected: RawMedia) {
    try {
      expect(actual.accessToken).toBe(expected.access_token);
      expect(actual.tokenType).toBe(expected.token_type);
      expect(actual.expiresIn).toBe(expected.expires_in);
      expect(actual.refreshToken).toBe(expected.refresh_token);
      expect(actual.scope).toBe(expected.scope);

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
      toBeExpectedOauthMedia(expected: RawMedia): R;
    }
  }
}

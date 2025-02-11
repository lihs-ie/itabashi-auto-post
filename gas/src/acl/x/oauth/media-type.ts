import { Code } from '@/domains/authorization';
import { Reader as BaseReader, Writer as BaseWriter } from '../../common';
import { GASURLSearchParams } from '@/aspects/http';

export type RawMedia = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type Media = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
};

export const Reader = (): BaseReader<Media> => {
  const read = (content: string): Media => {
    const payload = JSON.parse(content) as RawMedia;

    return {
      accessToken: payload.access_token,
      tokenType: payload.token_type,
      expiresIn: payload.expires_in,
      refreshToken: payload.refresh_token,
      scope: payload.scope,
    };
  };

  return { read };
};

type AuthorizationCodeGrant = {
  grant_type: 'authorization_code';
  code: string;
  code_verifier: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
};

type RefreshTokenGrant = {
  grant_type: 'refresh_token';
  refresh_token: string;
};

export type Value = { code?: Code; refreshToken?: string };

export type GrantType = 'code' | 'refresh';

export type Body = AuthorizationCodeGrant | RefreshTokenGrant;

export const Writer = (
  redirectUri: string,
  clientId: string,
  clientSecret: string
): BaseWriter<[grantType: GrantType, value: Value]> => {
  const write = ([grantType, value]: [GrantType, Value]): string => {
    const payload =
      grantType === 'code'
        ? writeAuthorizationCodeGrant(value.code)
        : writeRefreshTokenGrant(value.refreshToken);

    return new GASURLSearchParams(payload).toString();
  };

  const writeAuthorizationCodeGrant = (code?: Code): AuthorizationCodeGrant => {
    if (!code) {
      throw new Error('Code is required');
    }

    return {
      grant_type: 'authorization_code',
      code: code.value,
      code_verifier: code.verifier,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    };
  };

  const writeRefreshTokenGrant = (refreshToken?: string): RefreshTokenGrant => {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    return {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
  };

  return { write };
};

import { PersistClient } from '@/aspects/script-properties';
import {
  Authentication,
  AuthenticationIdentifier,
  typeSchema,
} from '../../../domains/authentication';
import { Code, scopeTypeSchema } from '../../../domains/authorization';
import { AbstractAdaptor, Reader, Translator, Writer } from '../../common';
import { GrantType, Media, Value } from './media-type';

export type Adaptor = {
  create: (code: Code) => Authentication;
  refresh: (authentication: Authentication) => Authentication;
  remove: (identifier: AuthenticationIdentifier) => void;
  persist: (authentication: Authentication) => void;
  find: (identifier: AuthenticationIdentifier) => Authentication;
  list: () => Array<Authentication>;
};

export type PersistedAuthentication = {
  identifier: { value: string };
  accessToken: string;
  type: string;
  expiresIn: number;
  refreshToken: string;
  scope: Array<string>;
};

export const Adaptor = (
  reader: Reader<Media>,
  writer: Writer<[grantType: GrantType, value: Value]>,
  translator: Translator<Media, Authentication>,
  persistClient: PersistClient<{ AUTHENTICATIONS: string }>,
  clientId: string,
  clientSecret: string,
  endpoint: string
): ReturnType<typeof AbstractAdaptor<Adaptor>> => {
  const delegate = AbstractAdaptor<Adaptor>({
    create: (code: Code): Authentication => {
      const [endpoint, options] = createRequest('code', { code });

      try {
        const response = UrlFetchApp.fetch(endpoint, options);

        if (!delegate.verifyStatus(response.getResponseCode())) {
          delegate.handleErrorResponse(response);
        }

        const content = response.getContentText();

        Logger.log('Successful response from upstream with %s, ', content);

        const media = reader.read(content);

        return translator.translate(media);
      } catch (error) {
        Logger.log('Failed to request upstream with %s, ', error);
        throw error;
      }
    },

    refresh: (authentication: Authentication): Authentication => {
      const [endpoint, options] = createRequest('refresh', {
        refreshToken: authentication.refreshToken,
      });

      let retryCount: number = 0;
      let next: Authentication | null = null;

      while (retryCount < 3 && !next) {
        try {
          const response = UrlFetchApp.fetch(endpoint, options);

          if (!delegate.verifyStatus(response.getResponseCode())) {
            delegate.handleErrorResponse(response);
          }

          const content = response.getContentText();
          const media = reader.read(content);

          next = translator.translate(media, authentication.identifier);
        } catch (error) {
          retryCount++;
          Utilities.sleep(1000);
        }
      }

      if (!next) {
        Logger.log(
          'Failed to refresh token. %s',
          authentication.identifier.value
        );
        throw new Error(
          `Failed to refresh token. ${authentication.identifier}`
        );
      }

      return next;
    },

    remove: (identifier: AuthenticationIdentifier): void => {
      const persisted = getPersisted();
      const restored = persisted.map(value => restore(value));

      const targetIndex = restored.findIndex(value =>
        identifier.equals(value.identifier)
      );

      if (targetIndex === -1) {
        throw new Error(
          `Specified authentication not found: ${identifier.value}.`
        );
      }

      persisted.splice(targetIndex, 1);

      persistClient.persist('AUTHENTICATIONS', JSON.stringify(persisted));
    },

    persist: (authentication: Authentication): void => {
      const persisted = getPersisted();
      const restored = persisted.map(value => restore(value));

      const index = restored.findIndex(value =>
        authentication.identifier.equals(value.identifier)
      );

      if (index === -1) {
        persisted.push(serialize(authentication));
      } else {
        persisted[index] = serialize(authentication);
      }

      persistClient.persist('AUTHENTICATIONS', JSON.stringify(persisted));
    },

    find: (identifier: AuthenticationIdentifier): Authentication => {
      const persisted = getPersisted();
      const restored = persisted.map(value => restore(value));

      const target = restored.find(value =>
        identifier.equals(value.identifier)
      );

      if (!target) {
        throw new Error(
          `Specified authentication not found: ${identifier.value}.`
        );
      }

      return target;
    },
    list: (): Array<Authentication> => {
      return getPersisted().map(value => restore(value));
    },
  });

  const createRequest = (
    type: GrantType,
    value: Value
  ): [string, GoogleAppsScript.URL_Fetch.URLFetchRequestOptions] => {
    const options = createRequestOptions(type, value);

    Logger.log(
      'Request upstream %s %s.',
      `${endpoint}/oauth2/token`,
      JSON.stringify(options)
    );

    return [`${endpoint}/oauth2/token`, options];
  };

  const createRequestOptions = (
    type: GrantType,
    value: Value
  ): GoogleAppsScript.URL_Fetch.URLFetchRequestOptions => {
    const authorizationHeader = Utilities.base64Encode(
      `${clientId}:${clientSecret}`
    );

    return {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      payload: writer.write([type, value]),
      muteHttpExceptions: true,
      headers: {
        Authorization: `Basic ${authorizationHeader}`,
      },
    };
  };

  const getPersisted = (): Array<PersistedAuthentication> => {
    const content = persistClient.find('AUTHENTICATIONS')!;

    return JSON.parse(content) as Array<PersistedAuthentication>;
  };

  const restore = (value: PersistedAuthentication): Authentication => {
    return Authentication({
      identifier: AuthenticationIdentifier(value.identifier),
      accessToken: value.accessToken,
      type: typeSchema.parse(value.type),
      expiresIn: value.expiresIn,
      refreshToken: value.refreshToken,
      scope: value.scope.map(value => scopeTypeSchema.parse(value)),
    });
  };

  const serialize = (
    authentication: Authentication
  ): PersistedAuthentication => ({
    identifier: { value: authentication.identifier.value },
    accessToken: authentication.accessToken,
    type: authentication.type,
    expiresIn: authentication.expiresIn,
    refreshToken: authentication.refreshToken,
    scope: authentication.scope,
  });

  return delegate;
};

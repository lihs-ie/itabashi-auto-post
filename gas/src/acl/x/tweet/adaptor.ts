import { PersistClient } from '../../../aspects/script-properties';
import { Message } from '../../../domains/message';
import { AbstractAdaptor, Writer } from '../../common';

export type Adaptor = {
  send: (message: Message) => void;
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
  writer: Writer<Message>,
  endpoint: string,
  persistClient: PersistClient<{ AUTHENTICATIONS: string }>
): ReturnType<typeof AbstractAdaptor<Adaptor>> => {
  const delegate = AbstractAdaptor<Adaptor>({
    send: (message: Message): void => {
      try {
        const request = createRequest(message);

        const response = UrlFetchApp.fetch(...request);

        if (!delegate.verifyStatus(response.getResponseCode())) {
          delegate.handleErrorResponse(response);
        }

        Logger.log('Response from upstream. %s', response);
      } catch (error) {
        Logger.log('Failed to request upstream. %s', error);
        throw error;
      }
    },
  });

  const createRequest = (
    message: Message
  ): [string, GoogleAppsScript.URL_Fetch.URLFetchRequestOptions] => {
    const options = createRequestOptions(message);
    const apiEndpoint = `${endpoint}/tweets`;

    Logger.log('Request upstream. %s %s', apiEndpoint, options);

    return [apiEndpoint, options];
  };

  const createRequestOptions = (
    message: Message
  ): GoogleAppsScript.URL_Fetch.URLFetchRequestOptions => {
    const persisted = JSON.parse(
      persistClient.find('AUTHENTICATIONS')!
    ) as Array<PersistedAuthentication>;

    const authentication = persisted.find(
      item => item.identifier.value === message.authentication.value
    );

    if (!authentication) {
      throw new Error('Authentication not found.');
    }

    return {
      method: 'post',
      contentType: 'application/json',
      payload: writer.write(message),
      muteHttpExceptions: true,
      headers: {
        Authorization: `Bearer ${authentication.accessToken}`,
      },
    };
  };

  return delegate;
};

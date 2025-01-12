import { TokenResponse } from '../../../src/x/token/common';
import { issueToken } from '../../../src/x/token/issue';
import * as user from '../../../src/x/user';
import { MockScriptProperties } from '../../helpers/properties';
import { createFetchMock } from '../../helpers/url-fetch-app';

const endpoint = 'http://localhost:3000/token';
const clientId = 'test-client-id';
const clientSecret = 'test-client-secret';
const redirectUri = 'http://localhost:3000';
const code = 'test-code';
const accessToken = 'test-access-token';
const accounts = '[]';

describe('Package issue', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('issueToken', () => {
    beforeEach(() => {
      MockScriptProperties.setInitialStore({
        OAUTH_CLIENT_ID: clientId,
        OAUTH_CLIENT_SECRET: clientSecret,
        OAUTH_REDIRECT_URI: redirectUri,
        OAUTH_TOKEN_ENDPOINT: endpoint,
        ADMIN_MAIL_ADDRESS: 'test-mail-address',
        USER_ENDPOINT: 'http://localhost:3000/user',
        TWITTER_ACCOUNTS: accounts,
      });
    });

    it('success returns user-id', () => {
      jest.spyOn(user, 'getUserId').mockReturnValue('test-user-id');

      const content = JSON.stringify({
        access_token: accessToken,
        token_type: 'bearer',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        scope: 'read write',
        refreshRetryCount: 0,
      } as TokenResponse);

      createFetchMock({
        getContentText: () => content,
        getResponseCode: () => 200,
      });

      const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: 'post',
        contentType: 'application/x-www-form-urlencoded',
        payload: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}&code_verifier=challenge`,
        headers: {
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
      };

      const actual = issueToken(code);
      expect(actual).toBe('test-user-id');

      expect(user.getUserId).toHaveBeenCalledWith(accessToken);

      const called = UrlFetchApp.fetch as jest.Mock;

      expect(called).toHaveBeenCalledWith(endpoint, options);
    });
  });
});

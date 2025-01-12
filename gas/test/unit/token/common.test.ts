import {
  getTokenOfUserId,
  persistTokenResponse,
  removeToken,
  TokenResponse,
} from '../../../src/x/token/common';
import { MockScriptProperties } from '../../helpers/properties';

const mockDateNow = 1672531200000;

describe('Package common', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => mockDateNow);

    MockScriptProperties.setInitialStore({
      TWITTER_ACCOUNTS: '[]',
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('persistTokenResponse', () => {
    describe('success', () => {
      it('persist token response with new user-id', () => {
        const userId = 'test-user-id';

        const response: TokenResponse = {
          access_token: 'test-access-token',
          token_type: 'bearer',
          refresh_token: 'test-refresh-token',
          expires_in: 3600,
          scope: 'read write',
          refreshRetryCount: 0,
        };

        persistTokenResponse(userId, response);

        const actual = JSON.parse(
          MockScriptProperties.store['TWITTER_ACCOUNTS']
        );

        const expected = [
          {
            [userId]: {
              ...response,
              expires_in: Date.now() + response.expires_in * 1000,
              refreshRetryCount: 0,
            },
          },
        ];

        expect(actual).toEqual(expected);

        const userId2 = 'test-user-id-2';

        const response2: TokenResponse = {
          access_token: 'test-access-token-2',
          token_type: 'bearer',
          refresh_token: 'test-refresh-token-2',
          expires_in: 3600,
          scope: 'read write',
          refreshRetryCount: 0,
        };

        persistTokenResponse(userId2, response2);

        const actual2 = JSON.stringify([
          {
            [userId]: {
              ...response,
              expires_in: Date.now() + response.expires_in * 1000,
              refreshRetryCount: 0,
            },
          },
          {
            [userId2]: {
              ...response2,
              expires_in: Date.now() + response2.expires_in * 1000,
              refreshRetryCount: 0,
            },
          },
        ]);

        expect(actual2).toBe(MockScriptProperties.store['TWITTER_ACCOUNTS']);
      });

      it('persist token response with existing user-id', () => {
        const userId = 'test-user-id';

        const response: TokenResponse = {
          access_token: `${Math.random().toFixed(16)}`,
          token_type: 'bearer',
          refresh_token: `${Math.random().toFixed(16)}`,
          expires_in: Math.floor(Math.random() * 1000),
          scope: 'read write',
          refreshRetryCount: Math.floor(Math.random() * 10),
        };

        const actual = JSON.stringify([
          {
            [userId]: {
              ...response,
              expires_in: Date.now() + response.expires_in * 1000,
              refreshRetryCount: 0,
            },
          },
        ]);

        persistTokenResponse(userId, response);

        expect(actual).toBe(MockScriptProperties.store['TWITTER_ACCOUNTS']);
      });
    });
  });

  describe('removeToken', () => {
    describe('success', () => {
      beforeEach(() => {
        MockScriptProperties.setInitialStore({
          TWITTER_ACCOUNTS: JSON.stringify([{ 'test-user-id': {} }]),
        });
      });

      it('remove token with existing user-id', () => {
        const userId = 'test-user-id';

        const actual = JSON.stringify([]);

        removeToken(userId);

        expect(actual).toBe(MockScriptProperties.store['TWITTER_ACCOUNTS']);
      });

      it('remove token with non-existing user-id', () => {
        const userId = 'non-existing-user-id-2';

        const actual = JSON.stringify([{ 'test-user-id': {} }]);

        removeToken(userId);

        expect(actual).toBe(MockScriptProperties.store['TWITTER_ACCOUNTS']);
      });
    });
  });

  describe('getTokenOfUserId', () => {
    beforeEach(() => {
      MockScriptProperties.setInitialStore({
        TWITTER_ACCOUNTS: JSON.stringify([{ 'test-user-id': {} }]),
      });
    });

    it.each([
      { userId: 'test-user-id', expected: {} },
      { userId: 'non-existing-user-id', expected: null },
    ])('success returns expected', value => {
      const actual = getTokenOfUserId(value.userId);

      expect(actual).toEqual(value.expected);
    });
  });
});

import { checkLogin, getUserId } from '../../src/x/user';
import { MockScriptProperties } from '../helpers/properties';
import { createFetchMock } from '../helpers/url-fetch-app';

const endpoint = 'http://localhost:3000/user';
const accessToken = 'test-access-token';

describe('Package user', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUserId', () => {
    beforeEach(() => {
      MockScriptProperties.setInitialStore({
        USER_ENDPOINT: endpoint,
      });
    });

    it('success returns user-id', () => {
      const expected = 'test-user-id';
      const content = JSON.stringify({ data: { id: expected } });

      createFetchMock({
        getContentText: () => content,
        getResponseCode: () => 200,
      });

      const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const actual = getUserId(accessToken);

      expect(actual).toBe(expected);

      const called = UrlFetchApp.fetch as jest.Mock;

      expect(called).toHaveBeenCalledWith(endpoint, options);
    });
  });

  describe('checkLogin', () => {
    const mockDateNow = 1000;
    const userId = 'test-user-id';

    beforeEach(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => mockDateNow);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each([
      {
        userId,
        expires_in: mockDateNow + 100,
        expected: true,
      },
      {
        userId,
        expires_in: mockDateNow - 100,
        expected: false,
      },
      {
        userId,
        expires_in: mockDateNow,
        expected: false,
      },
    ])('returns expected value %s', expected => {
      MockScriptProperties.setInitialStore({
        TWITTER_ACCOUNTS: JSON.stringify([
          {
            [userId]: {
              expires_in: expected.expires_in,
            },
          },
        ]),
      });

      const actual = checkLogin(expected.userId);

      expect(actual).toBe(expected.expected);
    });
  });
});

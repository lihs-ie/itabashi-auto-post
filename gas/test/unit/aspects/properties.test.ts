import {
  getAllProperties,
  getProperty,
  Properties,
  setProperty,
} from '../../../src/aspects/properties';
import { MockScriptProperties } from '../../helpers/properties';

describe('Package properties', () => {
  const key = 'OAUTH_CLIENT_ID';
  const value = 'test-client-id';

  beforeEach(() => {
    MockScriptProperties.setInitialStore({
      OAUTH_CLIENT_ID: 'test-client-id',
      OAUTH_CLIENT_SECRET: 'test-client-secret',
    });
  });

  describe('getProperty', () => {
    it('success returns value', () => {
      const actual = getProperty(key);

      expect(actual).toBe(value);
    });

    it('failure throws error with missing key.', () => {
      const key = 'ADMIN_MAIL_ADDRESS';
      expect(() => getProperty(key)).toThrow(`Property ${key} not found`);
    });
  });

  describe('getAllProperties', () => {
    it('success returns values', () => {
      const keys = ['OAUTH_CLIENT_ID', 'OAUTH_CLIENT_SECRET'] as Properties[];
      const expected = ['test-client-id', 'test-client-secret'];

      const actual = getAllProperties<[clientId: string, clientSecret: string]>(
        ...keys
      );

      expect(actual).toEqual(expected);
    });

    it('failure throws error with missing key.', () => {
      const key = 'ADMIN_MAIL_ADDRESS';

      expect(() => getAllProperties(key)).toThrow(`Property ${key} not found`);
    });
  });

  describe('setProperty', () => {
    it('success persist value', () => {
      const key = 'OAUTH_CLIENT_ID';
      const value = 'new-client-id';

      setProperty(key, value);

      expect(MockScriptProperties.store[key]).toBe(value);
    });
  });
});

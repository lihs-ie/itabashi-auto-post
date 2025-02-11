import { Builder } from 'test/factory/common';
import { AuthenticationFactory } from 'test/factory/domains/authentication/common';
import { PropertiesServiceMock } from 'test/mock/google';
import { ScriptPropertyMock } from 'test/mock/google/properties-service/script-property';
import { allRefresh } from '@/kernel/batch/refresh';
import { prepare } from 'test/mock/upstreams/x';
import { useCase } from '@/providers/use-cases/authentication';

describe('Package refresh', () => {
  const authentications = Builder(AuthenticationFactory).buildList(3, {
    expiresIn: Date.now() + 1000,
  });

  describe('all-refresh', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1000);

      global.PropertiesService = new PropertiesServiceMock(
        new ScriptPropertyMock({
          AUTHENTICATIONS: JSON.stringify(authentications),
        })
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('successfully refreshes all authentications.', async () => {
      authentications.forEach(authentication => {
        prepare('http://localhost/api', upstream =>
          upstream.addOauth('ok', authentication)
        );
      });

      allRefresh(useCase);
    });
  });
});

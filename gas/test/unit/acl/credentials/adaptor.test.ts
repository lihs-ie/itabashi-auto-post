import { Adaptor, Reader, Translator } from '@/acl/credentials';
import { persistClient } from '@/aspects/script-properties';
import { Builder, StringFactory } from 'test/factory/common';
import 'jest-to-equal-type';
import { AbstractAdaptor } from '@/acl/common';
import { sha256 } from '@/aspects/hash';
import { PropertiesServiceMock } from 'test/mock/google';
import { ScriptPropertyMock } from 'test/mock/google/properties-service/script-property';
import { PasswordFactory } from 'test/factory/domains/credentials/common';

const salt = Builder(StringFactory(1, 255)).build();

const createAdaptor = () =>
  Adaptor(Reader(), Translator(), salt, persistClient());

describe('Package adaptor', () => {
  describe('Adaptor', () => {
    describe('instantiate', () => {
      it('successfully returns Adaptor.', () => {
        const adaptor = Adaptor(Reader(), Translator(), salt, persistClient());

        expect(adaptor).toEqualType<AbstractAdaptor<Adaptor>>();
      });
    });

    describe('verify', () => {
      const password = Builder(PasswordFactory).build();
      const hashedPassword = sha256(password.value + salt);

      beforeEach(() => {
        global.PropertiesService = new PropertiesServiceMock(
          new ScriptPropertyMock({
            GAS_PASSWORD: JSON.stringify({ value: hashedPassword }),
          })
        );
      });

      it('successfully returns true with valid password.', async () => {
        const adaptor = createAdaptor();

        const actual = adaptor.verify(password);

        expect(actual).toBeTruthy();
      });

      it('unsuccessfully returns false with invalid password.', async () => {
        const adaptor = createAdaptor();

        const actual = adaptor.verify(Builder(PasswordFactory).build());

        expect(actual).toBeFalsy();
      });
    });
  });
});

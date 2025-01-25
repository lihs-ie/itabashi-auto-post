import { Media, Translator } from '@/acl/credentials';
import { Translator as BaseTranslator } from '@/acl/common';
import { HashedPassword } from '@/domains/credentials';
import { sha256 } from '@/aspects/hash';
import { Builder, StringFactory } from 'test/factory/common';
import 'jest-to-equal-type';

describe('Package translator', () => {
  describe('Translator', () => {
    describe('instantiate', () => {
      it('successfully returns Translator.', () => {
        const translator = Translator();

        expect(translator).toEqualType<BaseTranslator<Media, HashedPassword>>();
      });
    });

    describe('translate', () => {
      it('successfully returns Media.', () => {
        const media = {
          value: sha256(Builder(StringFactory(1, 255)).build()),
        };

        const translator = Translator();

        const actual = translator.translate(media);

        expect(actual).toEqualType<HashedPassword>();
        expect(actual.value).toBe(media.value);
      });
    });
  });
});

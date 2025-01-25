import { Reader as BaseReader } from '@/acl/common';
import { Media, Reader } from '@/acl/credentials';
import { sha256 } from '@/aspects/hash';
import { Builder, StringFactory } from 'test/factory/common';
import 'jest-to-equal-type';

describe('Package media-types', () => {
  describe('Reader', () => {
    describe('instantiate', () => {
      it('successfully returns Reader.', () => {
        const reader = Reader();

        expect(reader).toEqualType<BaseReader<Media>>();
      });
    });

    describe('read', () => {
      it('successfully returns Media.', () => {
        const expected = {
          value: sha256(Builder(StringFactory(1, 255)).build()),
        };

        const reader = Reader();

        const actual = reader.read(JSON.stringify(expected));

        expect(actual).toEqual(expected);
      });
    });
  });
});

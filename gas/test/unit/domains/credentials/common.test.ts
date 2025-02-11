import { HashedPassword, Password } from '@/domains/credentials';
import { Builder, StringFactory } from 'test/factory/common';
import 'jest-to-equal-type';
import { ValueObjectTest } from '../common';
import { sha256 } from '@/aspects/hash';

describe('Package common', () => {
  describe('Password', () => {
    describe('instantiate', () => {
      it('successfully instantiates a password', () => {
        const value = Builder(StringFactory(8, 255)).build();

        const password = Password({ value });

        expect(password.value).toBe(value);
      });
    });

    ValueObjectTest<Password>(
      Password,
      { value: Builder(StringFactory(8, 255)).build() },
      [{ value: Builder(StringFactory(8, 255)).build() }],
      [{ value: '' }, { value: '1234567' }, { value: 'a'.repeat(256) }]
    );
  });

  describe('HashedPassword', () => {
    describe('instantiate', () => {
      it('successfully instantiates a hashed password', () => {
        const value = sha256(Builder(StringFactory(8, 255)).build());

        const hashedPassword = HashedPassword({ value });

        expect(hashedPassword.value).toBe(value);
      });
    });

    ValueObjectTest<HashedPassword>(
      HashedPassword,
      { value: sha256(Builder(StringFactory(8, 255)).build()) },
      [{ value: sha256(Builder(StringFactory(8, 255)).build()) }],
      [{ value: '' }, { value: '1234567' }, { value: 'a'.repeat(61) }]
    );
  });
});

import { AbstractAdaptor, Reader, Translator } from '../common';
import { HashedPassword, Password } from '../../domains/credentials';
import { Media } from './media-type';
import { sha256 } from '@/aspects/hash';
import { PersistClient } from '@/aspects/script-properties';

export type Adaptor = {
  verify: (password: Password) => boolean;
};

export const Adaptor = (
  reader: Reader<Media>,
  translator: Translator<Media, HashedPassword>,
  salt: string,
  persistClient: PersistClient<{ GAS_PASSWORD: string }>
): ReturnType<typeof AbstractAdaptor<Adaptor>> =>
  AbstractAdaptor<Adaptor>({
    verify: (password: Password): boolean => {
      const comparand = sha256(password.value + salt);

      const media = reader.read(persistClient.find('GAS_PASSWORD')!);

      const hashed = translator.translate(media);

      return hashed.value === comparand;
    },
  });

import { HashedPassword } from '../../domains/credentials';
import { Translator as BaseTranslator } from '../common';
import { Media } from './media-type';

export const Translator = (): BaseTranslator<Media, HashedPassword> => {
  const translate = (media: Media): HashedPassword => {
    return HashedPassword({ value: media.value });
  };

  return { translate };
};

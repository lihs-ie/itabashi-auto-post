import {
  Authentication,
  AuthenticationIdentifier,
  typeSchema,
} from '../../../domains/authentication';
import { ScopeType, scopeTypeSchema } from '../../../domains/authorization';
import { Translator as BaseTranslator } from '../../common';
import { Media } from './media-type';

export const Translator = (): BaseTranslator<Media, Authentication> => {
  const translate = (
    media: Media,
    identifier?: AuthenticationIdentifier
  ): Authentication => {
    const nextIdentifier =
      identifier ?? AuthenticationIdentifier({ value: Utilities.getUuid() });
    const type = typeSchema.parse(media.tokenType);

    return Authentication({
      ...media,
      identifier: nextIdentifier,
      type,
      scope: translateScope(media.scope),
      expiresIn: media.expiresIn * 1000 + Date.now(),
    });
  };

  const translateScope = (scope: string): Array<ScopeType> => {
    return scope.split(' ').map((value): ScopeType => {
      switch (value) {
        case 'tweet.write':
          return scopeTypeSchema.parse('write');
        case 'tweet.read':
          return scopeTypeSchema.parse('read');
        case 'users.read':
          return scopeTypeSchema.parse('user');
        case 'offline.access':
          return scopeTypeSchema.parse('refresh');
        default:
          throw new Error(`Unknown scope: ${value}`);
      }
    });
  };

  return { translate };
};

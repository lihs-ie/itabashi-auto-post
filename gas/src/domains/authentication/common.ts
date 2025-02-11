import { z } from 'zod';
import { Code, scopeTypeSchema } from '../authorization';
import { typeSchema } from './token';
import {
  Properties,
  ValueObject,
  valueObjectSchema,
} from '../common/value-object';

export const authenticationIdentifierSchema = valueObjectSchema(
  z.object({
    value: z.string().uuid(),
  }),
  'AuthenticationIdentifier'
);

export type AuthenticationIdentifier = z.infer<
  typeof authenticationIdentifierSchema
>;

export const AuthenticationIdentifier = (
  properties: Properties<AuthenticationIdentifier>
) =>
  ValueObject<AuthenticationIdentifier>(
    properties,
    authenticationIdentifierSchema
  );

export const authenticationSchema = z
  .object({
    identifier: authenticationIdentifierSchema,
    accessToken: z.string().min(1).max(255),
    refreshToken: z.string().min(1).max(255),
    type: typeSchema,
    expiresIn: z.number().min(1),
    scope: z.array(scopeTypeSchema).min(1),
    verify: z.function().returns(z.boolean()),
  })
  .brand('Authentication');

export type Authentication = z.infer<typeof authenticationSchema>;

export const Authentication = (
  properties: Properties<Authentication>
): Authentication => {
  const verify = () => {
    if (properties.expiresIn < Date.now()) {
      return false;
    }

    return true;
  };

  return authenticationSchema.parse({ ...properties, verify });
};

export interface Repository {
  create: (code: Code) => Authentication;
  refresh: (authentication: Authentication) => Authentication;
  remove: (identifier: AuthenticationIdentifier) => void;
  persist: (authentication: Authentication) => void;
  find: (identifier: AuthenticationIdentifier) => Authentication;
  list: () => Array<Authentication>;
}

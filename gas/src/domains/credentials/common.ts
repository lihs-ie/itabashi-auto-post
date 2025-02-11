import { z } from 'zod';
import { Properties, ValueObject, valueObjectSchema } from '../common';

export const passwordSchema = valueObjectSchema(
  z.object({
    value: z.string().min(8).max(255),
  }),
  'Password'
);

export type Password = z.infer<typeof passwordSchema>;

export const Password = (
  properties: Properties<Password>
): ValueObject<Password> => ValueObject<Password>(properties, passwordSchema);

export const hashedPasswordSchema = valueObjectSchema(
  z.object({
    value: z.string().length(64),
  }),
  'HashedPassword'
);

export type HashedPassword = z.infer<typeof hashedPasswordSchema>;

export const HashedPassword = (
  properties: Properties<HashedPassword>
): ValueObject<HashedPassword> =>
  ValueObject<HashedPassword>(properties, hashedPasswordSchema);

export interface Repository {
  verify: (password: Password) => boolean;
}

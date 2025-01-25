import { z } from 'zod';
import {
  Properties,
  ValueObject,
  valueObjectSchema,
} from '../common/value-object';

export const userIdentifierSchema = valueObjectSchema(
  z.object({
    value: z.string().min(1),
  }),
  'UserIdentifier'
);

export type UserIdentifier = z.infer<typeof userIdentifierSchema>;

export const UserIdentifier = (properties: Properties<UserIdentifier>) =>
  ValueObject<UserIdentifier>(properties, userIdentifierSchema);

export const userSchema = z
  .object({
    identifier: userIdentifierSchema,
    name: z.string().min(1),
  })
  .brand('User');

export type User = z.infer<typeof userSchema>;

export const User = (properties: Properties<User>): User =>
  userSchema.parse(properties);

export interface Repository {
  find: (identifier: UserIdentifier) => Promise<User | null>;
  ofToken: (token: string) => Promise<User>;
  persist: (user: User) => Promise<void>;
  list: () => Promise<User[]>;
}

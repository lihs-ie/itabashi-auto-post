import { z } from 'zod';
import { Properties, ValueObject, valueObjectSchema } from '../common';

export const scopeType = {
  READ: 'read',
  WRITE: 'write',
  USER: 'user',
  REFRESH: 'refresh',
} as const;

export const scopeTypeSchema = z.nativeEnum(scopeType).brand('ScopeType');

export type ScopeType = z.infer<typeof scopeTypeSchema>;

export const codeSchema = valueObjectSchema(
  z.object({
    value: z.string().min(1).max(100),
    verifier: z.string().min(43).max(128),
  }),
  'Code'
);

export type Code = z.infer<typeof codeSchema>;

export const Code = (properties: Properties<Code>): ValueObject<Code> =>
  ValueObject<Code>(properties, codeSchema);

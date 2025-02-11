import { z } from 'zod';

export const Type = {
  BEARER: 'bearer',
} as const;

export const typeSchema = z.nativeEnum(Type).brand('TokenType');

export type Type = z.infer<typeof typeSchema>;

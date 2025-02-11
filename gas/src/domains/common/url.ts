import { z } from 'zod';
import { Properties, ValueObject, valueObjectSchema } from './value-object';

// GASにデプロイされた時url()が使えないので、URLのバリデーションはしない
export const urlSchema = valueObjectSchema(
  z.object({
    value: z.string().min(1),
  }),
  'URL'
);

export type URL = z.infer<typeof urlSchema>;

export const URL = (properties: Properties<URL>) =>
  ValueObject<URL>(properties, urlSchema);

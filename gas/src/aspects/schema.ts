import { z } from 'zod';

export const addRecursion = <B extends z.ZodObject<any>, F extends object>(
  base: B,
  fields: F
) => {
  const key = Object.keys(fields)[0] || null;

  if (key === null) {
    throw new Error('The field must have at least one key.');
  }

  type Combined = z.infer<typeof base> & {
    [key in keyof F]: Combined;
  };

  const combinedSchema: z.ZodType<Combined> = base.extend({
    [key]: z.lazy(() => combinedSchema),
  }) as z.ZodType<Combined>;

  return combinedSchema;
};

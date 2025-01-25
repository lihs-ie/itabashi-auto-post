import { z } from 'zod';
import { Properties, urlSchema, URL } from '../common';
import { authenticationIdentifierSchema } from '../authentication';

export const messageSchema = z
  .object({
    identifier: urlSchema,
    authentication: authenticationIdentifierSchema,
    content: z.string().min(1).max(255),
  })
  .brand('Message');

export type Message = z.infer<typeof messageSchema>;

export const Message = (properties: Properties<Message>): Message => {
  return messageSchema.parse({
    ...properties,
    identifier: URL(properties.identifier),
    content: properties.content,
  });
};

export interface Repository {
  send: (message: Message) => void;
}

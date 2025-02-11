import { URL } from "domains/common"
import { Message } from "domains/message"
import { Builder, Factory, StringFactory } from "tests/factories/common"

import { URLFactory } from "../common"

export type MessageProperties = {
  identifier: URL
  content: string
}

export class MessageFactory extends Factory<Message, MessageProperties> {
  protected instantiate(properties: MessageProperties): Message {
    return new Message(properties.identifier, properties.content)
  }

  protected prepare(
    overrides: Partial<MessageProperties>,
    seed: number
  ): MessageProperties {
    return {
      identifier: Builder.get(URLFactory).buildWith(seed),
      content: Builder.get(StringFactory(1, 255)).buildWith(seed),
      ...overrides
    }
  }

  protected retrieve(instance: Message): MessageProperties {
    return {
      identifier: instance.identifier,
      content: instance.content
    }
  }
}

import { Body } from "acl/itabashi-auto-post-gas/message"
import { Message } from "domains/message"
import { Response as ResponseValueObject } from "domains/response"
import { Builder, StringFactory } from "tests/factories/common"
import { MessageFactory } from "tests/factories/domains/message"
import { ResponseFactory } from "tests/factories/domains/response"

import { Type } from "../../common"
import { MessageMedia } from "../media"
import { ItabashiAutoPostGasResource } from "./common"

export type Overrides = {
  model: ResponseValueObject<{}>
  message: Message
  password: string
}

export class MessageResource extends ItabashiAutoPostGasResource<
  Type,
  Overrides,
  {}
> {
  private static readonly CODE_PREFIX = "itabashi-auto-post-gas/message"
  private media: MessageMedia

  public constructor(type: Type, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(ResponseFactory).build(),
        message: Builder.get(MessageFactory).build(),
        password: Builder.get(StringFactory(1, 60)).build()
      }
    )

    this.media = new MessageMedia(this.overrides.model)
  }

  public code(): string {
    const suffix = Object.values(this.overrides.model).join("/")

    return `${MessageResource.CODE_PREFIX}/${this.overrides.password}/${suffix}`
  }

  public async matches(request: Request, uri: string): Promise<boolean> {
    if (request.method !== "POST") {
      return false
    }

    if (!uri.startsWith("/")) {
      return false
    }

    if (!(await this.matchBody(request))) {
      return false
    }

    return true
  }

  public content(): string {
    return this.media.createSuccessfulContent()
  }

  protected createSuccessfulResponse(_: Request): Response {
    return new Response(this.content())
  }

  private async matchBody(request: Request): Promise<boolean> {
    const body = JSON.parse(await request.text()) as Body

    if (!body) {
      return false
    }

    const message = this.overrides.message

    if (body.payload.password !== this.overrides.password) {
      return false
    }

    if (body.payload.identifier !== message.identifier.value) {
      return false
    }

    if (body.payload.content !== message.content) {
      return false
    }

    return true
  }
}

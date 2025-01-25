import { LogoutBody } from "acl/itabashi-auto-post-gas/authentication"
import { AuthenticationIdentifier } from "domains/authentication"
import { Builder, StringFactory } from "tests/factories/common"
import { AuthenticationIdentifierFactory } from "tests/factories/domains/authentications"

import { Type } from "../../../common"
import { LogoutMedia } from "../../media/authentication/logout"
import { ItabashiAutoPostGasResource } from "../common"

export type Overrides = { model: AuthenticationIdentifier; password: string }

export class LogoutResource extends ItabashiAutoPostGasResource<
  Type,
  Overrides,
  {}
> {
  private static readonly CODE_PREFIX =
    "itabashi-auto-post-gas/authentication/logout"
  private media: LogoutMedia

  public constructor(type: Type, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(AuthenticationIdentifierFactory).build(),
        password: Builder.get(StringFactory(1, 60)).build()
      }
    )

    this.media = new LogoutMedia(this.overrides.model)
  }

  public code(): string {
    const suffix = Object.values(this.overrides.model).join("/")

    return `${LogoutResource.CODE_PREFIX}/${this.overrides.password}/${suffix}`
  }

  public async matches(request: Request, uri: string): Promise<boolean> {
    if (request.method !== "POST") {
      return false
    }

    if (!uri.startsWith("/")) {
      return false
    }

    if (request.headers.get("Content-Type") !== "application/json") {
      return false
    }

    if (!this.matchBody(request)) {
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
    const body = JSON.parse(await request.text()) as LogoutBody

    if (body.action !== "logout") {
      return false
    }

    if (body.payload.authentication !== this.overrides.model.value) {
      return false
    }

    if (body.payload.password !== this.overrides.password) {
      return false
    }

    return true
  }
}

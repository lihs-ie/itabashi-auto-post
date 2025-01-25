import { LoginBody } from "acl/itabashi-auto-post-gas/authentication"
import { AuthenticationIdentifier, Code } from "domains/authentication"
import { Builder, StringFactory } from "tests/factories/common"
import {
  AuthenticationIdentifierFactory,
  CodeFactory
} from "tests/factories/domains/authentications"

import { Type } from "../../../common"
import { LoginMedia } from "../../media"
import { ItabashiAutoPostGasResource } from "../common"

export type Overrides = {
  model: AuthenticationIdentifier
  code: Code
  password: string
}

export class LoginResource extends ItabashiAutoPostGasResource<
  Type,
  Overrides,
  {}
> {
  private static readonly CODE_PREFIX =
    "itabashi-auto-post-gas/authentication/login"
  private media: LoginMedia

  public constructor(type: Type, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(AuthenticationIdentifierFactory).build(),
        code: Builder.get(CodeFactory).build(),
        password: Builder.get(StringFactory(1, 60)).build()
      }
    )

    this.media = new LoginMedia(this.overrides.model)
  }

  public code(): string {
    const suffix = Object.values(this.overrides.model).join("/")

    return `${LoginResource.CODE_PREFIX}/${this.overrides.password}/${suffix}`
  }

  public async matches(request: Request, uri: string): Promise<boolean> {
    if (request.method !== "POST") {
      return false
    }

    if (!uri.startsWith("/")) {
      return false
    }

    const header = request.headers.get("Content-Type")

    if (header !== "application/json") {
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
    const body = JSON.parse(await request.text()) as LoginBody

    if (body.action !== "login") {
      return false
    }

    const payload = body.payload

    if (payload.password !== this.overrides.password) {
      return false
    }

    if (payload.code.value !== this.overrides.code.identifier) {
      return false
    }

    if (payload.code.verifier !== this.overrides.code.verifier) {
      return false
    }

    return true
  }
}

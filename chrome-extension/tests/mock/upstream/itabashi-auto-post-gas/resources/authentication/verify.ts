import { RawVerifyMedia } from "acl/itabashi-auto-post-gas/authentication"
import { AuthenticationIdentifier } from "domains/authentication"
import { Builder } from "tests/factories/common"
import { AuthenticationIdentifierFactory } from "tests/factories/domains/authentications"

import { Type } from "../../../common"
import { VerifyMedia } from "../../media/authentication/verify"
import { ItabashiAutoPostGasResource } from "../common"

export type Overrides = {
  model: AuthenticationIdentifier
  active?: boolean
  status?: number
}

export class VerifyResource extends ItabashiAutoPostGasResource<
  Type,
  Overrides,
  {}
> {
  private static readonly CODE_PREFIX =
    "itabashi-auto-post-gas/authentication/verify"
  private media: VerifyMedia

  public constructor(type: Type, overrides?: Overrides) {
    super(
      type,
      overrides ?? {
        model: Builder.get(AuthenticationIdentifierFactory).build(),
        active: Math.random() > 0.5
      }
    )

    this.media = new VerifyMedia({
      status: this.overrides.status !== undefined ? this.overrides.status : 200,
      payload: { active: this.overrides.active }
    })
  }

  public code(): string {
    return `${VerifyResource.CODE_PREFIX}/${this.overrides.model.value}`
  }

  public async matches(request: Request, uri: string): Promise<boolean> {
    if (request.method !== "GET") {
      return false
    }

    if (!uri.startsWith(`/authentications/${this.overrides.model.value}`)) {
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
}

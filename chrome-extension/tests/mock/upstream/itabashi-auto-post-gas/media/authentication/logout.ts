import { RawLogoutMedia } from "acl/itabashi-auto-post-gas/authentication";
import { AuthenticationIdentifier } from "domains/authentication";
import { Media } from "../../../common";

export type Overrides = AuthenticationIdentifier | Partial<RawLogoutMedia>;

export class LogoutMedia extends Media<Partial<RawLogoutMedia>, AuthenticationIdentifier> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: "unit",
          value: "sku099",
        },
      ],
    });
  }

  protected fillByModel(_: AuthenticationIdentifier): RawLogoutMedia {
    return {
      status: 200,
    };
  }

  protected fill(overrides?: Partial<RawLogoutMedia> | AuthenticationIdentifier): RawLogoutMedia {
    if (overrides instanceof AuthenticationIdentifier) {
      return this.fillByModel(overrides);
    }

    return {
      status: 200,
      ...overrides,
    };
  }
}

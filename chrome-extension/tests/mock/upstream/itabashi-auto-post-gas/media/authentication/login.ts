import { RawLoginMedia } from "acl/itabashi-auto-post-gas/authentication";
import { AuthenticationIdentifier } from "domains/authentication";
import { Media } from "../../../common";
import { v4 as uuid } from "uuid";

export type Overrides = AuthenticationIdentifier | Partial<RawLoginMedia>;

export class LoginMedia extends Media<Partial<RawLoginMedia>, AuthenticationIdentifier> {
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

  protected fillByModel(overrides: AuthenticationIdentifier): RawLoginMedia {
    return {
      status: 200,
      payload: {
        authentication: overrides.value,
      },
    };
  }

  protected fill(overrides?: Partial<RawLoginMedia> | AuthenticationIdentifier): RawLoginMedia {
    if (overrides instanceof AuthenticationIdentifier) {
      return this.fillByModel(overrides);
    }

    return {
      status: 200,
      payload: {
        authentication: uuid(),
      },
      ...overrides,
    };
  }
}

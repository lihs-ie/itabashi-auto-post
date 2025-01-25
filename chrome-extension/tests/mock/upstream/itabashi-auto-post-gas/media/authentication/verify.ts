import { RawVerifyMedia } from "acl/itabashi-auto-post-gas/authentication";
import { Media } from "../../../common";

export type Overrides = Partial<RawVerifyMedia>;

export class VerifyMedia extends Media<Partial<RawVerifyMedia>, {}> {
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

  protected fillByModel(_: {}): RawVerifyMedia {
    throw new Error("Method not implemented.");
  }

  protected fill(overrides?: Partial<RawVerifyMedia>): RawVerifyMedia {
    return {
      status: 200,
      payload: {
        active: Math.random() < 0.5,
      },
      ...overrides,
    };
  }
}

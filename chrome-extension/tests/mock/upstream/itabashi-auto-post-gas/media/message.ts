import { RawMedia } from "acl/itabashi-auto-post-gas/message"
import { Response } from "domains/response"

import { Media } from "../../common"

export type Overrides = Response<{}> | Partial<RawMedia>

export class MessageMedia extends Media<Partial<RawMedia>, Response<{}>> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data)
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: "unit",
          value: "sku099"
        }
      ]
    })
  }

  protected fillByModel(response: Response<{}>): RawMedia {
    return {
      status: response.status
    }
  }

  protected fill(overrides?: Partial<RawMedia> | Response<{}>): RawMedia {
    if (overrides instanceof Response) {
      return this.fillByModel(overrides)
    }

    return {
      status: 200,
      ...overrides
    }
  }
}

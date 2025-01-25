import { ValueObject } from "domains/common";
import { Map } from "immutable";

export class Response<T> extends ValueObject {
  constructor(public readonly status: number, public readonly payload?: T) {
    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({ status: this.status, payload: this.payload });
  }
}

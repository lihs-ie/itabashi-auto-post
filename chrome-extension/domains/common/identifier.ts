import { Map } from "immutable";
import { ValueObject } from "./value-object";

export abstract class UniversallyUniqueIdentifier extends ValueObject {
  public static readonly VALID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  constructor(public readonly value: string) {
    if (!UniversallyUniqueIdentifier.VALID_PATTERN.test(value)) {
      throw new Error("Value must be a UUID format.");
    }

    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({ value: this.value });
  }
}

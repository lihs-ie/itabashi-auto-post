import { UniversallyUniqueIdentifier } from "domains/common";
import { injectable } from "inversify";

export class AuthenticationIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}

export class Code {
  public constructor(public readonly identifier: string, public readonly verifier: string) {
    if (identifier === "") {
      throw new Error("Value must not be empty.");
    }

    if (255 < identifier.length) {
      throw new Error("Value must not be longer than 255 characters.");
    }

    if (verifier.length < 43 || 128 < verifier.length) {
      throw new Error("Value must be between 43 and 128 characters long.");
    }
  }
}

@injectable()
export abstract class Repository {
  public abstract issueCode(): Promise<Code>;
  public abstract login(code: Code): Promise<AuthenticationIdentifier>;
  public abstract logout(): Promise<void>;
  public abstract verify(): Promise<void>;
  public abstract remove(): Promise<void>;
}

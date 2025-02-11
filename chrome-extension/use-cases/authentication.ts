import { AuthenticationIdentifier, Repository } from "domains/authentication";
import { Code } from "domains/authentication";
import { injectable } from "inversify";

@injectable()
export class Authentication {
  public constructor(public readonly repository: Repository) {}

  public async issueCode(): Promise<Code> {
    return this.repository.issueCode();
  }

  public async login(code: Code): Promise<AuthenticationIdentifier> {
    return this.repository.login(code);
  }

  public async logout(): Promise<void> {
    return this.repository.logout();
  }

  public async verify(): Promise<void> {
    return this.repository.verify();
  }

  public async remove(): Promise<void> {
    return this.repository.remove();
  }
}

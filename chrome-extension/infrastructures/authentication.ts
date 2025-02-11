import { Adaptor as GASAdaptor } from "acl/itabashi-auto-post-gas/authentication";
import { Adaptor as XAdaptor } from "acl/x/oauth";
import { AuthenticationIdentifier, Code, Repository } from "domains/authentication";
import { injectable } from "inversify";

@injectable()
export class ACLAuthenticationRepository implements Repository {
  constructor(
    private readonly xAdaptor: XAdaptor,
    private readonly persistenceAdaptor: GASAdaptor
  ) {}

  public async issueCode(): Promise<Code> {
    return await this.xAdaptor.issueCode();
  }

  public async login(code: Code): Promise<AuthenticationIdentifier> {
    return await this.persistenceAdaptor.login(code);
  }

  public async logout(): Promise<void> {
    await this.persistenceAdaptor.logout();
  }

  public async verify(): Promise<void> {
    await this.persistenceAdaptor.verify();
  }

  public async remove(): Promise<void> {
    await this.persistenceAdaptor.remove();
  }
}

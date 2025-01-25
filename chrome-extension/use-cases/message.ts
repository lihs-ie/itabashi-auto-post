import { AuthenticationIdentifier } from "domains/authentication";
import { URL } from "domains/common";
import { Repository, Message as Entity } from "domains/message";
import { injectable } from "inversify";

@injectable()
export class Message {
  public constructor(public readonly repository: Repository) {}

  public async send(identifier: string, content: string): Promise<void> {
    const entity = new Entity(
      new URL(identifier, false),
      content
    );

    await this.repository.send(entity);
  }
}

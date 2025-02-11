import { Adaptor } from "acl/itabashi-auto-post-gas/message";
import { Message, Repository } from "domains/message";
import { injectable } from "inversify";

@injectable()
export class ACLMessageRepository implements Repository {
  constructor(private readonly adaptor: Adaptor) {}

  public async send(message: Message): Promise<void> {
    await this.adaptor.send(message);
  }
}

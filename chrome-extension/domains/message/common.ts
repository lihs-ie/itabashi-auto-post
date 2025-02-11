import { URL } from "domains/common";
import { injectable } from "inversify";

export class Message {
  public constructor(
    public readonly identifier: URL,
    public readonly content: string
  ) {}
}

@injectable()
export abstract class Repository {
  public abstract send: (message: Message) => Promise<void>;
}

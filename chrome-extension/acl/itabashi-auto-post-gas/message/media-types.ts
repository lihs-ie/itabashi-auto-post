import { injectable } from "inversify";
import {
  Writer as BaseWriter,
  Payload,
  RawMedia as BaseRawMedia,
  Reader as BaseReader,
} from "acl/common";
import { Message } from "domains/message";
import { AuthenticationIdentifier } from "domains/authentication";

export type RawMedia = Omit<BaseRawMedia, "payload">;

export type Media = RawMedia;

@injectable()
export class Reader implements BaseReader<Media> {
  public read(content: string): Media {
    return JSON.parse(content) as Media;
  }
}

export type Body = Payload<{
  identifier: string;
  authentication: string;
  content: string;
}>

@injectable()
export class Writer implements BaseWriter<[Message, AuthenticationIdentifier]> {
  constructor(private readonly password: string) {}
  public write(args: [message:Message, authentication: AuthenticationIdentifier]): string {
    const [message, authentication] = args;
  
    const body: Body = {
      payload: {
        identifier: message.identifier.value,
        authentication: authentication.value,
        content: message.content,
        password: this.password,
      },
      action: "sendMessage",
    };

    return JSON.stringify(body);
  }
}

import { AbstractAdaptor } from "acl/common";
import { Message } from "domains/message";
import { injectable } from "inversify";
import { Reader, Writer } from "./media-types";
import { Translator } from "./translator";
import { AuthenticationIdentifier } from "domains/authentication";

@injectable()
export class Adaptor extends AbstractAdaptor {
  constructor(
    private readonly writer: Writer,
    private readonly reader: Reader,
    private readonly translator: Translator,
    private readonly endpoint: string,
    private readonly persistClient: chrome.storage.LocalStorageArea
  ) {
    super();
  }

  public async send(message: Message): Promise<void> {
    const request = await this.createRequest(message);

    try {
      const response = await fetch(...request);

      if (!response.ok) {
        this.handleErrorResponse(response);
      }

      const media = this.reader.read(await response.text());

      const responseObject = this.translator.translate(media);

      if (!this.verifyStatus(responseObject.status)) {
        this.handleErrorResponse(new Response('', {status: responseObject.status}));
      }
    } catch (error) {
      throw error;
    }
  }

  private async createRequest(message: Message): Promise<[RequestInfo, RequestInit] > {
    return [this.endpoint, await this.createRequestOptions(message)];
  }

  private async createRequestOptions(message: Message): Promise<RequestInit> {
    const authentication = await this.getAuthentication();

    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: this.writer.write([message, authentication]),
    };
  }

    private async getAuthentication(): Promise<AuthenticationIdentifier> {
      try {
        const authentication = await this.persistClient.get("AUTHENTICATION");
  
        if (!authentication) {
          throw new Error("Authentication not found.");
        }
  
        return new AuthenticationIdentifier(authentication['AUTHENTICATION']);
      } catch (error) {
        throw new Error("Authentication not found.");
      }
    }
}

import { AbstractAdaptor, type Action, PersistClient, type Reader, type Writer } from "acl/common";
import { injectable } from "inversify";
import { Map } from "immutable";
import { Translator } from "./translator";
import { AuthenticationIdentifier, Code } from "domains/authentication";
import { LoginReader, LoginWriter, LogoutReader, LogoutWriter, VerifyMedia, VerifyReader } from "./media-types";

type Readers = Map<string, Reader<any>>;
type Writers = Map<string, Writer<any>>;

@injectable()
export class Adaptor extends AbstractAdaptor {
  constructor(
    private readonly readers: Readers,
    private readonly writers: Writers,
    private readonly translator: Translator,
    private readonly endpoint: string,
    private readonly persistClient: PersistClient
  ) {
    if (!readers.has("login") || !readers.has("logout") || !readers.has("verify")) {
      throw new Error("Readers must contain login, logout, and verify.");
    }

    if (!(readers.get("login") instanceof LoginReader)) {
      throw new Error("Reader for login must be an instance of LoginReader.");
    }

    if (!(readers.get("logout") instanceof LogoutReader)) {
      throw new Error("Reader for logout must be an instance of LogoutReader.");
    }

    if (!(readers.get("verify") instanceof VerifyReader)) {
      throw new Error("Reader for verify must be an instance of VerifyReader.");
    }

    if (!writers.has("login") || !writers.has("logout")) {
      throw new Error("Writers must contain login and logout.");
    }

    if (!(writers.get("login") instanceof LoginWriter)) {
      throw new Error("Writer for login must be an instance of LoginWriter.");
    }

    if (!(writers.get("logout") instanceof LogoutWriter)) {
      throw new Error("Writer for logout must be an instance of LogoutWriter.");
    }

    super();
  }

  public async login(code: Code): Promise<AuthenticationIdentifier> {
    try {
      const [request, options] = await this.createRequest("login", code);

      const response = await fetch(request, options);

      if (!response.ok) {
        this.handleErrorResponse(response);
      }

      const content = await response.text();

      const loginReader = this.readers.get("login")!;

      const media = loginReader.read(content);

      if (!this.verifyStatus(media.status)) {
        throw new Error(`Failed to login: ${media.status}`);
      }

      const authentication = this.translator.translate(media);

      await this.persistClient.persist("AUTHENTICATION", authentication.value);

      return authentication;
    } catch (error) {
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      const request = await this.createRequest("logout");

      const response = await fetch(...request);

      if (!response.ok) {
        this.handleErrorResponse(response);
      }

      const content = await response.text();

      const logoutReader = this.readers.get("logout")!;

      const media = logoutReader.read(content);

      if (!this.verifyStatus(media.status)) {
        throw new Error(`Failed to logout: ${media.status}`);
      }

      await this.persistClient.remove("AUTHENTICATION");
    } catch (error) {
      throw new Error(`Failed to logout: ${error as Error}`);
    }
  }

  public async verify(): Promise<void> {
    try {
      const request = await this.createVerifyRequest();

      const response = await fetch(request);

      if (!response.ok) {
        this.handleErrorResponse(response);
      }

      const content = await response.text();

      const verifyReader = this.readers.get("verify")!;

      const media: VerifyMedia = verifyReader.read(content);

      if (!this.verifyStatus(media.status)) {
        throw new Error(`Failed to verify: ${media.status}`);
      }

      if (!media.payload.active) {
        await this.persistClient.remove("AUTHENTICATION");
      }
    } catch (error) {
      await this.persistClient.remove("AUTHENTICATION");
      throw error;
    }
  }

  public async remove(): Promise<void> {
    await this.persistClient.remove('AUTHENTICATION');
  }

  private async getAuthentication(): Promise<AuthenticationIdentifier> {
    try {
      const authentication = await this.persistClient.retrieve<string>("AUTHENTICATION");

      if (!authentication) {
        throw new Error("Authentication not found.");
      }

      return new AuthenticationIdentifier(authentication);
    } catch (error) {
      throw new Error("Authentication not found.");
    }
  }

  private async createRequest(action: Action, code?: Code): Promise<[RequestInfo, RequestInit]> {
    const options = await this.createRequestOptions(action, code);

    return [this.endpoint, options];
  }

  private async createVerifyRequest(): Promise<RequestInfo> {
    const authentication = await this.getAuthentication();

    return `${this.endpoint}/authentications/${authentication.value}`;
  }

  private async createRequestOptions(action: Action, code?: Code): Promise<RequestInit> {
    const common : RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    switch (action) {
      case "login":
        const loginWriter = this.writers.get("login")!;
        return {
          ...common,
          body: loginWriter.write(code),
        };

      case "logout":
        const logoutWriter = this.writers.get("logout")!;
        const authentication = await this.getAuthentication();

        return {
          ...common,
          body: logoutWriter.write(authentication),
        };

      case "verify":
        return {};
      default:
        throw new Error(`Invalid action ${action}.`);
    }
  }
}

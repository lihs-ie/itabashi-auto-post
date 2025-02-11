import { AbstractAdaptor } from "acl/common";
import { Code } from "domains/authentication";
import { injectable } from "inversify";
import { Translator } from "./translator";
import { sha256 } from "js-sha256";

@injectable()
export class Adaptor extends AbstractAdaptor {
  constructor(
    private readonly translator: Translator,
    private readonly endpoint: string,
    private readonly redirectURI: string,
    private readonly clientId: string
  ) {
    super();
  }

  public async issueCode(): Promise<Code> {
    try {
      const state = this.createState();
      const verifier = this.createVerifier();
      const challenge = this.toCodeChallenge(verifier);

      const request = this.createRequest(state, challenge);

      const response = await chrome.identity.launchWebAuthFlow({
        url: request,
        interactive: true,
      });

      return this.translator.translate(response, state, verifier);
    } catch (error) {
      console.log("Failed to issue code:", error);
      throw error;
    }
  }

  private createRequest(state: string, challenge: string): string {
    const query = new URLSearchParams();

    query.append("redirect_uri", this.redirectURI);
    query.append("client_id", this.clientId);
    query.append("response_type", "code");
    query.append("scope", "tweet.write tweet.read users.read offline.access");
    query.append("state", state);
    query.append("code_challenge", challenge);
    query.append("code_challenge_method", "S256");

    return `${this.endpoint}?${query.toString()}`;
  }

  private createState(): string {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
  }

  private createVerifier(): string {
      const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43;

      let verifier = "";

      while (verifier.length < length) {
        verifier += Math.random().toString(36).substring(2);
      }

      return verifier.substring(0, length);
  }

  private toCodeChallenge(verifier: string): string {
    const hash = sha256.create().update(verifier).hex();

    let source = Buffer.from(hash, 'hex').toString('base64');
  
    source = source.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  
    return source;
  }
}

import { injectable } from "inversify";
import { Translator as BaseTranslator } from "acl/common";
import { Code } from "domains/authentication";

@injectable()
export class Translator implements BaseTranslator<string, Code> {
  constructor(private readonly redirectURI: string) {}

  public translate(codeURI: string, state: string, verifier: string): Code {
    if (!codeURI.startsWith(this.redirectURI)) {
      throw new Error("Invalid redirect URI.");
    }

    const url = new URL(codeURI);
    const code = url.searchParams.get("code");
    const extractedState = url.searchParams.get("state");

    if (!code || extractedState !== state) {
      throw new Error("Authorization code not found or state mismatch.");
    }

    return new Code(code, verifier);
  }
}

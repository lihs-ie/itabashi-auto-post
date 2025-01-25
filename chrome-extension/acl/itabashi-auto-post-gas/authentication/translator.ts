import { injectable } from "inversify";
import { Translator as BaseTranslator } from "acl/common";
import { AuthenticationIdentifier } from "domains/authentication";
import { LoginMedia } from "./media-types";

@injectable()
export class Translator implements BaseTranslator<LoginMedia, AuthenticationIdentifier> {
  public translate(media: LoginMedia): AuthenticationIdentifier {
    return new AuthenticationIdentifier(media.payload.authentication);
  }
}

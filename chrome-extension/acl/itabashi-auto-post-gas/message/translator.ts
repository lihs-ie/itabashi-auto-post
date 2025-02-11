import { Translator as BaseTranslator } from "acl/common";
import { injectable } from "inversify";
import { Media } from "./media-types";
import { Response } from "domains/response";

@injectable()
export class Translator implements BaseTranslator<Media, Response<{}>> {
  public translate(media: Media): Response<{}> {
    return new Response(media.status);
  }
}

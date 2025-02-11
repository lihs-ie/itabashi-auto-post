import { Translator as BaseTranslator } from "acl/common";
import { injectable } from "inversify";
import { Media } from "./media-type";
import { Interval, Notification, NotificationIdentifier } from "domains/setting/notification";

@injectable()
export class Translator implements BaseTranslator<Media, Notification> {
  public translate(media: Media): Notification {
    return new Notification(
      new NotificationIdentifier(media.identifier),
      media.title,
      media.content,
      media.description,
      media.interval ? new Interval(media.interval.time, media.interval.unit) : null,
      media.active,
      media.priority
    );
  }
}

import {
  asPriority,
  asTimeUnit,
  Notification,
  Priority,
  TimeUnit,
} from "domains/setting/notification";
import { Reader as BaseReader, Writer as BaseWriter } from "acl/common";
import { injectable } from "inversify";

export type RawMedia = {
  identifier: string;
  title: string;
  content: string;
  description: string | null;
  interval: null | {
    time: number;
    unit: string;
  };
  active: boolean;
  priority: string;
};

export type Media = {
  identifier: string;
  title: string;
  content: string;
  description: string | null;
  interval:null| {
    time: number;
    unit: TimeUnit;
  };
  active: boolean;
  priority: Priority;
};

@injectable()
export class Reader implements BaseReader<Media> {
  public read(content: string): Media {
    const media = JSON.parse(content) as RawMedia;

    return {
      identifier: media.identifier,
      title: media.title,
      content: media.content,
      description: media.description,
      interval: media.interval ?{
        time: media.interval.time,
        unit: asTimeUnit(media.interval.unit),
      } : null,
      active: media.active,
      priority: asPriority(media.priority),
    };
  }
}

@injectable()
export class Writer implements BaseWriter<Notification> {
  public write(notification: Notification): string {
    return JSON.stringify({
      identifier: notification.identifier.value,
      title: notification.title,
      content: notification.content,
      description: notification.description,
      interval: notification.interval ?{
        time: notification.interval.time,
        unit: notification.interval.unit,
      } : null,
      active: notification.active,
      priority: notification.priority,
    });
  }
}

import { RawMedia } from "acl/setting/notification"
import { Notification } from "domains/setting/notification"
import { Builder, StringFactory } from "tests/factories/common"
import {
  IntervalFactory,
  PriorityFactory
} from "tests/factories/domains/setting"
import { Media } from "tests/mock/storage/common"
import { v4 as uuid } from "uuid"

export type Overrides = Partial<RawMedia> | Notification

export class NotificationMedia extends Media<Partial<RawMedia>, Notification> {
  public createContent(): string {
    return JSON.stringify(this.data())
  }

  protected fillByModel(overrides: Notification): RawMedia {
    return {
      identifier: overrides.identifier.value,
      title: overrides.title,
      content: overrides.content,
      description: overrides.description,
      interval: overrides.interval
        ? {
            time: overrides.interval.time,
            unit: overrides.interval.unit
          }
        : null,
      active: overrides.active,
      priority: overrides.priority
    }
  }

  protected fill(overrides?: Partial<RawMedia> | Notification): RawMedia {
    if (overrides instanceof Notification) {
      return this.fillByModel(overrides)
    }

    const interval = Builder.get(IntervalFactory).build()

    return {
      identifier: uuid(),
      title: Builder.get(StringFactory(1, 255)).build(),
      content: Builder.get(StringFactory(1, 255)).build(),
      description: null,
      interval: null,
      active: Math.random() < 0.5,
      priority: Builder.get(PriorityFactory).build(),
      ...overrides
    }
  }
}

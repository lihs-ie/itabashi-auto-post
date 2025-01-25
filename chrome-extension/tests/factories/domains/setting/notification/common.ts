import {
  Interval,
  Notification,
  NotificationIdentifier,
  Priority,
  TimeUnit
} from "domains/setting/notification"
import {
  Builder,
  EnumFactory,
  Factory,
  StringFactory
} from "tests/factories/common"

import { UniversallyUniqueIdentifierFactory } from "../../common"

export const TimeUnitFactory = EnumFactory(TimeUnit)

export type IntervalProperties = {
  unit: TimeUnit
  time: number
}

export class IntervalFactory extends Factory<Interval, IntervalProperties> {
  protected instantiate(properties: IntervalProperties): Interval {
    return new Interval(properties.time, properties.unit)
  }

  protected prepare(
    overrides: Partial<IntervalProperties>,
    seed: number
  ): IntervalProperties {
    return {
      unit: Builder.get(TimeUnitFactory).buildWith(seed),
      time: Math.abs(seed),
      ...overrides
    }
  }

  protected retrieve(instance: Interval): IntervalProperties {
    return {
      unit: instance.unit,
      time: instance.time
    }
  }
}

export class NotificationIdentifierFactory extends UniversallyUniqueIdentifierFactory<NotificationIdentifier>(
  NotificationIdentifier
) {}

export const PriorityFactory = EnumFactory(Priority)

export type NotificationProperties = {
  identifier: NotificationIdentifier
  title: string
  content: string
  description: string | null
  interval: Interval | null
  active: boolean
  priority: Priority
}

export class NotificationFactory extends Factory<
  Notification,
  NotificationProperties
> {
  protected instantiate(properties: NotificationProperties): Notification {
    return new Notification(
      properties.identifier,
      properties.title,
      properties.content,
      properties.description,
      properties.interval,
      properties.active,
      properties.priority
    )
  }

  protected prepare(
    overrides: Partial<NotificationProperties>,
    seed: number
  ): NotificationProperties {
    return {
      identifier: Builder.get(NotificationIdentifierFactory).buildWith(seed),
      title: Builder.get(StringFactory(1, 255)).buildWith(seed),
      content: Builder.get(StringFactory(1, 255)).buildWith(seed),
      description: null,
      interval: Builder.get(IntervalFactory).buildWith(seed),
      active: seed % 2 === 0,
      priority: Builder.get(PriorityFactory).buildWith(seed),
      ...overrides
    }
  }

  protected retrieve(instance: Notification): NotificationProperties {
    return {
      identifier: instance.identifier,
      title: instance.title,
      content: instance.content,
      description: instance.description,
      interval: instance.interval,
      active: instance.active,
      priority: instance.priority
    }
  }
}

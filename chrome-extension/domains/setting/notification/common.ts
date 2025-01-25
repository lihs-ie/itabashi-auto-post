import { UniversallyUniqueIdentifier, ValueObject } from "domains/common"
import { List, Map, Set } from "immutable"

export const TimeUnit = {
  SECOND: "second",
  MINUTE: "minute",
  HOUR: "hour"
} as const

export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit]

export const isTimeUnit = (value: unknown): value is TimeUnit => {
  return Set(Object.values(TimeUnit)).has(value as TimeUnit)
}

export const asTimeUnit = (value: unknown): TimeUnit => {
  if (!isTimeUnit(value)) {
    throw new Error("TimeUnit must be one of second, minute, hour.")
  }

  return value
}

export class Interval extends ValueObject {
  public constructor(
    public readonly time: number,
    public readonly unit: TimeUnit
  ) {
    if (time < 0) {
      throw new Error("time must be greater than 0.")
    }

    super()
  }

  protected properties(): Map<string, unknown> {
    return Map({ time: this.time, unit: this.unit })
  }

  public toMinutes(): number {
    switch (this.unit) {
      case TimeUnit.SECOND:
        return this.time / 60
      case TimeUnit.MINUTE:
        return this.time
      case TimeUnit.HOUR:
        return this.time * 60
    }
  }
}

export class NotificationIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value)
  }
}

export const Priority = {
  HIGH: "high",
  NORMAL: "normal",
  LOW: "low"
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]

export const isPriority = (value: unknown): value is Priority => {
  return Set(Object.values(Priority)).has(value as Priority)
}

export const asPriority = (value: unknown): Priority => {
  if (!isPriority(value)) {
    throw new Error("Priority must be one of high, normal, low.")
  }

  return value
}

export class Notification {
  public constructor(
    public readonly identifier: NotificationIdentifier,
    public readonly title: string,
    public readonly content: string,
    public readonly description: string | null,
    public readonly interval: Interval | null,
    public readonly active: boolean,
    public readonly priority: Priority
  ) {
    if (title === "" || 255 < title.length) {
      throw new Error("Title must be between 1 and 255 characters.")
    }

    if (content === "" || 255 < content.length) {
      throw new Error("Content must be between 1 and 255 characters.")
    }

    if (
      description !== null &&
      (description === "" || 255 < description.length)
    ) {
      throw new Error("Description must be between 1 and 255 characters.")
    }
  }

  public activate(): Notification {
    return new Notification(
      this.identifier,
      this.title,
      this.content,
      this.description,
      this.interval,
      true,
      this.priority
    )
  }

  public deactivate(): Notification {
    return new Notification(
      this.identifier,
      this.title,
      this.content,
      this.description,
      this.interval,
      false,
      this.priority
    )
  }
}

export abstract class Repository {
  public abstract persist(notification: Notification): Promise<void>
  public abstract remove(identifier: NotificationIdentifier): Promise<void>
  public abstract find(
    identifier: NotificationIdentifier
  ): Promise<Notification>
  public abstract list(): Promise<List<Notification>>
  public abstract send(identifier: NotificationIdentifier): Promise<void>
}

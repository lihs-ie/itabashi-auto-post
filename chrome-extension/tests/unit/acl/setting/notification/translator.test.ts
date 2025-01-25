import { Reader, Translator } from "acl/setting/notification"
import { Interval, Notification } from "domains/setting/notification"
import { Builder } from "tests/factories/common"
import { NotificationFactory } from "tests/factories/domains/setting"
import { NotificationMedia } from "tests/mock/storage/media/setting/notification"
import { describe, expect, it } from "vitest"

describe("Package translator", () => {
  describe("class Translator", () => {
    describe("translate", () => {
      it.each([
        Builder.get(NotificationFactory).build(),
        Builder.get(NotificationFactory).build({ interval: null })
      ])("success returns Notification", (expected) => {
        const media = new NotificationMedia(expected)

        const translator = new Translator()
        const reader = new Reader()

        const actual = translator.translate(reader.read(media.createContent()))

        expect(actual).toBeInstanceOf(Notification)
        expect(expected.identifier.equals(actual.identifier)).toBeTruthy()
        expect(actual.title).toBe(expected.title)
        expect(actual.content).toBe(expected.content)
        expect(actual.description).toBe(expected.description)
        expect(actual.interval).toBeNullOr(
          expected.interval,
          (expectedInterval, actualInterval) => {
            expect(expectedInterval).toBeInstanceOf(Interval)
            expect(expectedInterval.equals(actualInterval)).toBeTruthy()
          }
        )

        expect(actual.active).toBe(expected.active)
        expect(actual.priority).toBe(expected.priority)
      })
    })
  })
})

import { Reader, Writer } from "acl/setting/notification"
import { Builder } from "tests/factories/common"
import { NotificationFactory } from "tests/factories/domains/setting"
import { NotificationMedia } from "tests/mock/storage/media/setting/notification"
import { describe, expect, it } from "vitest"

describe("Package media-type", () => {
  describe("class Reader", () => {
    describe("read", () => {
      it("success returns Media", () => {
        const notification = Builder.get(NotificationFactory).build()

        const media = new NotificationMedia(notification)

        const reader = new Reader()

        const actual = reader.read(media.createContent())

        expect(actual.identifier).toBe(notification.identifier.value)
        expect(actual.title).toBe(notification.title)
        expect(actual.content).toBe(notification.content)
        expect(actual.description).toBe(notification.description)
        expect(actual.interval.time).toBe(notification.interval.time)
        expect(actual.interval.unit).toBe(notification.interval.unit)
        expect(actual.active).toBe(notification.active)
        expect(actual.priority).toBe(notification.priority)
      })
    })
  })

  describe("class Writer", () => {
    describe("write", () => {
      it.each([
        Builder.get(NotificationFactory).build({ interval: null }),
        Builder.get(NotificationFactory).build()
      ])("success returns string with %s", (notification) => {
        const media = new NotificationMedia(notification)

        const writer = new Writer()

        const expected = media.createContent()

        const actual = writer.write(notification)

        expect(actual).toBe(expected)
      })
    })
  })
})

import { Adaptor, Reader, Translator, Writer } from "acl/setting/notification"
import { List } from "immutable"
import { Builder, StringFactory } from "tests/factories/common"
import { URLFactory } from "tests/factories/domains/common"
import {
  NotificationFactory,
  NotificationIdentifierFactory
} from "tests/factories/domains/setting"
import { createMock } from "tests/mock/chrome/notification"
import { LocalStorageMock } from "tests/mock/chrome/storage"
import { describe, expect, it } from "vitest"

const createAdaptor = (
  key: string,
  storage: LocalStorageMock,
  iconUrl: string
) =>
  new Adaptor(
    new Reader(),
    new Writer(),
    new Translator(),
    key,
    { create: createMock } as any,
    iconUrl,
    storage
  )

const writer = new Writer()

describe("Package adaptor", () => {
  describe("class adaptor", () => {
    describe("persist", () => {
      it("successfully persist new-notification.", async () => {
        const notification = Builder.get(NotificationFactory).build()
        const storage = new LocalStorageMock()
        const key = Builder.get(StringFactory(1, 20)).build()

        const adaptor = createAdaptor(
          key,
          storage,
          Builder.get(URLFactory).build().value
        )

        await adaptor.persist(notification)

        const persisted = await storage.get(key)

        expect(persisted[key][0]).toBe(writer.write(notification))
      })

      it("successfully persist notification with existing-notification.", async () => {
        const before = Builder.get(NotificationFactory).build()
        const storage = new LocalStorageMock()
        const key = Builder.get(StringFactory(1, 20)).build()

        await storage.set({
          [key]: [writer.write(before)]
        })

        const adaptor = createAdaptor(
          key,
          storage,
          Builder.get(URLFactory).build().value
        )

        const after = Builder.get(NotificationFactory).build({
          identifier: before.identifier
        })

        await adaptor.persist(after)

        const persisted = await storage.get(key)
        expect(persisted[key][0]).toBe(writer.write(after))
        expect(persisted[key]).toHaveLength(1)
      })

      it("successfully persist notification with existing-notification and new-notification.", async () => {
        const existence = Builder.get(NotificationFactory).build()
        const storage = new LocalStorageMock()
        const key = Builder.get(StringFactory(1, 20)).build()

        await storage.set({
          [key]: [writer.write(existence)]
        })

        const adaptor = createAdaptor(
          key,
          storage,
          Builder.get(URLFactory).build().value
        )

        const newbie = Builder.get(NotificationFactory).build()

        await adaptor.persist(newbie)

        const persisted = await storage.get(key)
        expect(persisted[key][0]).toBe(writer.write(existence))
        expect(persisted[key][1]).toBe(writer.write(newbie))
        expect(persisted[key]).toHaveLength(2)
      })
    })

    describe("remove", () => {
      it("successfully remove notification.", async () => {
        const notifications = Builder.get(NotificationFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        )
        const storage = new LocalStorageMock()
        const key = Builder.get(StringFactory(1, 20)).build()

        await storage.set({
          [key]: notifications
            .map((notification) => writer.write(notification))
            .toArray()
        })

        const target = notifications.get(
          Math.floor(Math.random() * notifications.size)
        )!

        const adaptor = createAdaptor(
          key,
          storage,
          Builder.get(URLFactory).build().value
        )

        await adaptor.remove(target.identifier)

        const persisted = await storage.get(key)
        List(persisted[key] as Array<string>).forEach((notification) => {
          const parsed = JSON.parse(notification) as { identifier: string }
          expect(parsed.identifier).not.toBe(target.identifier.value)
        })
      })

      describe("unsuccessfully", () => {
        it("throws error with missing identifier.", async () => {
          const notifications = Builder.get(NotificationFactory).buildList(
            Math.floor(Math.random() * 10) + 1
          )
          const storage = new LocalStorageMock()
          const key = Builder.get(StringFactory(1, 20)).build()

          await storage.set({
            [key]: notifications
              .map((notification) => writer.write(notification))
              .toArray()
          })

          const adaptor = createAdaptor(
            key,
            storage,
            Builder.get(URLFactory).build().value
          )

          await expect(
            adaptor.remove(Builder.get(NotificationIdentifierFactory).build())
          ).rejects.toThrow()
        })
      })
    })

    describe("find", () => {
      describe("successfully", () => {
        it("returns notification.", async () => {
          const notifications = Builder.get(NotificationFactory).buildList(
            Math.floor(Math.random() * 10) + 1
          )
          const storage = new LocalStorageMock()
          const key = Builder.get(StringFactory(1, 20)).build()

          await storage.set({
            [key]: notifications
              .map((notification) => writer.write(notification))
              .toArray()
          })

          const expected = notifications.get(
            Math.floor(Math.random() * notifications.size)
          )!

          const adaptor = createAdaptor(
            key,
            storage,
            Builder.get(URLFactory).build().value
          )

          const actual = await adaptor.find(expected.identifier)

          expect(expected.identifier.equals(actual.identifier)).toBeTruthy()
          expect(actual.title).toBe(expected.title)
          expect(actual.content).toBe(expected.content)
          expect(expected.interval.equals(actual.interval)).toBeTruthy()
          expect(actual.active).toBe(expected.active)
          expect(actual.priority).toBe(expected.priority)
        })
      })
    })

    describe("list", () => {
      describe("successfully", () => {
        it("returns notifications.", async () => {
          const expecteds = Builder.get(NotificationFactory).buildList(
            Math.floor(Math.random() * 10) + 1
          )
          const storage = new LocalStorageMock()
          const key = Builder.get(StringFactory(1, 20)).build()

          await storage.set({
            [key]: expecteds
              .map((notification) => writer.write(notification))
              .toArray()
          })

          const adaptor = createAdaptor(
            key,
            storage,
            Builder.get(URLFactory).build().value
          )

          const actuals = await adaptor.list()

          expect(actuals.count()).toBe(expecteds.count())

          expecteds.zip(actuals).forEach(([expected, actual]) => {
            expect(expected.identifier.equals(actual.identifier)).toBeTruthy()
            expect(actual.title).toBe(expected.title)
            expect(actual.content).toBe(expected.content)
            expect(expected.interval.equals(actual.interval)).toBeTruthy()
            expect(actual.active).toBe(expected.active)
            expect(actual.priority).toBe(expected.priority)
          })
        })
      })
    })

    describe("send", () => {
      describe("successfully", () => {
        it("sends notification.", async () => {
          const notification = Builder.get(NotificationFactory).build()
          const storage = new LocalStorageMock()
          const key = Builder.get(StringFactory(1, 20)).build()

          await storage.set({
            [key]: [writer.write(notification)]
          })

          const adaptor = createAdaptor(
            key,
            storage,
            Builder.get(URLFactory).build().value
          )

          await adaptor.send(notification.identifier)
        })
      })
    })
  })
})

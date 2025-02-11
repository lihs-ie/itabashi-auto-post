import { NotificationIdentifier } from "domains/setting/notification"
import { describe } from "node:test"
import { ValueObjectTest } from "tests/domains/common/value-object"
import { v4 } from "uuid"
import { expect, it } from "vitest"

describe("Package common", () => {
  describe("class notification-identifier", () => {
    describe("instantiate", () => {
      it("success returns NotificationIdentifier", () => {
        const identifier = new NotificationIdentifier(v4())
        expect(identifier).toBeInstanceOf(NotificationIdentifier)
      })

      it.each(["", "invalid"])(
        "failure throws error with invalid-value %s",
        (invalid) => {
          expect(() => new NotificationIdentifier(invalid)).toThrowError()
        }
      )
    })

    type Properties = ConstructorParameters<typeof NotificationIdentifier>
    const generator = (): Properties => [v4()]

    ValueObjectTest<NotificationIdentifier, Properties>(
      NotificationIdentifier,
      generator,
      () => [[v4()]]
    )
  })
})

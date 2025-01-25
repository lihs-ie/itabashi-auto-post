import { Body, Reader, Writer } from "acl/itabashi-auto-post-gas/message"
import { Builder } from "tests/factories/common"
import { AuthenticationIdentifierFactory } from "tests/factories/domains/authentications"
import { MessageFactory } from "tests/factories/domains/message"
import { MessageMedia } from "tests/mock/upstream/itabashi-auto-post-gas/media"
import { describe, expect, it } from "vitest"

describe("Package media-type", () => {
  describe("class Reader", () => {
    describe("read", () => {
      it("success returns Media", () => {
        const media = new MessageMedia()

        const expected = media.data()

        const reader = new Reader()

        const actual = reader.read(media.createSuccessfulContent())

        expect(actual.status).toBe(expected.status)
      })
    })
  })

  describe("Class Writer", () => {
    describe("write", () => {
      it("success returns string", () => {
        const password = "password"
        const message = Builder.get(MessageFactory).build()
        const authentication = Builder.get(
          AuthenticationIdentifierFactory
        ).build()

        const expected = JSON.stringify({
          payload: {
            identifier: message.identifier.value,
            authentication: authentication.value,
            content: message.content,
            password
          },
          action: "sendMessage"
        } as Body)

        const writer = new Writer(password)

        const actual = writer.write([message, authentication])

        expect(actual).toBe(expected)
      })
    })
  })
})

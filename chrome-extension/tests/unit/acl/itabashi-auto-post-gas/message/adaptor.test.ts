import {
  Adaptor,
  Reader,
  Translator,
  Writer
} from "acl/itabashi-auto-post-gas/message"
import { Status } from "aspects/http"
import { Response } from "domains/response"
import { Builder, StringFactory } from "tests/factories/common"
import { AuthenticationIdentifierFactory } from "tests/factories/domains/authentications"
import { MessageFactory } from "tests/factories/domains/message"
import { LocalStorageMock } from "tests/mock/chrome/storage"
import { prepare } from "tests/mock/upstream/itabashi-auto-post-gas"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

const endpoint = "http://localhost:3000"
const password = Builder.get(StringFactory(1, 20)).build()

const createAdaptor = (storage: LocalStorageMock) =>
  new Adaptor(
    new Writer(password),
    new Reader(),
    new Translator(),
    endpoint,
    storage
  )

describe("Package adaptor", () => {
  describe("class adaptor", () => {
    describe("send", () => {
      beforeEach(() => {
        fetchMock.enableMocks()
      })

      afterEach(() => {
        fetchMock.resetMocks()
        fetchMock.disableMocks()
      })

      it("success send message.", async () => {
        const authentication = Builder.get(
          AuthenticationIdentifierFactory
        ).build()
        const storage = new LocalStorageMock({
          AUTHENTICATION: authentication.value
        })

        const message = Builder.get(MessageFactory).build()

        prepare(endpoint, (upstream) =>
          upstream.addMessage("ok", {
            message,
            password,
            model: new Response(200)
          })
        )

        const adaptor = createAdaptor(storage)

        await adaptor.send(message)
      })

      it.each(
        Object.values(Status).filter((status) => {
          if (status === Status.OK) {
            return false
          }

          if (status === Status.CREATED) {
            return false
          }

          if (status === Status.NO_CONTENT) {
            return false
          }

          return true
        })
      )("failed send message with status %s.", async (status) => {
        const authentication = Builder.get(
          AuthenticationIdentifierFactory
        ).build()
        const storage = new LocalStorageMock({
          AUTHENTICATION: authentication.value
        })

        const message = Builder.get(MessageFactory).build()

        prepare(endpoint, (upstream) =>
          upstream.addMessage("ok", {
            message,
            password,
            model: new Response(status)
          })
        )

        const adaptor = createAdaptor(storage)

        await expect(() => adaptor.send(message)).rejects.toThrow()
      })
    })
  })
})

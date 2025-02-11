import { Translator } from "acl/itabashi-auto-post-gas/message"
import { Status } from "aspects/http"
import { Response } from "domains/response"
import { MessageMedia } from "tests/mock/upstream/itabashi-auto-post-gas/media"
import { describe, expect, it } from "vitest"

describe("Package translator", () => {
  describe("class Translator", () => {
    describe("translate", () => {
      it.each(Object.values(Status))("success returns string", (status) => {
        const translator = new Translator()
        const media = new MessageMedia({ status })

        const actual = translator.translate(media.data())

        expect(actual).toBeInstanceOf(Response)
        expect(actual.status).toBe(status)
      })
    })
  })
})

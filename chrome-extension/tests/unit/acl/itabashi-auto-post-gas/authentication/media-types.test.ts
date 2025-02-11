import {
  LoginBody,
  LoginReader,
  LoginWriter,
  LogoutReader,
  LogoutWriter,
  VerifyReader
} from "acl/itabashi-auto-post-gas/authentication"
import { Builder } from "tests/factories/common"
import {
  AuthenticationIdentifierFactory,
  CodeFactory
} from "tests/factories/domains/authentications"
import { LoginMedia } from "tests/mock/upstream/itabashi-auto-post-gas/media"
import { LogoutMedia } from "tests/mock/upstream/itabashi-auto-post-gas/media/authentication/logout"
import { VerifyMedia } from "tests/mock/upstream/itabashi-auto-post-gas/media/authentication/verify"
import { describe, expect, it } from "vitest"

describe("Package media-types", () => {
  describe("class login-reader", () => {
    describe("read", () => {
      it("success returns login-media", () => {
        const media = new LoginMedia()

        const expected = media.data()

        const reader = new LoginReader()

        const actual = reader.read(media.createSuccessfulContent())

        expect(actual).toEqual(expected)
      })
    })
  })

  describe("class logout-reader", () => {
    describe("read", () => {
      it("success returns logout-media", () => {
        const media = new LogoutMedia()

        const expected = media.data()

        const reader = new LogoutReader()

        const actual = reader.read(media.createSuccessfulContent())

        expect(actual).toEqual(expected)
      })
    })
  })

  describe("class verify-reader", () => {
    describe("read", () => {
      it("success returns verify-media", () => {
        const media = new VerifyMedia()

        const expected = media.data()

        const reader = new VerifyReader()

        const actual = reader.read(media.createSuccessfulContent())

        expect(actual).toEqual(expected)
      })
    })
  })

  describe("class login-writer", () => {
    describe("write", () => {
      it("success returns login-body", () => {
        const password = String(Math.floor(Math.random() * 1000000))

        const writer = new LoginWriter(password)

        const code = Builder.get(CodeFactory).build()

        const expected = JSON.stringify({
          payload: {
            code: {
              value: code.identifier,
              verifier: code.verifier
            },
            password
          },
          action: "login"
        } as LoginBody)

        const actual = writer.write(code)

        expect(actual).toBe(expected)
      })
    })
  })

  describe("class logout-writer", () => {
    describe("write", () => {
      it("success returns logout-body", () => {
        const password = String(Math.floor(Math.random() * 1000000))
        const authentication = Builder.get(
          AuthenticationIdentifierFactory
        ).build()

        const writer = new LogoutWriter(password)

        const expected = JSON.stringify({
          action: "logout",
          payload: {
            password,
            authentication: authentication.value
          }
        })

        const actual = writer.write(authentication)

        expect(actual).toBe(expected)
      })
    })
  })
})

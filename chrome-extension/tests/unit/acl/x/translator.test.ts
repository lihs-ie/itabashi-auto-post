import { Translator } from "acl/x/oauth"
import { Code } from "domains/authentication"
import { Builder, StringFactory } from "tests/factories/common"
import { URLFactory } from "tests/factories/domains/common"
import { describe, expect, it } from "vitest"

const createRedirectURI = (
  redirectURI: string,
  code: string,
  state: string
) => {
  const query = new URLSearchParams()

  query.append("code", code)
  query.append("state", state)

  return `${redirectURI}?${query.toString()}`
}

describe("Package translator", () => {
  describe("class translator", () => {
    describe("translate", () => {
      it("successfully returns Code.", () => {
        const redirectURI = Builder.get(URLFactory).build()
        const code = Builder.get(StringFactory(1, 255)).build()
        const state = Builder.get(StringFactory(1, 255)).build()

        const verifier = Builder.get(StringFactory(43, 128)).build()

        const translator = new Translator(
          createRedirectURI(redirectURI.value, code, state)
        )

        const actual = translator.translate(
          createRedirectURI(redirectURI.value, code, state),
          state,
          verifier
        )

        expect(actual).toBeInstanceOf(Code)
        expect(actual.identifier).toBe(code)
        expect(actual.verifier).toBe(verifier)
      })

      describe("unsuccessfully", () => {
        it("throws error with invalid redirect URI.", () => {
          const redirectURI = Builder.get(URLFactory).build()
          const code = Builder.get(StringFactory(1, 255)).build()
          const state = Builder.get(StringFactory(1, 255)).build()

          const verifier = Builder.get(StringFactory(43, 128)).build()

          const translator = new Translator(
            createRedirectURI(redirectURI.value, code, state)
          )

          expect(() => {
            translator.translate(
              `${redirectURI.value}/invalid`,
              state,
              verifier
            )
          }).toThrow(new Error("Invalid redirect URI."))
        })

        it("throws error with invalid state.", () => {
          const redirectURI = Builder.get(URLFactory).build()
          const code = Builder.get(StringFactory(1, 255)).build()
          const state = Builder.get(StringFactory(1, 255)).build()

          const verifier = Builder.get(StringFactory(43, 128)).build()

          const translator = new Translator(
            createRedirectURI(redirectURI.value, code, state)
          )

          expect(() => {
            translator.translate(
              createRedirectURI(redirectURI.value, code, state),
              state + "invalid",
              verifier
            )
          }).toThrow(
            new Error("Authorization code not found or state mismatch.")
          )
        })
      })
    })
  })
})

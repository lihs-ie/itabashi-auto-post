import { Adaptor, Translator } from "acl/x/oauth"
import { Code } from "domains/authentication"
import { afterEach } from "node:test"
import { Builder, StringFactory } from "tests/factories/common"
import { CodeFactory } from "tests/factories/domains/authentications"
import { launchWebAuthFlowMock } from "tests/mock/chrome"
import { beforeEach, describe, expect, it, vi, vitest } from "vitest"

const endpoint = "http://localhost:3000"
const clientId = "clientId"
const stateBuffer = new Uint8Array(32)
const verifier = Builder.get(StringFactory(43, 128)).build()

const createAdaptor = (redirectURI: string) =>
  new Adaptor(new Translator(redirectURI), endpoint, redirectURI, clientId)

describe("Package adaptor", () => {
  describe("class adaptor", () => {
    describe("issueCode", () => {
      const redirectURI = "http://localhost:8000"
      const expected = Builder.get(CodeFactory).build({
        verifier
      })

      beforeEach(() => {
        ;(global as any).chrome = {
          identity: {
            launchWebAuthFlow: launchWebAuthFlowMock(
              endpoint,
              redirectURI,
              stateBuffer[0].toString(),
              clientId,
              expected
            )
          }
        }

        vitest.spyOn(crypto, "getRandomValues").mockReturnValue(stateBuffer)
      })

      afterEach(() => {
        vitest.restoreAllMocks()
      })

      it("successfully returns Code.", async () => {
        const adaptor = createAdaptor(redirectURI)

        vi.spyOn(adaptor, "createVerifier" as any).mockReturnValue(verifier)

        const actual = await adaptor.issueCode()

        expect(actual).toBeInstanceOf(Code)
        expect(actual.identifier).toBe(expected.identifier)
        expect(actual.verifier).toBe(expected.verifier)
      })
    })
  })
})

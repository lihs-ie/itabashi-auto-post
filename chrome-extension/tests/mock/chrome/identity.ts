import { Code } from "domains/authentication"
import { Builder } from "tests/factories/common"
import { CodeFactory } from "tests/factories/domains/authentications"
import { expect } from "vitest"

export const launchWebAuthFlowMock = (
  authorizationURI: string,
  redirectURI: string,
  state: string,
  clientId: string,
  expected?: Code
): typeof chrome.identity.launchWebAuthFlow => {
  return async (
    details: chrome.identity.WebAuthFlowOptions
  ): Promise<string> => {
    if (!details.url.startsWith(authorizationURI)) {
      throw new Error("Mismatched authorization URI.")
    }

    const url = new URL(details.url)
    const params = new URLSearchParams(url.search)

    expect(params.get("redirect_uri")).toBe(redirectURI)
    expect(params.get("client_id")).toBe(clientId)
    expect(params.get("response_type")).toBe("code")
    expect(params.get("scope")).toBe(
      "tweet.write tweet.read users.read offline.access"
    )
    expect(params.get("state")).toBeDefined()
    expect(params.get("code_challenge")).toBeDefined()
    expect(params.get("code_challenge_method")).toBe("S256")

    if (!details.interactive) {
      throw new Error("Expected interactive to be true.")
    }

    const code = expected ?? Builder.get(CodeFactory).build()

    return Promise.resolve(
      `${redirectURI}?code=${code.identifier}&state=${state}`
    )
  }
}

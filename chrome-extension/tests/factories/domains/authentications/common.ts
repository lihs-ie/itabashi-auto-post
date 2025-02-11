import { AuthenticationIdentifier, Code } from "domains/authentication"
import { Builder, Factory, StringFactory } from "tests/factories/common"

import { UniversallyUniqueIdentifierFactory } from "../common"

export class AuthenticationIdentifierFactory extends UniversallyUniqueIdentifierFactory(
  AuthenticationIdentifier
) {}

export type CodeProperties = {
  identifier: string
  verifier: string
}

export class CodeFactory extends Factory<Code, CodeProperties> {
  protected instantiate(properties: CodeProperties): Code {
    return new Code(properties.identifier, properties.verifier)
  }

  protected prepare(
    overrides: Partial<CodeProperties>,
    seed: number
  ): CodeProperties {
    return {
      identifier: Builder.get(StringFactory(1, 255)).buildWith(seed),
      verifier: Builder.get(StringFactory(43, 128)).buildWith(seed),
      ...overrides
    }
  }

  protected retrieve(instance: Code): CodeProperties {
    return {
      identifier: instance.identifier,
      verifier: instance.verifier
    }
  }
}

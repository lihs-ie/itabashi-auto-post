import { PersistClient } from "acl/common"
import {
  Adaptor,
  LoginReader,
  LoginWriter,
  LogoutReader,
  LogoutWriter,
  Translator,
  VerifyReader
} from "acl/itabashi-auto-post-gas/authentication"
import { itabashiAutoPostGAS } from "config"
import { Map } from "immutable"
import { ContainerModule } from "inversify"

export const gasAuthenticationACL = new ContainerModule(({ bind }) => {
  bind(LoginReader).toSelf()
  bind(LogoutReader).toSelf()
  bind(VerifyReader).toSelf()

  bind(LoginWriter).toDynamicValue(
    () => new LoginWriter(itabashiAutoPostGAS.PASSWORD)
  )
  bind(LogoutWriter).toDynamicValue(
    () => new LogoutWriter(itabashiAutoPostGAS.PASSWORD)
  )

  bind(Translator).toSelf()

  bind(Adaptor).toDynamicValue(
    (context) =>
      new Adaptor(
        Map({
          login: context.get(LoginReader),
          logout: context.get(LogoutReader),
          verify: context.get(VerifyReader)
        }),
        Map({
          login: context.get(LoginWriter),
          logout: context.get(LogoutWriter)
        }),
        context.get(Translator),
        itabashiAutoPostGAS.API_ENDPOINT,
        new PersistClient()
      )
  )
})

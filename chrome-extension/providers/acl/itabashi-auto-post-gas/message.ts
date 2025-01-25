import {
  Adaptor,
  Reader,
  Translator,
  Writer
} from "acl/itabashi-auto-post-gas/message"
import { itabashiAutoPostGAS } from "config"
import { ContainerModule } from "inversify"

export const gasMessageAcl = new ContainerModule((bind) => {
  bind(Reader).toSelf()

  bind(Writer).toDynamicValue(() => new Writer(itabashiAutoPostGAS.PASSWORD))

  bind(Translator).toSelf()

  bind(Adaptor).toDynamicValue(
    (context) =>
      new Adaptor(
        context.container.get(Writer),
        context.container.get(Reader),
        context.container.get(Translator),
        itabashiAutoPostGAS.API_ENDPOINT,
        chrome.storage.local
      )
  )
})

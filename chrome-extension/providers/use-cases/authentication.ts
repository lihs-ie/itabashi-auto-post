import { Repository } from "domains/authentication"
import { ContainerModule } from "inversify"
import { Authentication } from "use-cases"

export const authentication = new ContainerModule((bind) => {
  bind(Authentication).toDynamicValue(
    (context) => new Authentication(context.container.get(Repository))
  )
})

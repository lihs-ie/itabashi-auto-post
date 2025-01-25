import { Adaptor as GasAdaptor } from "acl/itabashi-auto-post-gas/authentication"
import { Adaptor } from "acl/x/oauth"
import { Repository } from "domains/authentication"
import { ACLAuthenticationRepository } from "infrastructures"
import { ContainerModule } from "inversify"

export const authentication = new ContainerModule((bind) => {
  bind(Repository).toDynamicValue(
    (context) =>
      new ACLAuthenticationRepository(
        context.container.get(Adaptor),
        context.container.get(GasAdaptor)
      )
  )
})

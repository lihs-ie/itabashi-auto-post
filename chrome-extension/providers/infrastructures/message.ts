import { Adaptor } from "acl/itabashi-auto-post-gas/message"
import { Repository } from "domains/message"
import { ACLMessageRepository } from "infrastructures"
import { ContainerModule } from "inversify"

export const message = new ContainerModule((bind) => {
  bind(Repository).toDynamicValue(
    (context) => new ACLMessageRepository(context.container.get(Adaptor))
  )
})

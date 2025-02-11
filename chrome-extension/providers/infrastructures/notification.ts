import { Adaptor } from "acl/setting/notification"
import { Repository } from "domains/setting/notification"
import { ACLNotificationRepository } from "infrastructures/notification"
import { ContainerModule } from "inversify"

export const notification = new ContainerModule((bind) => {
  bind(Repository).toDynamicValue(
    (context) => new ACLNotificationRepository(context.container.get(Adaptor))
  )
})

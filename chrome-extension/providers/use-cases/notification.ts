import { Repository } from "domains/setting/notification"
import { ContainerModule } from "inversify"
import { Notification } from "use-cases"

export const notification = new ContainerModule((bind) => {
  bind(Notification).toDynamicValue(
    (context) => new Notification(context.container.get(Repository))
  )
})

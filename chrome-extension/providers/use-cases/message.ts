import { Repository } from "domains/message"
import { ContainerModule } from "inversify"
import { Message } from "use-cases"

export const message = new ContainerModule((bind) => {
  bind(Message).toDynamicValue(
    (context) => new Message(context.container.get(Repository))
  )
})

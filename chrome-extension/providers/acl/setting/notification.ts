import { Adaptor, Reader, Translator, Writer } from "acl/setting/notification"
import { setting } from "config"
import image from "data-base64:~assets/icon.png"
import { ContainerModule } from "inversify"

export const notificationACL = new ContainerModule((bind) => {
  bind(Reader).toSelf()

  bind(Writer).toSelf()

  bind(Translator).toSelf()

  bind(Adaptor).toDynamicValue(
    (context) =>
      new Adaptor(
        context.container.get(Reader),
        context.container.get(Writer),
        context.container.get(Translator),
        setting.notification.PERSISTENCE_KEY,
        chrome.notifications,
        image,
        chrome.storage.local
      )
  )
})

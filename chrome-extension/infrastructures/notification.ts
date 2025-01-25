import { Adaptor } from "acl/setting/notification";
import { Notification, NotificationIdentifier, Repository } from "domains/setting/notification";
import { List } from "immutable";
import { injectable } from "inversify";

@injectable()
export class ACLNotificationRepository implements Repository {
  constructor(private readonly adaptor: Adaptor) {}

  public async persist(notification: Notification): Promise<void> {
    await this.adaptor.persist(notification);
  }

  public async remove(identifier: NotificationIdentifier): Promise<void> {
    await this.adaptor.remove(identifier);
  }

  public async find(identifier: NotificationIdentifier): Promise<Notification> {
    return await this.adaptor.find(identifier);
  }

  public async list(): Promise<List<Notification>> {
    return await this.adaptor.list();
  }

  public async send(identifier: NotificationIdentifier): Promise<void> {
    await this.adaptor.send(identifier);
  }
}

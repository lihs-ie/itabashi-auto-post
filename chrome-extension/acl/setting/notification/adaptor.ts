import { StorageAdaptor } from "acl/common";
import { injectable } from "inversify";
import { Reader, Writer } from "./media-type";
import { Notification, NotificationIdentifier, Priority } from "domains/setting/notification";
import { Translator } from "./translator";
import { List } from "immutable";

@injectable()
export class Adaptor extends StorageAdaptor {
  constructor(
    private readonly reader: Reader,
    private readonly writer: Writer,
    private readonly translator: Translator,
    private readonly key: string,
    private readonly notificationClient: typeof chrome.notifications,
    private readonly notificationIconUrl: string,
    storageClient: chrome.storage.LocalStorageArea
  ) {
    super(storageClient);
  }

  public async persist(notification: Notification): Promise<void> {
    let restored = await this.restore();

    const index = restored.findIndex(
      (existence) => notification.identifier.equals(existence.identifier)
    );

    if (index !== -1) {
      restored = restored.set(index, notification);
    } else {
      restored = restored.push(notification);
    }

    await this.set(this.key, this.createPayload(restored));
  }

  public async remove(identifier: NotificationIdentifier): Promise<void> {
    const restored = await this.restore();

    const target = restored.find((existence) => identifier.equals(existence.identifier));

    if (!target) {
      throw new Error(`Notification ${identifier.value} is not found.`);
    }

    await this.set(
      this.key,
      this.createPayload(
        restored.filter((existence) => !identifier.equals(existence.identifier))
      )
    );
  }

  public async find(identifier: NotificationIdentifier): Promise<Notification> {
    const restored = await this.restore();

    const target = restored.find((notification) => identifier.equals(notification.identifier));

    if (target) {
      return target;
    }

    throw new Error(`Notification ${identifier.value} is not found.`);
  }

  public async list(): Promise<List<Notification>> {
    return this.restore();
  }

  public async send(identifier: NotificationIdentifier): Promise<void> {
    const restored = await this.restore();

    const target = restored.find((notification) => identifier.equals(notification.identifier));

    if (!target) {
      throw new Error(`Notification ${identifier.value} is not found.`);
    }

    this.notificationClient.create(target.identifier.value, {
      type: "basic",
      title: target.title,
      message: target.description ?? "",
      iconUrl: this.notificationIconUrl,
      priority: this.convertPriority(target.priority),
    });
  }

  private createPayload(notifications: List<Notification>): Array<string> {
    return notifications.map((notification) => this.writer.write(notification)).toArray()
  }

  private async restore(): Promise<List<Notification>> {
    const payload = await this.get<Array<string>>(this.key);

    if (!payload) {
      return List();
    }

    return List(payload).map((content) => {
      const media = this.reader.read(content);

      return this.translator.translate(media);
    });
  }

  private convertPriority(priority: Priority): number {
    switch (priority) {
      case "high":
        return 2;

      case "normal":
        return 1;

      case "low":
        return 0;

      default:
        throw new Error(`Unknown priority: ${priority}`);
    }
  }
}

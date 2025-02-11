import {
  Notification as Entity,
  NotificationIdentifier,
  Repository
} from "domains/setting/notification"

export class Notification {
  constructor(private readonly repository: Repository) {}

  public async find(identifier: string) {
    return await this.repository.find(new NotificationIdentifier(identifier))
  }

  public async list() {
    return await this.repository.list()
  }

  public async persist(entity: Entity) {
    await this.repository.persist(entity)
  }

  public async remove(identifier: string) {
    await this.repository.remove(new NotificationIdentifier(identifier))
  }

  public async send(identifier: string) {
    await this.repository.send(new NotificationIdentifier(identifier))
  }
}

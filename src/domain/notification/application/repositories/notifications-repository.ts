import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>
  abstract findById(id: string): Promise<Notification | null>
  abstract save(notification: Notification): Promise<void>
}

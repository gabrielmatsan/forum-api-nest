import { NotificationRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PrismaService } from '../prisma.service'
import { NotificationMapper } from '../mappers/prisma-notification-mapper'

export class PrismaNotificationsRepository implements NotificationRepository {
  constructor(private prisma: PrismaService) {}
  async create(notification: Notification): Promise<void> {
    console.log(
      'Notification data:',
      NotificationMapper.toPersitent(notification),
    )
    const data = NotificationMapper.toPersitent(notification)

    await this.prisma.notification.create({
      data,
    })
    console.log('Notification successfully created in DB.')
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    if (!notification) {
      return null
    }

    return NotificationMapper.toDomain(notification)
  }

  async save(notification: Notification): Promise<void> {
    const data = NotificationMapper.toPersitent(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}

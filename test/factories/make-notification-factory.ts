import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  NotificationProps,
  Notification,
} from '@/domain/notification/enterprise/entities/notification'
import { NotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(12),
      ...override,
    },
    id,
  )

  return notification
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a notification in the database and return the created notification.
   *
   * @param data - Optional data to override default values.
   * @returns A Promise that resolves with the created notification.
   */
  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: NotificationMapper.toPersitent(notification),
    })

    return notification
  }
}

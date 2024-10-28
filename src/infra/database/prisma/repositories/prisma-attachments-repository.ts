import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AttachmentMapper } from '../mappers/prisma-attachment-mapper'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new attachment
   *
   * @param attachment - The attachment to create
   */
  async create(attachment: Attachment): Promise<void> {
    const data = AttachmentMapper.toPersistent(attachment) // Formato DB Prisma

    await this.prisma.attachment.create({ data })
  }
}

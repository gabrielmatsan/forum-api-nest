import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'
export class AnswerAttachmentMapper {
  /**
   * Converts a PrismaAttachment object to a domain AnswerAttachment object.
   *
   * This function maps the properties from a PrismaAttachment, which represents
   * the database layer, to a AnswerAttachment domain object, which is used in the
   * business logic layer.
   *
   * @param raw - The raw PrismaAttachment object containing database record values.
   * @returns A AnswerAttachment domain object with mapped properties.
   */
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    // Throw an error if answerId is null
    if (!raw.answerId) {
      throw new Error('AnswerAttachment.answerId cannot be null')
    }

    // Create a new domain AnswerAttachment object using the properties from the raw PrismaAttachment
    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.answerId), // Convert answerId to UniqueEntityID
        attachmentId: new UniqueEntityID(raw.id), // Convert id to UniqueEntityID
      },
      new UniqueEntityID(raw.id), // Convert id to UniqueEntityID
    )
  }

  static toPersistentUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    }
  }
}

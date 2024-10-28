import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'
export class QuestionAttachmentMapper {
  /**
   * Converts a PrismaAttachment object to a domain QuestionAttachment object.
   *
   * This function maps the properties from a PrismaAttachment, which represents
   * the database layer, to a QuestionAttachment domain object, which is used in the
   * business logic layer.
   *
   * @param raw - The raw PrismaAttachment object containing database record values.
   * @returns A QuestionAttachment domain object with mapped properties.
   */
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    // Throw an error if questionId is null
    if (!raw.questionId) {
      throw new Error('QuestionAttachment.questionId cannot be null')
    }

    // Create a new domain QuestionAttachment object using the properties from the raw PrismaAttachment
    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(raw.questionId), // Convert questionId to UniqueEntityID
        attachmentId: new UniqueEntityID(raw.id), // Convert id to UniqueEntityID
      },
      new UniqueEntityID(raw.id), // Convert id to UniqueEntityID
    )
  }

  static toPersistentUpdateMany(
    attachments: QuestionAttachment[],
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
        questionId: attachments[0].questionId.toString(),
      },
    }
  }
}

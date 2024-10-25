import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'
export class AnswerCommentMapper {
  /**
   * Converts a PrismaComment object to a domain AnswerComment object.
   *
   * This function maps the properties from a PrismaComment, which represents
   * the database layer, to a AnswerComment domain object, which is used in the
   * business logic layer.
   *
   * @param raw - The raw PrismaComment object containing database record values.
   * @returns A AnswerComment domain object with mapped properties.
   */
  static toDomain(raw: PrismaComment): AnswerComment {
    // Throw an error if answerId is null
    if (!raw.answerId) {
      throw new Error('AnswerComment.answerId cannot be null')
    }

    // Create a new domain AnswerComment object using the properties from the raw PrismaComment
    return AnswerComment.create(
      {
        content: raw.content, // Map the content to content
        answerId: new UniqueEntityID(raw.answerId), // Convert answerId to UniqueEntityID
        authorId: new UniqueEntityID(raw.authorId), // Convert authorId to UniqueEntityID
        createdAt: raw.createdAt, // Map the created_at timestamp
        updatedAt: raw.updatedAt, // Map the updated_at timestamp
      },
      new UniqueEntityID(raw.id), // Convert id to UniqueEntityID
    )
  }

  static toPersitent(raw: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      authorId: raw.authorId.toString(),
      answerId: raw.answerId.toString(),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}

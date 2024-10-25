import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'
export class QuestionCommentMapper {
  /**
   * Converts a PrismaComment object to a domain QuestionComment object.
   *
   * This function maps the properties from a PrismaComment, which represents
   * the database layer, to a QuestionComment domain object, which is used in the
   * business logic layer.
   *
   * @param raw - The raw PrismaComment object containing database record values.
   * @returns A QuestionComment domain object with mapped properties.
   */
  static toDomain(raw: PrismaComment): QuestionComment {
    // Throw an error if questionId is null
    if (!raw.questionId) {
      throw new Error('QuestionComment.questionId cannot be null')
    }

    // Create a new domain QuestionComment object using the properties from the raw PrismaComment
    return QuestionComment.create(
      {
        content: raw.content, // Map the content to content
        questionId: new UniqueEntityID(raw.questionId), // Convert questionId to UniqueEntityID
        authorId: new UniqueEntityID(raw.authorId), // Convert authorId to UniqueEntityID
        createdAt: raw.createdAt, // Map the created_at timestamp
        updatedAt: raw.updatedAt, // Map the updated_at timestamp
      },
      new UniqueEntityID(raw.id), // Convert id to UniqueEntityID
    )
  }

  static toPersitent(raw: QuestionComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      authorId: raw.authorId.toString(),
      questionId: raw.questionId.toString(),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}

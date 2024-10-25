import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Answer as PrismaAnswer, Prisma } from '@prisma/client'
export class AnswerMapper {
  /**
   * Converts a PrismaAnswer object to a domain Answer object.
   *
   * This function maps the properties from a PrismaAnswer, which represents
   * the database layer, to a Answer domain object, which is used in the
   * business logic layer.
   *
   * @param raw - The raw PrismaAnswer object containing database record values.
   * @returns A Answer domain object with mapped properties.
   */
  static toDomain(raw: PrismaAnswer): Answer {
    // Create a new domain Answer object using the properties from the raw PrismaAnswer
    return Answer.create(
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

  static toPersitent(raw: Answer): Prisma.AnswerUncheckedCreateInput {
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

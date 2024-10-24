import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/values-objects/slug'
import { Question as PrismaQuestion, Prisma } from '@prisma/client'
export class QuestionMapper {
  /**
   * Converts a PrismaQuestion object to a domain Question object.
   *
   * This function maps the properties from a PrismaQuestion, which represents
   * the database layer, to a Question domain object, which is used in the
   * business logic layer.
   *
   * @param raw - The raw PrismaQuestion object containing database record values.
   * @returns A Question domain object with mapped properties.
   */
  static toDomain(raw: PrismaQuestion): Question {
    // Create a new domain Question object using the properties from the raw PrismaQuestion
    return Question.create(
      {
        title: raw.title, // Map the title
        content: raw.content, // Map the content to content
        authorId: new UniqueEntityID(raw.authorId), // Convert authorId to UniqueEntityID
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null, // Initialize bestAnswerId as undefined
        slug: Slug.create(raw.slug), // Create a Slug object from the slug string
        createdAt: raw.createdAt, // Map the created_at timestamp
        updatedAt: raw.updatedAt, // Map the updated_at timestamp
      },
      new UniqueEntityID(raw.id), // Convert id to UniqueEntityID
    )
  }

  static toPersitent(raw: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      authorId: raw.authorId.toString(),
      bestAnswerId: raw.bestAnswerId ? raw.bestAnswerId.toString() : null,
      title: raw.title,
      content: raw.content,
      slug: raw.slug.value,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}

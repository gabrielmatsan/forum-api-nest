import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { QuestionMapper } from '../mappers/prisma-question-mapper'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  /**
   * Create a new question
   *
   * @param question - The question to create
   */
  async create(question: Question): Promise<void> {
    const data = QuestionMapper.toPersitent(question) // Formato DB Prisma

    await this.prisma.question.create({ data })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }

  /**
   * Update a question
   *
   * @param question - The question to update
   */
  async update(question: Question): Promise<void> {
    const data = QuestionMapper.toPersitent(question) // Formato DB Prisma

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ])
  }

  /**
   * Delete a question
   *
   * @param question - The question to delete
   */
  async delete(question: Question): Promise<void> {
    const data = QuestionMapper.toPersitent(question) // Formato DB Prisma

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }

  /**
   * Find a question by slug.
   *
   * @param slug - The slug to search for
   * @returns The question found, or null if not found
   */
  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return QuestionMapper.toDomain(question)
  }

  /**
   * Find a question by ID.
   *
   * @param id - The ID to search for
   * @returns The question found, or null if not found
   */
  async findByID(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return QuestionMapper.toDomain(question)
  }

  /**
   * Find many questions ordered by creation date descending.
   *
   * @param page - Parameters to control pagination
   * @returns A list of questions
   */
  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(QuestionMapper.toDomain)
  }
}

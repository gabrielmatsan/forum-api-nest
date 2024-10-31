import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AnswerMapper } from '../mappers/prisma-answer-mapper'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = AnswerMapper.toPersitent(answer) // Formato DB Prisma

    await this.prisma.answer.create({ data })

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async update(answer: Answer): Promise<void> {
    const data = AnswerMapper.toPersitent(answer) // Formato DB Prisma

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ])

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return AnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        questionId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    return answers.map(AnswerMapper.toDomain)
  }
}

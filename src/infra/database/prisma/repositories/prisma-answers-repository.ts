import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}
  async create(answer: Answer): Promise<void> {
    const data = AnswerMapper.toPersitent(answer) // Formato DB Prisma

    await this.prisma.answer.create({ data })
  }

  async update(question: Answer): Promise<void> {
    const data = AnswerMapper.toPersitent(question) // Formato DB Prisma

    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    })
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

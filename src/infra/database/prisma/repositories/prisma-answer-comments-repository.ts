import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}
  async create(answerComment: AnswerComment): Promise<void> {
    const data = AnswerCommentMapper.toPersitent(answerComment) // Formato DB Prisma

    await this.prisma.comment.create({ data })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    })
  }

  async findById(answerCommentId: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    })

    if (!answerComment) {
      return null
    }

    return AnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        answerId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })
    return answerComments.map(AnswerCommentMapper.toDomain)
  }
}

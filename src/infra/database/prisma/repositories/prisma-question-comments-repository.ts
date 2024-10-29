import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { QuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { CommentsWithAuthor } from '@/domain/forum/enterprise/entities/values-objects/comments-with-author'
import { CommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}
  async create(questionComment: QuestionComment): Promise<void> {
    const data = QuestionCommentMapper.toPersitent(questionComment) // Formato DB Prisma

    await this.prisma.comment.create({ data })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    })
  }

  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    })

    if (!questionComment) {
      return null
    }

    return QuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        questionId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })
    return questionComments.map(QuestionCommentMapper.toDomain)
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentsWithAuthor[]> {
    const questionComments = await this.prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        questionId,
      },
      include: {
        author: true,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })
    return questionComments.map(CommentWithAuthorMapper.toDomain)
  }
}

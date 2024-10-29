import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentsWithAuthor } from '../../enterprise/entities/values-objects/comments-with-author'

export abstract class AnswerCommentsRepository {
  abstract create(comment: AnswerComment): Promise<void>
  abstract delete(comment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentsWithAuthor[]>
}

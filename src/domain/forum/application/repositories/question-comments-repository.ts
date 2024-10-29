import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentsWithAuthor } from '../../enterprise/entities/values-objects/comments-with-author'

export abstract class QuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>

  abstract delete(questionComment: QuestionComment): Promise<void>

  abstract findById(questionCommentId: string): Promise<QuestionComment | null>

  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentsWithAuthor[]>
}

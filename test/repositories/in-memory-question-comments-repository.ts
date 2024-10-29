import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentsWithAuthor } from '@/domain/forum/enterprise/entities/values-objects/comments-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComment = await this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComment
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentsWithAuthor[]> {
    const questionComment = await this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID ${comment.authorId.toString()} not found`,
          )
        }

        return CommentsWithAuthor.create({
          content: comment.content,
          authorId: comment.authorId,
          authorName: author?.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          commentId: comment.id,
        })
      })

    return questionComment
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async findById(questionCommentId: string) {
    const questionComment = await this.items.find(
      (item) => item.id.toString() === questionCommentId,
    )
    if (!questionComment) {
      throw new Error('Comment not found')
    }

    return questionComment
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}

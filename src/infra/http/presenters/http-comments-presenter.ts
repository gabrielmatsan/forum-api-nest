import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class HttpCommentsPresenter {
  static toHttp(comment: QuestionComment | AnswerComment) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}

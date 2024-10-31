import { QuestionDetails } from '@/domain/forum/enterprise/entities/values-objects/question-details'
import { HttpAttachmentsPresenter } from './http-attachments-presenter'

export class HttpQuestionDetailsPresenter {
  static toHttp(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      authorName: questionDetails.authorName,
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
      attachments: questionDetails.attachments.map(
        HttpAttachmentsPresenter.toHttp,
      ),
    }
  }
}

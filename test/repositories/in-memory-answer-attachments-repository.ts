import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  // FIND
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
    this.items = answerAttachments
  }

  // DELETE
  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return answerAttachments
  }
}

import { QuestionsRepository } from '../repositories/questions-repository'
import { left, right, Either } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface RemoveQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type RemoveQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class RemoveQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: RemoveQuestionUseCaseRequest): Promise<RemoveQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findByID(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }
    await this.questionsRepository.delete(question)

    return right(null)
  }
}

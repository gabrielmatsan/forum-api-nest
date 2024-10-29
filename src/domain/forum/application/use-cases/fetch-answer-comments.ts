import { right, Either } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answers-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentsWithAuthor } from '../../enterprise/entities/values-objects/comments-with-author'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentsWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      )

    return right({ comments })
  }
}

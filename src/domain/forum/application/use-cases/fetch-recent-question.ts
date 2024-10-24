import { right, Either } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentQuestionUseCaseRequest {
  page: number
}

type FetchRecentQuestionUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>
@Injectable()
export class FetchRecentQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionUseCaseRequest): Promise<FetchRecentQuestionUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })
    return right({ questions })
  }
}

import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-recent-question'
import { HttpQuestionPresenter } from '../presenters/http-question-presenter'

const pageQueryParamSchema = z.coerce.number().optional().default(1)

// const otherWay = z
//   .string()
//   .optional()
//   .default('1')
//   .transform(Number)
//   .pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.questions

    return { questions: questions.map(HttpQuestionPresenter.toHttp) }
  }
}

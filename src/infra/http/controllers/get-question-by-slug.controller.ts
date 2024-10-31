import {
  BadRequestException,
  Controller,
  Get,
  Injectable,
  Param,
} from '@nestjs/common'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { HttpQuestionDetailsPresenter } from '../presenters/http-question-details-presenter'

@Injectable()
@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      question: HttpQuestionDetailsPresenter.toHttp(result.value.question),
    }
  }
}

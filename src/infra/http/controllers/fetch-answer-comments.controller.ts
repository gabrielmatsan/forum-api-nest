import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { HttpCommentWithAuthorPresenter } from '../presenters/http-comment-with-author-presenter'

const fetchAnswerCommentsBodySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(fetchAnswerCommentsBodySchema)

type PageQueryParamSchema = z.infer<typeof fetchAnswerCommentsBodySchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}
  @Get()
  async handle(
    @Query('page', pageValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      answerId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const comments = result.value.comments

    return { comments: comments.map(HttpCommentWithAuthorPresenter.toHttp) }
  }
}

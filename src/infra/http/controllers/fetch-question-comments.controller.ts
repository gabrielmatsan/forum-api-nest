import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { HttpCommentWithAuthorPresenter } from '../presenters/http-comment-with-author-presenter'

const fetchQuestionCommentsBodySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(
  fetchQuestionCommentsBodySchema,
)

type PageQueryParamSchema = z.infer<typeof fetchQuestionCommentsBodySchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}
  @Get()
  async handle(
    @Query('page', pageValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const comments = result.value.comments

    return { comments: comments.map(HttpCommentWithAuthorPresenter.toHttp) }
  }
}

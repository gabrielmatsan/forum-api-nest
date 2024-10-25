import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { RemoveQuestionUseCase } from '@/domain/forum/application/use-cases/remove-question'

// @UseGuards(AuthGuard('jwt')) outra forma
@Controller('/questions/:id')
export class RemoveQuestionController {
  constructor(private removeQuestion: RemoveQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id')
    questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.removeQuestion.execute({
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

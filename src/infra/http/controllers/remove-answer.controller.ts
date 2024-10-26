import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { RemoveAnswerUseCase } from '@/domain/forum/application/use-cases/remove-answer'

// @UseGuards(AuthGuard('jwt')) outra forma
@Controller('/answers/:id')
export class RemoveAnswerController {
  constructor(private removeAnswer: RemoveAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id')
    answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.removeAnswer.execute({
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

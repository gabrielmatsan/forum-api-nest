import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

// em vez do uso de usePipe, colocaremos o zodValidationPipe diretamente do body

// Define um tipo TypeScript baseado no esquema de validação do Zod
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

// @UseGuards(AuthGuard('jwt')) outra forma
@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(createQuestionBodySchema)) // nao vai funcionar, pois esta tentando validar todos os campos da funcao, por isso, o certo é passar a validação somente no body
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

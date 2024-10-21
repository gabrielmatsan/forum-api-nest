import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

// em vez do uso de usePipe, colocaremos o zodValidationPipe diretamente do body

// Define um tipo TypeScript baseado no esquema de validação do Zod
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(createQuestionBodySchema)) // nao vai funcionar, pois esta tentando validar todos os campos da funcao, por isso, o certo é passar a validação somente no body
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const userId = user.sub

    await this.prisma.question.create({
      data: {
        title,
        content,
        authorId: userId,
        slug: this.stringToSlug(title),
      },
    })
  }

  private stringToSlug(text: string): string {
    return text
      .toLowerCase() // Convert to lowercase
      .normalize('NFD') // Normalize the string to separate accents from letters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics
      .trim() // Trim leading/trailing whitespace
      .replace(/[^\w\s-]/g, '') // Remove all non-word characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Remove duplicate hyphens
  }
}
